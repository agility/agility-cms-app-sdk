import { IUser } from "./types/IUser"

/**
 * The permission IDs a user can hold in an Agility instance, as they appear in
 * {@link IUser.permissions}.  The same IDs the Manager App uses, and the ones an app
 * manifest's `capabilities.sections[].permissions` takes.
 *
 * `FullControl` (7) grants every other permission.
 *
 * @export
 * @enum {number}
 */
export enum Permission {
	Deny = 0,
	Read = 1,
	Contribute = 2,
	Edit = 3,
	Approve = 4,
	Publish = 5,
	Manage = 6,
	FullControl = 7,
	Delete = 8,
	Develop = 9,
	Moderate = 10,
	ManageUGC = 11,
	ReadUGC = 12,
	ReadEcommerce = 13,
	EditEcommerce = 14,
	ManageEcommerce = 15,
	CallCenter = 16,
	ReportViewer = 17
}

/**
 * Whether the user holds **any** of the given permissions, with `FullControl` always
 * passing.  The same rule the Manager App applies to its own navigation and screens.
 *
 * Returns `false` when there is no user (an older Manager App that sends none, or the
 * context has not arrived yet) and when `ids` is empty.
 *
 * ```ts
 * const { user } = useAgilityAppSDK()
 * const canManage = hasPermission(user, [Permission.Manage])
 * ```
 *
 * ⚠️ **For the UI only.** Hide a button with it; never rely on it.  Your own server must
 * re-verify every request — see {@link IUser}.
 *
 * @param {(IUser | null | undefined)} user the user from `useAgilityAppSDK()`
 * @param {number[]} ids the permission IDs to accept, any of which is enough
 * @returns {boolean}
 */
export const hasPermission = (user: IUser | null | undefined, ids: number[]): boolean => {
	if (!user || !Array.isArray(user.permissions)) return false

	for (let index = 0; index < ids.length; index++) {
		const id = ids[index]
		if (user.permissions.indexOf(Permission.FullControl) !== -1 || user.permissions.indexOf(id) !== -1) return true
	}

	return false
}
