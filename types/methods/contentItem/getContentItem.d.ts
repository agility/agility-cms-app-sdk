import { IContentItem } from '../../types';
/**
 * Gets the contentItem from the current context.
 * This is meant to be used on Custom Field or Content Item Sidebar Panel app.
 *
 * @returns {Promise<IContentItem>}
 */
export declare const getContentItem: () => (Promise<IContentItem> | undefined);
