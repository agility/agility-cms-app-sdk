import { IAppConfigValue, IAppEventParam } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';

/**
 * Updates a configuration value for the current app.  This will be persisted by Agility.
 *
 * @param {Props} {key, value}
 * @returns {Promise<void>}
 */
export const updateConfigurationValue = ({name, value}:IAppConfigValue):Promise<IAppConfigValue> => {

	const appID = getAppID()
	const operationID = getOperationID()
	const arg: IAppEventParam<IAppConfigValue> = {
		appID,
		operationID,
		operationType: "updateConfigurationValue",
		arg: {
			name,
			value
		}
	}

	const operation = new Subject<IAppConfigValue>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<IAppConfigValue>((resolve, reject) => {
		operation.subscribe((appConfigValue) => {
			resolve(appConfigValue)
			operation.unsubscribe()
		})
	})

	addOperation<IAppConfigValue>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}