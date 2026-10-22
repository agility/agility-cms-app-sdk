import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { getCloseModalID } from '../lib/getCloseModalID';

/**
 * An ordinary link for the host to put into the document, rather than an embed element.
 * Only honoured for an `rteToolbar` button that declares `insert: "link"`.  New in 2.5.0.
 *
 * @export
 * @interface IEmbedLinkInsert
 */
export interface IEmbedLinkInsert {
	/**
	 * What to insert.  Only `"link"` today.
	 *
	 * @type {"link"}
	 * @memberof IEmbedLinkInsert
	 */
	kind: "link"

	/**
	 * The link's address, up to 2048 characters.  The host accepts only a site-relative path
	 * (`/files/report.pdf`), a fragment (`#top`), or an absolute `http://`, `https://` or
	 * `mailto:` URL.  Anything else, including `javascript:`, `data:`, `tel:`, `//host`,
	 * `?query` and a relative path such as `docs/a.pdf`, is dropped: nothing is inserted.
	 * The host trims the href first, then refuses one that still contains whitespace, a
	 * backslash or a control character anywhere.
	 *
	 * @type {string}
	 * @memberof IEmbedLinkInsert
	 */
	href: string

	/**
	 * The link text, used when nothing was selected.  With a selection, the selected text
	 * becomes the link and this is not used.
	 *
	 * @type {string}
	 * @memberof IEmbedLinkInsert
	 */
	text?: string

	/**
	 * Extra attributes for the `<a>`.  The host keeps only:
	 *
	 * - `data-*` names matching `data-[a-z0-9][a-z0-9-]*` (names are lowercased first);
	 * - `title`, `class` and `rel`;
	 * - `target`, and only `_blank` or `_self`.  `_blank` gets `rel="noopener noreferrer"`
	 *   unless you set `rel`.
	 *
	 * Everything else is dropped, and each value is cut at 500 characters.
	 *
	 * @type {Record<string, string>}
	 * @memberof IEmbedLinkInsert
	 */
	attributes?: Record<string, string>
}

/**
 * What a `resolveEmbed` call can ask the host to insert, other than an embed element.
 */
export type IEmbedInsert = IEmbedLinkInsert

export interface IResolveEmbedParam {
	/**
	 * The value to serialize onto the embed element.  Written to `data-agility-value` as JSON,
	 * and handed back as `embed.value` when the author reopens the embed.
	 *
	 * @type {unknown}
	 * @memberof IResolveEmbedParam
	 */
	value?: unknown

	/**
	 * For an element embed that keeps its content as real children, the element's new
	 * children, serialised.  The host replaces the children with it; leave it out to keep
	 * them as they are.  See `embed.innerHTML`.
	 *
	 * @type {string}
	 * @memberof IResolveEmbedParam
	 */
	innerHTML?: string

	/**
	 * For an element embed, the `data-*` attributes the app owns on the element.  The set is
	 * the whole set: on an edit, any app-owned `data-*` attribute missing from it is
	 * removed.  Leave it out to keep them as they are.  Don't use the host's own
	 * `data-agility-*` names.  See `embed.attributes`.
	 *
	 * @type {Record<string, string>}
	 * @memberof IResolveEmbedParam
	 */
	attributes?: Record<string, string>

	/**
	 * @deprecated The `contentItem` storage mode was removed before 2.4.0 reached `latest`:
	 * an embed backed by a content item has no lifecycle.  Use `value`.  The host still
	 * writes it, as `data-agility-id`, for apps built on the 2.3.0 and 2.4.0 betas, and it
	 * is typed only so that those apps compile.
	 *
	 * @type {number}
	 * @memberof IResolveEmbedParam
	 */
	contentItemID?: number

	/**
	 * Pass true to close the dialog without touching the document.
	 *
	 * @type {boolean}
	 * @memberof IResolveEmbedParam
	 */
	cancelled?: boolean

	/**
	 * Insert an ordinary link instead of an embed element.  For an `rteToolbar` button that
	 * declares `insert: "link"`; pass this instead of `value`.  New in 2.5.0: a Manager App
	 * without `insert: "link"` support treats the call as an element embed with no value.
	 *
	 * @type {IEmbedInsert}
	 * @memberof IResolveEmbedParam
	 */
	insert?: IEmbedInsert
}

/**
 * Resolves the current rich text editor embed and closes the dialog.  Only to be used on
 * the rteToolbar surface.
 *
 * The host writes into the rich text field based on what is passed here: `value` becomes
 * `data-agility-value` on an embed element, `insert: { kind: "link", … }` becomes an `<a>`
 * (on an `insert: "link"` button), and `cancelled` writes nothing at all.
 *
 * @param {IResolveEmbedParam} result
 */
export const resolveEmbed = (result: IResolveEmbedParam) => {

	const appID = getAppID()
	const closeModalID = getCloseModalID()
	if (!appID || !closeModalID) return

	const operationID = getOperationID()

	const arg: IAppEventParam<{ closeModalID: string } & IResolveEmbedParam> = {
		appID,
		operationID,
		operationType: "resolveEmbed",
		arg: {
			closeModalID,
			...result
		}
	}

	//call the method in the parent windpow
	invokeAppMethod(arg)

}
