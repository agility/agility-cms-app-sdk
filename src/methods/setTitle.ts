import { getAppID } from "../lib/getAppID"
import { getOperationID } from "../lib/getOperationID"
import { invokeAppMethod } from "../lib/invokeAppMethod"
import { IAppEventParam } from "../types"

export interface ISetTitleParam {
	/**
	 * The text to show.  Plain text, not HTML.
	 *
	 * @type {string}
	 * @memberof ISetTitleParam
	 */
	title: string
}

/**
 * setTitle
 *
 * Sets the breadcrumb label and the browser's document title for the screen the app is
 * showing.  For the `items` and `sections` surfaces: until it is called, an app's stack
 * item shows its manifest `label` and its id.
 *
 * ```ts
 * const { item } = useAgilityAppSDK()
 * useEffect(() => { if (folder) setTitle({ title: folder.name }) }, [folder])
 * ```
 *
 * Fire-and-forget.  New in SDK 2.5.0: a Manager App without the handler ignores it, and
 * the breadcrumb keeps its default label.
 *
 * @param {ISetTitleParam} { title }
 */
export const setTitle = ({ title }: ISetTitleParam) => {
	const appID = getAppID()
	if (!appID) return

	const operationID = getOperationID()
	const arg: IAppEventParam<ISetTitleParam> = {
		appID,
		operationID,
		operationType: "setTitle",
		arg: { title }
	}

	invokeAppMethod(arg)
}
