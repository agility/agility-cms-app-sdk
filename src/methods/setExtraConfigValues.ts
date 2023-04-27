import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { IConfig } from '../types';

/**
 * Sends back any extra configuration to the install flow in the content manager.
 *
 * @param {Props} {key, value}
 * @returns {Promise<void>}
 */
export const setExtraConfigValues = (configuration: IConfig[]):(Promise<IConfig[]> | undefined) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()

	const arg: IAppEventParam<IConfig[]> = {
		appID,
		operationID,
		operationType: "setExtraConfigValues",
		arg: configuration
	
	}

	const operation = new Subject<IConfig[]>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<IConfig[]>((resolve, reject) => {
		operation.subscribe((preInstallConfigs) => {
			resolve(preInstallConfigs)
			operation.unsubscribe()
		})
	})

	addOperation<IConfig[]>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}