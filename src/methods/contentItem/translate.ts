import { Subject } from "rxjs"
import { getAppID } from "../../lib/getAppID"
import { getOperationID } from "../../lib/getOperationID"
import { invokeAppMethod } from "../../lib/invokeAppMethod"
import { addOperation } from "../../lib/operationAccess"
import { IAppEventParam } from "../../types"

export interface ITranslateField {
	name: string
	value: string
}

export interface ITranslateParams {
	fields: ITranslateField[]
	sourceLang: string
	targetLang: string
}

export interface ITranslateResult {
	translations: ITranslateField[]
}

/**
 * translate
 * Sends a message to the parent iframe to translate the given fields via the manager's Translation API.
 * @param params - fields to translate, source locale, and target locale
 * @returns Promise resolving to the translated fields
 */
export const translate = (params: ITranslateParams): Promise<ITranslateResult> | undefined => {
	const appID = getAppID()
	if (!appID) return

	const operationID = getOperationID()
	const arg: IAppEventParam<ITranslateParams> = {
		appID,
		operationID,
		operationType: "translate",
		arg: params
	}

	const operation = new Subject<ITranslateResult>()

	const p = new Promise<ITranslateResult>((resolve) => {
		operation.subscribe((result) => {
			resolve(result)
			operation.unsubscribe()
		})
	})

	addOperation<ITranslateResult>({ operationID, operation })

	invokeAppMethod(arg)

	return p
}
