import { Subject } from "rxjs"
import { getAppID } from "../lib/getAppID"
import { getOperationID } from "../lib/getOperationID"
import { invokeAppMethod } from "../lib/invokeAppMethod"
import { addOperation } from "../lib/operationAccess"
import { IAppEventParam } from "../types"

/**
 * refresh
 * sends a message out to the iframe channel with a numeric height
 */
export const refresh = () => {

  const appID = getAppID()
  if (!appID) return 
  
  const operationID = getOperationID()
  const arg: IAppEventParam<{}> = {
    appID,
    operationID,
    operationType: 'refresh',
  }

  const operation = new Subject<void>();

  addOperation<void>({ operationID, operation })

  invokeAppMethod(arg)
}