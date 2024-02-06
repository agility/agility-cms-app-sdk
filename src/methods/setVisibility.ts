import { Subject } from "rxjs"
import { getAppID } from "../lib/getAppID"
import { getOperationID } from "../lib/getOperationID"
import { invokeAppMethod } from "../lib/invokeAppMethod"
import { addOperation } from "../lib/operationAccess"
import { IAppEventParam, IAppVisibility } from "../types"

/**
 * Sets a field's visibility.
 * @param param0
 * @returns
 */
export const setVisibility = ({ fieldName, visibility }: IAppVisibility) => {

  const appID = getAppID()
  if (!appID) return

  const operationID = getOperationID()
  const arg: IAppEventParam<{}> = {
    appID,
    operationID,
    operationType: 'setVisibility',
    arg: {
      fieldName,
      visibility
    }
  }

  const operation = new Subject<void>();

  addOperation<void>({ operationID, operation })

  invokeAppMethod(arg)
}