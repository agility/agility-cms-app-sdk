/**
 * The signed-in user, as the Manager App sees them in the current instance.
 *
 * Sent in the `initialize` context on **every surface** (from SDK 2.5.0, with a Manager App
 * that supports it; absent on older hosts).
 *
 * ⚠️ **For the UI only.** Use it to show or hide a button. It arrives over an
 * unauthenticated `postMessage` channel and anything in the iframe can be edited by the
 * person using it, so **your own server must re-verify** every request against the
 * Management API token rather than trust these values.
 *
 * ⚠️ **On the install screen opened from the organization's Apps page**, the host
 * currently has no instance user to read, so `permissions` and `teamIDs` are empty and
 * `isOrgAdmin` is `false`, even for the org admin doing the install.  `userID`,
 * `emailAddress` and `fullName` are filled in.  Don't hide install steps on those
 * fields there.
 *
 * @export
 * @interface IUser
 */
export interface IUser {
	/**
	 * The user's Agility user ID.
	 *
	 * @type {number}
	 * @memberof IUser
	 */
	userID: number

	/**
	 * The user's email address.
	 *
	 * @type {string}
	 * @memberof IUser
	 */
	emailAddress: string

	/**
	 * The user's first and last name.
	 *
	 * @type {string}
	 * @memberof IUser
	 */
	fullName: string

	/**
	 * Whether the user is an administrator of the organization that owns the instance.
	 *
	 * @type {boolean}
	 * @memberof IUser
	 */
	isOrgAdmin: boolean

	/**
	 * The permission IDs the user holds in this instance. See {@link Permission};
	 * `7` (`Permission.FullControl`) grants everything. Test with {@link hasPermission}.
	 *
	 * @type {number[]}
	 * @memberof IUser
	 */
	permissions: number[]

	/**
	 * The IDs of the teams the user belongs to in this instance.
	 *
	 * @type {number[]}
	 * @memberof IUser
	 */
	teamIDs: number[]
}
