import { IAppConfigValue, IAppEventParam } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation, deleteOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';

interface Props {
	fieldName: string
}

/**
 * removeFieldListener
 * 	attach a listener to a particular fieldName
 * 	On every update of the subscribed field, it fires the onFieldChanged operation
 * @param { fieldName, onChange }
 */
export const removeFieldListener = ({ fieldName }: Props) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const returnID = `${fieldName}-${appID}`

	const arg: IAppEventParam<{ fieldName: string, operationID: string }> = {
		appID,
		operationID,
		operationType: "removeFieldListener",
		arg: {
			fieldName,
			operationID: returnID
		}
	}

	interface IOperation {
		removeOperationID: string
	}

	const operation = new Subject<IOperation>();

	operation.subscribe(({ removeOperationID }) => {
		deleteOperation(removeOperationID)
		operation.unsubscribe()
	})

	addOperation<IOperation>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)

}