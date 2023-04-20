import { IAppEventParam } from "../types"
import { getOperation } from "./operationAccess"

export const operationDispatcher = (event: MessageEvent) => {

	const { data } = event as { data: IAppEventParam<any> }

	const operationID = data.operationID
	//if we don't have an operationID, then we don't need to do anything
	if (!operationID) return

	const operation = getOperation(operationID)

	if (operation) {
		operation.next(data.arg)
	}

}