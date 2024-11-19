export interface IAppEventParam<T> {
  appID: string
  operationID: string
  operationType:
    | "initialize"
    | "context"
    | "updateConfigurationValue"
    | "getContentItem"
    | "saveContentItem"
    | "openAlertModal"
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
    | "setFocus"
  error?: string
  arg?: T
}
