import { SelectedItem } from '../../types';
/**
 * Gets the selecteditems from the current context.
 * This is meant to be used on the Content List Item Sidebar Panel app.
 *
 * @returns {Promise<SelectedItems[]>}
 */
export declare const getSelectedItems: () => (Promise<SelectedItem[]> | undefined);
