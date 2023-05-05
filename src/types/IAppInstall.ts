export interface IAppInstallInfo {
    appInstall: {
      appInstallID?: number;
      websiteID: number;
      appRegistrationID: number;
      isDeleted: boolean;
      isDisabled: boolean;
      installedByUserID?: number;
      installedOn?: string;
      versionID: number;
    };
    appConfiguration: {
      appConfigurationID?: number;
      appInstallID: number;
      name?: string;
      value?: string;
      label?: string;
      type?: string;
      isHiddenSetting: boolean;
    }[];
  }