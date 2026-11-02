import { IStackItemContext } from "../types"

/** The fields a host may change after `initialize`, by posting `contextUpdated`. */
export interface IContextUpdate {
	item?: IStackItemContext | null
	parent?: IStackItemContext | null
}

const stackRef = (value: unknown): IStackItemContext | null => {
	if (!value || typeof value !== "object") return null
	const { name, id } = value as { name?: unknown; id?: unknown }
	return typeof name === "string" ? { name, id: typeof id === "string" ? id : String(id ?? "") } : null
}

/**
 * Reads a `contextUpdated` message from the host, or returns null for anything else.
 *
 * Only a message from the parent window for this app's `appID` counts, and only the fields the host may
 * update are read: today a section panel's `item` and `parent` (the open item, and the one under it).
 * A field the message leaves out is left out of the result, so it stays as it was.
 */
export const readContextUpdate = (event: MessageEvent, appID: string | null, parentWindow: unknown): IContextUpdate | null => {
	if (!appID || event.source !== parentWindow) return null
	const data = event.data as { appID?: unknown; operationType?: unknown; arg?: unknown } | null
	if (!data || typeof data !== "object" || data.operationType !== "contextUpdated" || data.appID !== appID) return null
	const arg = data.arg
	if (!arg || typeof arg !== "object") return null
	const update: IContextUpdate = {}
	if ("item" in arg) update.item = stackRef((arg as { item?: unknown }).item)
	if ("parent" in arg) update.parent = stackRef((arg as { parent?: unknown }).parent)
	return update
}
