export interface IAppEventParam<T> {
	appID: string;
	operationID: string
	operationType: "initialize" | "context"
	| "updateConfigurationValue"
	| "getContentItem"
	| "openModal"
	| "closeModal"
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
	| "setVisibility"
	| "getPageItem"
	| "getManagementAPIToken"
	| "getAPIKey"
	error?: string
	arg?: T
}