import { Subject } from "rxjs"
import { getAppID } from "../lib/getAppID"
import { getOperationID } from "../lib/getOperationID"
import { invokeAppMethod } from "../lib/invokeAppMethod"
import { addOperation } from "../lib/operationAccess"
import { IAppEventParam, INavigateParam, INavigationUrl } from "../types"

/**
 * navigate
 *
 * Moves the Manager App to another screen, client-side — no reload, no new tab, and no
 * knowledge of the CMS's URL grammar on the app's side. Works on **every surface**.
 *
 * ```ts
 * // Open a page on top of the course the editor is already in.
 * navigate({ target: { type: "contentItem", contentID: 1866 } })
 *
 * // Start a new one.
 * navigate({ target: { type: "newContentItem", containerID: 30 } })
 * ```
 *
 * ⚠️ **Awaiting this is how you detect failure, not success.** Navigating away unmounts
 * the iframe your app is running in, so on the happy path the reply usually arrives to a
 * frame that no longer exists and the promise never settles. It *does* settle when
 * nothing happened — an unsupported target, or a Manager App older than this operation —
 * which is the case worth handling:
 *
 * ```ts
 * const result = await navigate({ target })
 * if (result === undefined) {
 *   // Still here: the host did not navigate. Fall back to a link.
 * }
 * ```
 *
 * ⚠️ **Unsaved changes are lost, silently.** The content item form does not prompt before
 * the route changes. If your app holds edits the editor has not saved — a custom field's
 * value, most obviously — ask them first with `openAlertModal`, or give them a link with
 * {@link getNavigationUrl} and let them open it in a new tab instead.
 *
 * @param {INavigateParam} { target, openInStack }
 * @returns {(Promise<INavigationUrl> | undefined)} the address the host went to, if it replies
 */
export const navigate = ({ target, openInStack }: INavigateParam): Promise<INavigationUrl> | undefined => {
	const appID = getAppID()
	if (!appID) return

	const operationID = getOperationID()
	const arg: IAppEventParam<INavigateParam> = {
		appID,
		operationID,
		operationType: "navigate",
		arg: { target, openInStack }
	}

	const operation = new Subject<INavigationUrl>()

	const p = new Promise<INavigationUrl>((resolve) => {
		operation.subscribe((result) => {
			resolve(result)
			operation.unsubscribe()
		})
	})

	addOperation<INavigationUrl>({ operationID, operation })

	invokeAppMethod(arg)

	return p
}
