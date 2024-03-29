import { Subject } from "rxjs"
import { getAppID } from "../../lib/getAppID"
import { getOperationID } from "../../lib/getOperationID"
import { invokeAppMethod } from "../../lib/invokeAppMethod"
import { addOperation } from "../../lib/operationAccess"
import { IAppEventParam, IAppFieldValue } from "../../types"

/**
 * setFieldValue
 *  sends a message out to the iframe channel with a a name and value
 * @param param0 
 * @returns 
 */
export const setFieldValue = ({ name, value }: IAppFieldValue) => {

  const appID = getAppID()
  if (!appID) return 
  
  const operationID = getOperationID()
  const arg: IAppEventParam<{}> = {
    appID,
    operationID,
    operationType: 'setFieldValue',
    arg: {
      name,
      value
    }
  }

  const operation = new Subject<void>();

  addOperation<void>({ operationID, operation })

  invokeAppMethod(arg)

}