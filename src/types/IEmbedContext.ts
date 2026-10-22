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
	 * @deprecated The `contentItem` storage mode was removed before 2.4.0 reached `latest`.
	 * The host still sends the `data-agility-id` of an embed written by an app on the 2.3.0
	 * or 2.4.0 betas; it is typed only so that those apps compile.  Use `value`.
	 *
	 * @type {number}
	 * @memberof IEmbedContext
	 */
	contentItemID?: number

	/**
	 * The content item that the rich text field being edited belongs to.
	 *
	 * @type {IContentItem}
	 * @memberof IEmbedContext
	 */
	contentItem?: IContentItem

	/**
	 * For an element embed being edited, the element's current children, serialised as they
	 * would be saved.
	 *
	 * Typed in 2.5.0; the Manager App already sends it.
	 *
	 * @type {string}
	 * @memberof IEmbedContext
	 */
	innerHTML?: string

	/**
	 * For an element embed being edited, the `data-*` attributes on the element that the
	 * host doesn't own: everything except `data-agility-*` and the editor's `data-mce-*`.
	 * An app that keeps its settings on attributes rather than in `value` reads them here
	 * and returns the new set as `resolveEmbed({ attributes })`.
	 *
	 * Typed in 2.5.0; the Manager App already sends it.
	 *
	 * @type {Record<string, string>}
	 * @memberof IEmbedContext
	 */
	attributes?: Record<string, string>

	/**
	 * For an `insert: "link"` button, the plain text the author had selected when they
	 * clicked it.  When there is a selection it becomes the link text, whatever `text` the
	 * app returns, so show it in the dialog rather than asking for link text.
	 *
	 * @type {string}
	 * @memberof IEmbedContext
	 */
	selectionText?: string
}
