import { IConfig } from './types';
interface AgilityPreInstallReturn {
    configuration: IConfig[];
}
/**
 * The pre install hook, used to pass configuration values to the install screen.
 *
 * @returns {AgilityPreInstallReturn}
 */
export declare const useAgilityPreInstall: () => AgilityPreInstallReturn;
export {};
