/**
 * Which app section the app was opened in.  Sent on the `sections` surface only.
 *
 * @export
 * @interface ISectionContext
 */
export interface ISectionContext {
	/**
	 * The `name` of the entry in the manifest's `capabilities.sections`. Matches the
	 * `{sectionName}` segment of the route the app was opened at.
	 *
	 * @type {string}
	 * @memberof ISectionContext
	 */
	name: string
}

/**
 * One entry on the Manager App's item stack: the `{name}-{id}` segment of its URL.
 *
 * Used for `item` (the app's own stack item) and `parent` (whatever it was opened on top
 * of) on the `items` surface.
 *
 * @export
 * @interface IStackItemContext
 */
export interface IStackItemContext {
	/**
	 * The stack item's name.  For the app's own item, the `name` of the entry in the
	 * manifest's `capabilities.items`.  For a parent, it can also be one of the Manager
	 * App's built-in stack names, such as `listitem` or `page`.
	 *
	 * @type {string}
	 * @memberof IStackItemContext
	 */
	name: string

	/**
	 * The stack item's id, exactly as it appears in the URL, as a string.  For the app's
	 * own items the app owns its meaning: 1–128 characters of `A–Z a–z 0–9 . _ ~ -`,
	 * hyphens included.
	 *
	 * @type {string}
	 * @memberof IStackItemContext
	 */
	id: string
}
