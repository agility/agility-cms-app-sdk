import { IAppInstallInfo } from '../types/IAppInstall';
/**
 * Gets the app install data for the current app. Includes app configuration values
 *

 * @returns {Promise<IAppInstallInfo>}
 */
export declare const getAppInstall: () => Promise<IAppInstallInfo> | null;
