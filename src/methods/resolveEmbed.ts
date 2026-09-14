import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { getCloseModalID } from '../lib/getCloseModalID';

export interface IResolveEmbedParam {
	/**
	 * The value to serialize onto the embed element, for a button declaring
	 * `storage: "value"`.  Written to `data-agility-value` as JSON.
	 *
	 * @type {unknown}
	 * @memberof IResolveEmbedParam
	 */
	value?: unknown

	/**
	 * The ID of the content item backing the embed, for a button declaring
	 * `storage: "contentItem"`.  Written to `data-agility-id`.
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
}

/**
 * Resolves the current rich text editor embed and closes the dialog.  Only to be used on
 * the rteToolbar surface.
 *
 * The host writes the embed markup into the rich text field based on what is passed here:
 * `value` becomes `data-agility-value`, `contentItemID` becomes `data-agility-id`, and
 * `cancelled` writes nothing at all.
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
