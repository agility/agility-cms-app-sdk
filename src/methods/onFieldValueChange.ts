import { IAppConfigValue, IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';

interface Props {
	fieldName: string
	onChange: ({ name, value }: IAppConfigValue) => void
}

/**
 * onFieldValueChanges
 * @param {Props} {  }
 * @returns
 */
// Needs testing
export const onFieldValueChanges = ({ fieldName, onChange }: Props) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
  const returnID = getOperationID()

	const arg: IAppEventParam<{ fieldName: string, returnID: string, operationType: string }> = {
		appID,
		operationID,
		operationType: "onFieldValueChanges",
		arg: {
			fieldName, 
      returnID,
      operationType: `onValueChanged`
		}
	}

	const operation = new Subject<void>();

	addOperation<void>({ operationID, operation })
  
  const onValueChangedOperation = new Subject<IAppConfigValue>();

  onValueChangedOperation.subscribe((field)  => {
    onChange(field)
    // maybe i should unsubscribe at some point??
  })

  addOperation<IAppConfigValue>({ operationID: returnID, operation: onValueChangedOperation, autoDelete: false })

	//call the method in the parent windpow
	invokeAppMethod(arg)

}