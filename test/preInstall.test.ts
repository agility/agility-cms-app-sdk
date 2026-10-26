import { describe, expect, it } from "vitest"
import { readPreInstallContext } from "../src/lib/preInstallContext"

describe("readPreInstallContext (useAgilityPreInstall)", () => {
	it("keeps the instance and locale from the host's preInstall reply, with the app and user", () => {
		const context: any = {
			app: { appID: "app-1", configuration: {} },
			instance: { guid: "abc-u", websiteName: "site", orgCode: null, orgName: "Org" },
			locale: "en-us",
			user: { userID: 5, emailAddress: "a@example.com", fullName: "A", isOrgAdmin: false, permissions: [], teamIDs: [] }
		}
		expect(readPreInstallContext(context)).toEqual({
			appInstallContext: context.app,
			instance: context.instance,
			locale: "en-us",
			user: context.user
		})
	})

	it("returns null for anything the host didn't send", () => {
		expect(readPreInstallContext({ app: { appID: "app-1", configuration: {} } })).toEqual({
			appInstallContext: { appID: "app-1", configuration: {} },
			instance: null,
			locale: null,
			user: null
		})
		expect(readPreInstallContext(null)).toEqual({ appInstallContext: null, instance: null, locale: null, user: null })
	})
})
