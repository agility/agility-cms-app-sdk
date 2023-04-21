export interface IAppEventParam<T> {
	appID: number
	operationID: string
	operationType: "initialize" | "context"
	| "updateConfigurationValue"
	| "getContentItem"
	| "openModal"
	| "selectAssets"
	| "persistData"
	| "setHeight"
	| "subscribeToOtherValueChanges"
	
	error?: string
	arg?: T
}