import { getAppID } from "../lib/getAppID"
import { getOperationID } from "../lib/getOperationID"
import { invokeAppMethod } from "../lib/invokeAppMethod"
import { IAppEventParam } from "../types"

export interface ISetTitleParam {
	/**
	 * The text to show.  Plain text, not HTML.  Keep it short: the host trims it and cuts
	 * a stack item's title at 200 characters.
	 *
	 * @type {string}
	 * @memberof ISetTitleParam
	 */
	title: string
}

/**
 * setTitle
 *
 * Sets the title the Manager App shows for the screen the app is painting.  For the
 * `items` and `sections` surfaces only:
 *
 * - on a stack item, the header above the app and the item's breadcrumb;
 * - on a section's home screen, the section header.
 *
 * It does not change the browser's document title.  Until it is called, the host shows
 * the manifest `label`, or the `name` when there is no label.  The id is not shown.
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
