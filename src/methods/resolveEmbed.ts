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
	 * The link's address.  The host refuses `javascript:` URLs.
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
	 * Extra attributes for the `<a>`.  The host keeps only `data-*`, `target`, `rel`,
	 * `class` and `title`, and drops the rest.
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
