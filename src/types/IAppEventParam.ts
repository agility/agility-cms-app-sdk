export interface IAppEventParam<T> {
	appID: number
	operationID: string
	operationType: "initialize" | "context"
	| "updateConfigurationValue"
	| "getContentItem"
	| "openModal"

	error?: string
	arg?: T
}