export interface IAppEventParam<T> {
	appID: number
	operationID: string
	operationType: "initialize" | "context" |
						"updateConfigurationValue" | "updateConfigurationValueReturn"
	error?: string
	arg?: T
}