import { IAppEventParam, IAppHeightValue } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';

interface Props {
	/**
	 * The height you wish to set it to. Can accept % or px.
	 *
	 * @type {string}
	 * @memberof Props
	 */
	height: string
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
export const setHeight = ({ height }: Props) => {

    const isValidHeight = /^([1-9]\d*%|[1-9]\d*px)$/.test(height);
    if (!isValidHeight) return null;

	const appID = getAppID()
	const operationID = getOperationID()
	const returnID = getOperationID()

	const arg: IAppEventParam<IAppHeightValue> = {
		appID,
		operationID,
		operationType: "setHeight",
		arg: {
			height
		}
	}

	const operation = new Subject();
	operation.subscribe(() => {
		operation.unsubscribe()
	})

	addOperation({ operationID, operation })

	const closeOperation = new Subject();
	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<void>((resolve, reject) => {
		closeOperation.subscribe(() => {
			resolve()
			closeOperation.unsubscribe()
		})
	})

	addOperation({ operationID: returnID, operation: closeOperation })

	//call the method in the parent windpow
	invokeAppMethod(arg)

	return p

}