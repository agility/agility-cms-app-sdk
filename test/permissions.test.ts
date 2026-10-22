import { describe, expect, it } from "vitest"
import { hasPermission, Permission } from "../src/permissions"
import { IUser } from "../src/types/IUser"

const user = (permissions: number[]): IUser => ({
	userID: 1,
	emailAddress: "editor@example.com",
	fullName: "Example Editor",
	isOrgAdmin: false,
	permissions,
	teamIDs: []
})

describe("Permission", () => {
	// The IDs are the wire format, shared with the Manager App: they must never move.
	it("keeps the Manager App's permission IDs", () => {
		expect(Permission.Deny).toBe(0)
		expect(Permission.Read).toBe(1)
		expect(Permission.Edit).toBe(3)
		expect(Permission.Publish).toBe(5)
		expect(Permission.Manage).toBe(6)
		expect(Permission.FullControl).toBe(7)
		expect(Permission.Delete).toBe(8)
		expect(Permission.ReportViewer).toBe(17)
	})
})

describe("hasPermission", () => {
	it("passes when the user holds any of the ids", () => {
		expect(hasPermission(user([Permission.Read, Permission.Edit]), [Permission.Publish, Permission.Edit])).toBe(true)
	})

	it("fails when the user holds none of them", () => {
		expect(hasPermission(user([Permission.Read]), [Permission.Publish, Permission.Manage])).toBe(false)
	})

	it("always passes FullControl", () => {
		expect(hasPermission(user([Permission.FullControl]), [Permission.Manage])).toBe(true)
		expect(hasPermission(user([Permission.FullControl]), [Permission.ReportViewer])).toBe(true)
	})

	it("fails with no ids, even for FullControl", () => {
		expect(hasPermission(user([Permission.FullControl]), [])).toBe(false)
	})

	it("fails with no user", () => {
		expect(hasPermission(null, [Permission.Read])).toBe(false)
		expect(hasPermission(undefined, [Permission.Read])).toBe(false)
	})

	it("fails when permissions isn't an array", () => {
		const broken = { ...user([]), permissions: undefined } as unknown as IUser
		expect(hasPermission(broken, [Permission.Read])).toBe(false)
	})

	// The org-level install screen currently sends a user with no permissions.
	it("fails for a user with empty permissions", () => {
		expect(hasPermission(user([]), [Permission.Read])).toBe(false)
	})
})
