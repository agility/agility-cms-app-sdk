import { IAppConfigValue } from '../../types';
/**
 * Updates a configuration value for the current app.  This will be persisted by Agility.
 *
 * @param {Props} {key, value}
 * @returns {Promise<void>}
 */
export declare const updateConfigurationValue: ({ name, value }: IAppConfigValue) => (Promise<IAppConfigValue> | undefined);
