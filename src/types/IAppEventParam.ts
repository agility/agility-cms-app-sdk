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
	| "preInstall"
	| "installApp"
	| "preInstall"
	| "setExtraConfigValues"
	| "removeFieldListener"
	error?: string
	arg?: T
}