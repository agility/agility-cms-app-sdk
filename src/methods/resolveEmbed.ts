import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { getCloseModalID } from '../lib/getCloseModalID';

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
}

/**
 * Resolves the current rich text editor embed and closes the dialog.  Only to be used on
 * the rteToolbar surface.
 *
 * The host writes the embed markup into the rich text field based on what is passed here:
 * `value` becomes `data-agility-value`, and `cancelled` writes nothing at all.
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
