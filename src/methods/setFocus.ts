import { Subject } from "rxjs"
import { getAppID } from "../lib/getAppID"
import { getOperationID } from "../lib/getOperationID"
import { invokeAppMethod } from "../lib/invokeAppMethod"
import { addOperation } from "../lib/operationAccess"
import { IAppEventParam } from "../types"

export interface ISetFocus {
  isFocused: boolean
}
export const setFocus = ({ isFocused }: ISetFocus) => {
  const appID = getAppID()
  if (!appID) return
  const operationID = getOperationID()
  const arg: IAppEventParam<{}> = {
    appID,
    operationID,
    operationType: "setFocus",
    arg: {
      isFocused,
    },
  }
  const operation = new Subject()
  addOperation({ operationID, operation })
  invokeAppMethod(arg)
}
