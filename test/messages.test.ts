import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { getNavigationUrl } from "../src/methods/getNavigationUrl"
import { navigate } from "../src/methods/navigate"
import { resolveEmbed } from "../src/methods/resolveEmbed"
import { setTitle } from "../src/methods/setTitle"
import { getOperation } from "../src/lib/operationAccess"

// The SDK only talks to its host through window.parent.postMessage, so these tests stand in a
// minimal window and check the exact messages the Manager App receives.
const postMessage = vi.fn()

function stubWindow(search: string) {
	vi.stubGlobal("window", { location: { search }, parent: { postMessage } })
}

const lastMessage = () => {
	expect(postMessage).toHaveBeenCalled()
	const [message, targetOrigin] = postMessage.mock.calls[postMessage.mock.calls.length - 1]
	expect(targetOrigin).toBe("*")
	return message
}

beforeEach(() => {
	postMessage.mockReset()
	stubWindow("?appID=app-1&closeModalID=dialog-1")
})

afterEach(() => {
	vi.unstubAllGlobals()
})

describe("setTitle", () => {
	it("sends a setTitle operation with the title", () => {
		setTitle({ title: "Unit 4 handouts" })
		expect(lastMessage()).toMatchObject({
			appID: "app-1",
			operationType: "setTitle",
			arg: { title: "Unit 4 handouts" }
		})
		expect(lastMessage().operationID).toMatch(/^operation-\d+$/)
	})

	it("sends nothing without an appID", () => {
		stubWindow("")
		setTitle({ title: "x" })
		expect(postMessage).not.toHaveBeenCalled()
	})
})

describe("navigate", () => {
	it("sends an appSection target", () => {
		void navigate({ target: { type: "appSection", name: "my-library" } })
		expect(lastMessage()).toMatchObject({
			appID: "app-1",
			operationType: "navigate",
			arg: { target: { type: "appSection", name: "my-library" } }
		})
	})

	it("sends an appItem target with replace and openInStack", () => {
		void navigate({
			target: { type: "appItem", name: "libraryfolder", id: "6f1c-ab12", replace: true },
			openInStack: false
		})
		expect(lastMessage()).toMatchObject({
			operationType: "navigate",
			arg: {
				target: { type: "appItem", name: "libraryfolder", id: "6f1c-ab12", replace: true },
				openInStack: false
			}
		})
	})

	it("resolves with the host's reply to its operation", async () => {
		const pending = navigate({ target: { type: "appItem", name: "libraryfile", id: "12" } })
		const { operationID } = lastMessage()
		getOperation(operationID)?.next({ url: "https://host.test/x", path: "/x" })
		await expect(pending).resolves.toEqual({ url: "https://host.test/x", path: "/x" })
	})

	it("returns undefined without an appID", () => {
		stubWindow("")
		expect(navigate({ target: { type: "appSection", name: "my-library" } })).toBeUndefined()
		expect(postMessage).not.toHaveBeenCalled()
	})
})

describe("getNavigationUrl", () => {
	it("sends an appItem target", () => {
		void getNavigationUrl({ target: { type: "appItem", name: "libraryfile", id: "12" } })
		expect(lastMessage()).toMatchObject({
			operationType: "getNavigationUrl",
			arg: { target: { type: "appItem", name: "libraryfile", id: "12" } }
		})
	})
})

describe("resolveEmbed", () => {
	it("sends a link insert with the dialog's closeModalID", () => {
		resolveEmbed({
			insert: {
				kind: "link",
				href: "/files/report.pdf",
				text: "Quarterly report.pdf",
				attributes: { "data-file-id": "6f1c" }
			}
		})
		expect(lastMessage()).toMatchObject({
			appID: "app-1",
			operationType: "resolveEmbed",
			arg: {
				closeModalID: "dialog-1",
				insert: {
					kind: "link",
					href: "/files/report.pdf",
					text: "Quarterly report.pdf",
					attributes: { "data-file-id": "6f1c" }
				}
			}
		})
	})

	it("passes innerHTML and attributes through for an element embed", () => {
		resolveEmbed({ value: { a: 1 }, innerHTML: "<p>Hi</p>", attributes: { "data-theme": "dark" } })
		expect(lastMessage().arg).toEqual({
			closeModalID: "dialog-1",
			value: { a: 1 },
			innerHTML: "<p>Hi</p>",
			attributes: { "data-theme": "dark" }
		})
	})

	it("sends cancelled", () => {
		resolveEmbed({ cancelled: true })
		expect(lastMessage().arg).toEqual({ closeModalID: "dialog-1", cancelled: true })
	})

	it("sends nothing without a closeModalID", () => {
		stubWindow("?appID=app-1")
		resolveEmbed({ cancelled: true })
		expect(postMessage).not.toHaveBeenCalled()
	})
})
