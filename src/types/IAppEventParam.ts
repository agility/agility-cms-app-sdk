export interface IAppEventParam<T> {
	appID: string;
	operationID: string
	operationType: "initialize" | "context"
	| "updateConfigurationValue"
	| "getContentItem"
	| "openModal"
	| "selectAssets"
	| "persistData"
	| "refresh"
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
	| "getSelectedItems"
	| "addSelectedItemListener"
	| "onSelectedItemChange"
	| "removeSelectedItemListener"
	| "getPageItem"
	error?: string
	arg?: T
}