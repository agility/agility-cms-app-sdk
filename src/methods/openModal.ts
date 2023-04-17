import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';

interface Props<T> {
	/**
	 * The name of the modal to open.
	 *
	 * @type {string}
	 * @memberof Props
	 */
	name: string
	/**
	 * The props to pass to the modal.
	 *
	 * @type {*}
	 * @memberof Props
	 */
	props: any
	/**
	 * The callback to call when the modal is closed.
	 *
	 * @memberof Props
	 */
	callback: (result: T) => void
}


/**
 * Opens a modal popup with the given name.
 * This is meant to be used on Custom Field or Content Item Sidebar Panel app.
 * The callback will be called when the modal's "OK" button is clicked and the modal has been closed.
 *
 * @template T
 * @param {Props<T>} { name, props, callback }
 * @returns
 */
export const openModal = <T>({ name, props, callback }: Props<T>) => {

	const appID = getAppID()
	const operationID = getOperationID()
	const arg: IAppEventParam<{ name: string, props: any }> = {
		appID,
		operationID,
		operationType: "openModal",
		arg: {
			name,
			props
		}
	}

	const operation = new Subject<T>();

	//setup the return promise so we can call it when the parent window returns the result
	operation.subscribe((ret: T) => {
		callback(ret)
		operation.unsubscribe()
	})


	addOperation<T>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


}