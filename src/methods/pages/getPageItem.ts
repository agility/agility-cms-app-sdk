import { IAppEventParam, IPageItem } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';


/**
 * Gets the contentItem from the current context.
 * This is meant to be used on Custom Field or Content Item Sidebar Panel app.
 *
 * @returns {Promise<IPageItem>}
 */
export const getPageItem = ():(Promise<IPageItem> | undefined) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const arg: IAppEventParam<{ key: string, value: string }> = {
		appID,
		operationID,
		operationType: "getPageItem"
	}

	const operation = new Subject<IPageItem>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<IPageItem>((resolve) => {
		operation.subscribe((pageItem) => {
			resolve(pageItem)
			operation.unsubscribe()
		})
	})

	addOperation<IPageItem>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)
	
	return p

}