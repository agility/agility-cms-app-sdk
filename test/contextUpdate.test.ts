import { describe, expect, it } from "vitest"
import { readContextUpdate } from "../src/lib/contextUpdate"

const parent = {}
const msg = (data: unknown, source: unknown = parent) => ({ data, source }) as unknown as MessageEvent

describe("readContextUpdate", () => {
	it("reads a section panel's open item and parent", () => {
		const update = readContextUpdate(
			msg({ appID: "app-1", operationType: "contextUpdated", arg: { item: { name: "privatefile", id: "6f1c-ab12" }, parent: { name: "privatefiles", id: "root" } } }),
			"app-1",
			parent
		)
		expect(update).toEqual({ item: { name: "privatefile", id: "6f1c-ab12" }, parent: { name: "privatefiles", id: "root" } })
	})

	it("reads null as back at the section's home", () => {
		expect(readContextUpdate(msg({ appID: "app-1", operationType: "contextUpdated", arg: { item: null, parent: null } }), "app-1", parent)).toEqual({
			item: null,
			parent: null
		})
	})

	it("leaves out a field the host didn't send, so it keeps its value", () => {
		expect(readContextUpdate(msg({ appID: "app-1", operationType: "contextUpdated", arg: { item: { name: "a", id: "1" } } }), "app-1", parent)).toEqual({
			item: { name: "a", id: "1" }
		})
	})

	it("ignores other windows, other apps and other operations", () => {
		const data = { appID: "app-1", operationType: "contextUpdated", arg: { item: null } }
		expect(readContextUpdate(msg(data, {}), "app-1", parent)).toBeNull()
		expect(readContextUpdate(msg({ ...data, appID: "app-2" }), "app-1", parent)).toBeNull()
		expect(readContextUpdate(msg({ ...data, operationType: "context" }), "app-1", parent)).toBeNull()
		expect(readContextUpdate(msg(data), null, parent)).toBeNull()
		expect(readContextUpdate(msg({ ...data, arg: "x" }), "app-1", parent)).toBeNull()
	})

	it("drops a malformed stack entry to null", () => {
		expect(readContextUpdate(msg({ appID: "app-1", operationType: "contextUpdated", arg: { item: { id: "1" }, parent: "x" } }), "app-1", parent)).toEqual({
			item: null,
			parent: null
		})
	})
})
