import { IAppEventParam, IModalParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';

/**
 * openModal
 * Opens a modal popup with the given name.
 * This is meant to be used on Custom Field or Content Item Sidebar Panel app.
 * The callback will be called when the modal's "OK" button is clicked and the modal has been closed.
 *
 * @template T
 * @param {Props<T>} { name, props, callback }
 */
export const openModal = <T>({ name, title, props, callback }: IModalParam<T> ) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const closeModalID = getOperationID()

	const arg: IAppEventParam<{ closeModalID: string, name: string, title: string | null, props: any }> = {
		appID,
		operationID,
		operationType: "openModal",
		arg: {
			closeModalID,
			title: title || null,
			name,
			props
		}
	}

	const operation = new Subject<void>();
	addOperation<void>({ operationID, operation })

	const closeOperation = new Subject<T>();
	closeOperation.subscribe((ret: any) => {
		callback(ret?.props)
		closeOperation.unsubscribe()
	})

	addOperation<T>({ operationID: closeModalID, operation: closeOperation })

	//call the method in the parent windpow
	invokeAppMethod(arg)

}