import { IAppEventParam, IContentItem, INormalizedContentItem } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';


/**
 * Gets the contentItem from the current context.
 * This is meant to be used on Custom Field or Content Item Sidebar Panel app.
 *
 * @returns {Promise<IContentItem>}
 */
export const getContentItem = ():(Promise<INormalizedContentItem> | undefined) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const arg: IAppEventParam<{ key: string, value: string }> = {
		appID,
		operationID,
		operationType: "getContentItem"
	}

	const operation = new Subject<INormalizedContentItem>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<INormalizedContentItem>((resolve, reject) => {
		operation.subscribe((contentItem) => {
			resolve(contentItem)
			operation.unsubscribe()
		})
	})

	addOperation<INormalizedContentItem>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}