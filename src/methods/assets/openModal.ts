import { IAppEventParam, IModalParam } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';

/**
 * openModal
 * Opens a modal popup with the given name.
 * This is meant to be used on Custom Field or Content Item Sidebar Panel app.
 * The callback will be called when the modal's "OK" button is clicked and the modal has been closed.
 *
 * @template T
 * @param {Props<T>} { name, props, callback }
 */
export const openModal = <T>({ name, props, callback }: (IModalParam<T> | undefined)) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const returnID = getOperationID()

	const arg: IAppEventParam<{ name: string, props: any }> = {
		appID,
		operationID,
		operationType: "openModal",
		arg: {
			name,
			props: {
				operationID,
				...props
			}
		}
	}

	const operation = new Subject<T>();
	operation.subscribe(() => {
		operation.unsubscribe()
	})

	addOperation<T>({ operationID, operation })

	const closeOperation = new Subject<T>();
	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<void>((resolve, reject) => {
		closeOperation.subscribe((ret: any) => {
			callback(ret)
			resolve()
			closeOperation.unsubscribe()
		})
	})

	addOperation<T>({ operationID: returnID, operation: closeOperation })

	//call the method in the parent windpow
	invokeAppMethod(arg)

	return p

}