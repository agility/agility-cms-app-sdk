import { Subject } from "rxjs"
import { getAppID } from "../../lib/getAppID"
import { getOperationID } from "../../lib/getOperationID"
import { invokeAppMethod } from "../../lib/invokeAppMethod"
import { addOperation } from "../../lib/operationAccess"
import { IAppEventParam, IAppFieldValue } from "../../types"

/**
 * Saves the currently open content item.
 * Only available from the Content Item Sidebar surfaces.
 * @returns
 */
export const saveContentItem = () => {

	const appID = getAppID()
	if (!appID) return

	const operationID = getOperationID()
	const arg: IAppEventParam<{}> = {
		appID,
		operationID,
		operationType: 'saveContentItem'
	}

	const operation = new Subject<void>();

	addOperation<void>({ operationID, operation })

	invokeAppMethod(arg)

}