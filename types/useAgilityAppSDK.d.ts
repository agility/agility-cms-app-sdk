import { IAppInstallContext, IInstance, IField, IContentItem, IContentModel, IPageItem } from './types';
interface AgilityAddSKReturn {
    initializing: boolean;
    appInstallContext: IAppInstallContext | null;
    instance: IInstance | null;
    locale: string | null;
    field: IField | null;
    contentItem: IContentItem | null;
    contentModel: IContentModel | null;
    pageItem: IPageItem | null;
}
/**
 * The main hook for using the Agility App SDK.
 *
 * @returns {AgilityAddSKReturn}
 */
export declare const useAgilityAppSDK: () => AgilityAddSKReturn;
export {};
