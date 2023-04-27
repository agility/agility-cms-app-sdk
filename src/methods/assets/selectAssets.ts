import { IAppConfigValue, IAppEventParam } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';


/**
 * selectAssets
 * Selects assets for the current context
 * This is meant to be used on the pages dashboard or content dashboard.
 *
 * @returns {Promise<any>}
 */
export const selectAssets = ():(Promise<void> | undefined) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const arg: IAppEventParam<{ key: string, value: string }> = {
		appID,
		operationID,
		operationType: "selectAssets"
	}

	const operation = new Subject<void>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<void>((resolve, reject) => {
		operation.subscribe(() => {
			resolve()
			operation.unsubscribe()
		})
	})

	addOperation<void>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}