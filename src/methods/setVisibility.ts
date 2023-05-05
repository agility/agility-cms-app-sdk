import { Subject } from "rxjs"
import { getAppID } from "../lib/getAppID"
import { getOperationID } from "../lib/getOperationID"
import { invokeAppMethod } from "../lib/invokeAppMethod"
import { addOperation } from "../lib/operationAccess"
import { IAppEventParam, IAppVisibility } from "../types"

/**
 * setVisibility
 * sends a message out to the iframe channel with a numeric height
 * @param visibility - true wills how the iframe, false will hdie the iframe 
 */
export const setVisibility = ({ fieldID, visibility }: IAppVisibility) => {

  const appID = getAppID()
  if (!appID) return 
  
  const operationID = getOperationID()
  const arg: IAppEventParam<{}> = {
    appID,
    operationID,
    operationType: 'setVisibility',
    arg: {
      fieldID,
      visibility
    }
  }

  const operation = new Subject<void>();

  addOperation<void>({ operationID, operation })

  invokeAppMethod(arg)
}