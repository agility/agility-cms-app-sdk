import { IModalParam } from '../types';
/**
 * openModal
 * Opens a modal popup with the given name.
 * This is meant to be used on Custom Field or Content Item Sidebar Panel app.
 * The callback will be called when the modal's "OK" button is clicked and the modal has been closed.
 *
 * @template T
 * @param {Props<T>} { name, props, callback }
 */
export declare const openModal: <T>({ title, callback }: IModalParam<T>) => void;
