import { IAppEventParam } from '../types';
import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { IAlertModalParam } from '../types/IAlertModalParam';

export const openAlertModal = ({ title, message, okButtonText, cancelButtonText, iconName = "", iconColor = "", callback }: IAlertModalParam ) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const closeModalID = getOperationID()

	const arg: IAppEventParam<{ closeModalID: string, title: string, message: string, okButtonText: string, cancelButtonText:string, iconName: string, iconColor: string  }> = {
		appID,
		operationID,
		operationType: "openAlertModal",
		arg: {
			closeModalID,
			title,
			message,
			okButtonText,
			cancelButtonText,
			iconName,
			iconColor
		}
	}

	const operation = new Subject<void>();
	addOperation<void>({ operationID, operation })

	const closeOperation = new Subject<boolean>();
	closeOperation.subscribe((ret: any) => {
		callback(ret?.ok)
		closeOperation.unsubscribe()
	})

	addOperation<boolean>({ operationID: closeModalID, operation: closeOperation })

	//call the method in the parent windpow
	invokeAppMethod(arg)

}