import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { IAppDataPersistValue } from '../types';

interface Props {
	key: string
	value: string
}

/**
 * Persists  value for the current app. This will be persisted per user by Agility.
 *
 * @param {Props} {key, value}
 * @returns {Promise<void>}
 */
export const persistData = ({key, value}:Props):Promise<IAppDataPersistValue> => {

	const appID = getAppID()
	const operationID = getOperationID()
	const arg: IAppEventParam<IAppDataPersistValue> = {
		appID,
		operationID,
		operationType: "persistData",
		arg: {
			key,
			value
		}
	}

	const operation = new Subject<IAppDataPersistValue>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<IAppDataPersistValue>((resolve, reject) => {
		operation.subscribe((persistedData) => {
			resolve(persistedData)
			operation.unsubscribe()
		})
	})

	addOperation<IAppDataPersistValue>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}