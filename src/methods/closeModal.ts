import { IAppEventParam, IModalParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { getCloseModalID } from '../lib/getCloseModalID';

/**
 * Closes the current modal and passes the props to the callback.  Only to be used on a modal surface.
 *
 * @param {*} props
 */
export const closeModal = ( props : any) => {

	const appID = getAppID()
	const closeModalID = getCloseModalID()
	if (!appID || !closeModalID) return

	const operationID = getOperationID()

	const arg: IAppEventParam<{ closeModalID: string, props: any }> = {
		appID,
		operationID,
		operationType: "closeModal",
		arg: {
			closeModalID,
			props
		}
	}


	//call the method in the parent windpow
	invokeAppMethod(arg)

}