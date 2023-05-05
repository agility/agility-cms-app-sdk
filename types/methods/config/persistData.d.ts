import { IAppDataPersistValue } from '../../types';
interface Props {
    key: string;
    value: string;
}
/**
 * Persists  value for the current app. This will be persisted per user by Agility.
 *
 * @param {Props} {key, value}
 * @returns {Promise<void>}
 */
export declare const persistData: ({ key, value }: Props) => Promise<IAppDataPersistValue> | void;
export {};
