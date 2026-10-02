import { IContentItem } from "./IContentItem"

/**
 * The payload an app receives when the host opens it on the `rteToolbar` surface.
 *
 * This is delivered on the existing `initialize` -> `context` reply, the same way
 * `modalProps` is, rather than through a second host->app operation.
 *
 * @export
 * @interface IEmbedContext
 */
export interface IEmbedContext {
	/**
	 * The `name` of the `rteToolbar` button the author clicked.  Matches the
	 * `{buttonName}` segment of the route the app was opened at.
	 *
	 * @type {string}
	 * @memberof IEmbedContext
	 */
	buttonName: string

	/**
	 * Whether the author is inserting a new embed or editing an existing one.
	 *
	 * @type {("insert" | "edit")}
	 * @memberof IEmbedContext
	 */
	mode: "insert" | "edit"

	/**
	 * The previously saved value.  Only present when editing an existing embed.
	 *
	 * @type {unknown}
	 * @memberof IEmbedContext
	 */
	value?: unknown

	/**
	 * The content item that the rich text field being edited belongs to.
	 *
	 * @type {IContentItem}
	 * @memberof IEmbedContext
	 */
	contentItem?: IContentItem
}
