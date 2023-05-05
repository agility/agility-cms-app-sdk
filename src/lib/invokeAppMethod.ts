import { IAppEventParam } from "../types";

export const invokeAppMethod = <T>(param: IAppEventParam<T>) => {
	window.parent.postMessage(param, "*")

}