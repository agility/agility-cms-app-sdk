import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';

interface Props {
	key: string
	value: string
}

/**
 * Persists  value for the current app.  This will be persisted by Agility.
 *
 * @param {Props} {key, value}
 * @returns {Promise<void>}
 */
export const persistData = ({key, value}:Props):Promise<void> => {

	const appID = getAppID()
	const operationID = getOperationID()
	const arg: IAppEventParam<{ key: string, value: string }> = {
		appID,
		operationID,
		operationType: "persistData",
		arg: {
			key,
			value
		}
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