import { Subject } from "rxjs"
import { getAppID } from "../lib/getAppID"
import { getOperationID } from "../lib/getOperationID"
import { invokeAppMethod } from "../lib/invokeAppMethod"
import { addOperation } from "../lib/operationAccess"
import { IAppEventParam, INavigateParam, INavigationUrl } from "../types"

/**
 * getNavigationUrl
 *
 * Resolves a {@link INavigationTarget} to an address **without going there**, so an app
 * can render a real `<a href>`. Works on **every surface**.
 *
 * Use this wherever a destination is a link rather than an action. A real anchor gives
 * the editor the things a button cannot: middle-click and ⌘-click to open in a new tab,
 * the address on hover, "copy link address". Point it at `target="_top"` to navigate the
 * whole Manager App, or `target="_blank"` to open a second tab and leave the editor's
 * current work untouched.
 *
 * ```tsx
 * const [href, setHref] = useState<string | null>(null)
 * useEffect(() => {
 *   getNavigationUrl({ target: { type: "contentItem", contentID } })?.then((r) => setHref(r?.url ?? null))
 * }, [contentID])
 *
 * return href ? <a href={href} target="_blank" rel="noopener noreferrer">Edit</a> : null
 * ```
 *
 * `url` is absolute, and it has to be: an app runs on its own origin, so a relative href
 * inside it would point at the app rather than at the CMS. It is still only ever an
 * `href` — the CMS is a different origin, so it is not a `fetch` target.
 *
 * Resolves `undefined` when the host does not support the operation, which is the signal
 * to fall back to whatever the app did before.
 *
 * @param {INavigateParam} { target, openInStack }
 * @returns {(Promise<INavigationUrl> | undefined)}
 */
export const getNavigationUrl = ({ target, openInStack }: INavigateParam): Promise<INavigationUrl> | undefined => {
	const appID = getAppID()
	if (!appID) return

	const operationID = getOperationID()
	const arg: IAppEventParam<INavigateParam> = {
		appID,
		operationID,
		operationType: "getNavigationUrl",
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
