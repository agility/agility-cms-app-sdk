import { IConfig } from '../types';
/**
 * Sends back any extra configuration to the install flow in the content manager.
 *
 * @param {Props} {key, value}
 * @returns {Promise<void>}
 */
export declare const setExtraConfigValues: (configuration: IConfig[]) => (Promise<IConfig[]> | undefined);
