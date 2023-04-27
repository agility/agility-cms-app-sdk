export interface IAppEventParam<T> {
	appID: string;
	operationID: string
	operationType: "initialize" | "context"
	| "updateConfigurationValue"
	| "getContentItem"
	| "openModal"
	| "selectAssets"
	| "persistData"
	| "setHeight"
	| "setFieldValue"
	| "addFieldListener"
	| "onFieldChanged"
	| "getAppInstall"
	
	error?: string
	arg?: T
}