import { IAppConfigValue, IAppEventParam, IAppSelectedItems } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';

interface Props {
	onChange: (fieldValue: any) => void
}

/**
 * addSelectedItemListener
 * 	attach a listener to a particular fieldName
 * 	On every update of the subscribed field, it fires the onFieldChanged operation
 * @param { onChange }
 */
export const addSelectedItemListener = ({ onChange }: Props) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const returnID = `selectedItem-${appID}`

	const arg: IAppEventParam<{ operationID: string, operationType: string }> = {
		appID,
		operationID,
		operationType: "addSelectedItemListener",
		arg: {
      operationID: returnID,
      operationType: `onSelectedItemChange`
		}
	}

	const operation = new Subject<void>();

	addOperation<void>({ operationID, operation })
  
  const onItemChange = new Subject<IAppSelectedItems>();

  onItemChange.subscribe(({ selectedItems })  => {
    onChange(selectedItems)
  })

  addOperation<IAppSelectedItems>({ operationID: returnID, operation: onItemChange, autoDelete: false })

	//call the method in the parent windpow
	invokeAppMethod(arg)

}