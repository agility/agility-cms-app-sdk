import { IAppConfigValue, IAppEventParam } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';

interface Props {
	fieldName: string
	onChange: (fieldValue: any) => void
}

/**
 * addFieldListener
 * 	attach a listener to a particular fieldName
 * 	On every update of the subscribed field, it fires the onFieldChanged operation
 * @param { fieldName, onChange }
 */
export const addFieldListener = ({ fieldName, onChange }: Props) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const returnID = `fieldName-${appID}`

	const arg: IAppEventParam<{ fieldName: string, operationID: string, operationType: string }> = {
		appID,
		operationID,
		operationType: "addFieldListener",
		arg: {
			fieldName, 
      operationID: returnID,
      operationType: `onFieldChanged`
		}
	}

	const operation = new Subject<void>();

	addOperation<void>({ operationID, operation })
  
  const onValueChangedOperation = new Subject<{ fieldValue: any }>();

  onValueChangedOperation.subscribe(({ fieldValue })  => {
    onChange(fieldValue)
  })

  addOperation<any>({ operationID: returnID, operation: onValueChangedOperation, autoDelete: false })

	//call the method in the parent windpow
	invokeAppMethod(arg)

}