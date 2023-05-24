import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { IAppEventParam } from '../types';

export const getManagementAPIToken = ():(Promise<any> | undefined) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const arg: IAppEventParam<any> = {
		appID,
		operationID,
		operationType: "getManagementAPIToken"
	}

	const operation = new Subject<{ token: string }>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<any>((resolve) => {
		operation.subscribe(({ token }) => {
			resolve(token)
			operation.unsubscribe()
		})
	})

	addOperation<{ token: string }>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}