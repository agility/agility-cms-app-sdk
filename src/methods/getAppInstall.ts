import { IAppConfigValue, IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { IAppInstallInfo } from '../types/IAppInstall';


/**
 * Gets the app install data for the current app. Includes app configuration values
 *

 * @returns {Promise<IAppInstallInfo>}
 */
export const getAppInstall = ():Promise<IAppInstallInfo> | null => {

	const appID = getAppID()
	if (! appID) return null


	const operationID = getOperationID()
	const arg: IAppEventParam<never> = {
		appID,
		operationID,
		operationType: "getAppInstall"
	}

	const operation = new Subject<IAppInstallInfo>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<IAppInstallInfo>((resolve, reject) => {
		operation.subscribe((appInstallInfo) => {
			resolve(appInstallInfo)
			operation.unsubscribe()
		})
	})

	addOperation<IAppInstallInfo>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}