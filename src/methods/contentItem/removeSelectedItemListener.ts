import { IAppEventParam } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation, deleteOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';

/**
 * removeSelectedItemListener
 */
export const removeSelectedItemListener = () => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const returnID = `selectedItem-${appID}`

	const arg: IAppEventParam<{ operationID: string }> = {
		appID,
		operationID,
		operationType: "removeSelectedItemListener",
		arg: {
      operationID: returnID
		}
	}

	const operation = new Subject<{ removeOperationID: string }>();

  operation.subscribe(({ removeOperationID }) => {
    deleteOperation(removeOperationID)
    operation.unsubscribe()
  })

	addOperation<{ removeOperationID: string }>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)

}