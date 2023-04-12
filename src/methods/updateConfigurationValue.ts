import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';

interface Props {
	key: string
	value: string
}

export const updateConfigurationValue = ({key, value}:Props):Promise<any> => {

	const appID = getAppID()
	const operationID = getOperationID()
	const arg: IAppEventParam<{ key: string, value: string }> = {
		appID,
		operationID,
		operationType: "updateConfigurationValue",
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
	window.parent.postMessage(arg)

	return p

}