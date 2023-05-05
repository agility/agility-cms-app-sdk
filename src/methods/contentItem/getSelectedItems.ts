import { IAppEventParam, IAppSelectedItems, SelectedItem } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';


/**
 * Gets the selecteditems from the current context.
 * This is meant to be used on the Content List Item Sidebar Panel app.
 *
 * @returns {Promise<SelectedItems[]>}
 */
export const getSelectedItems = ():(Promise<SelectedItem[]> | undefined) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const arg: IAppEventParam<{ key: string, value: string }> = {
		appID,
		operationID,
		operationType: "getSelectedItems"
	}

	const operation = new Subject<IAppSelectedItems>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<SelectedItem[]>((resolve) => {
		operation.subscribe(({ selectedItems }) => {
			resolve(selectedItems)
			operation.unsubscribe()
		})
	})

	addOperation<IAppSelectedItems>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}