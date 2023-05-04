import { IAppVisibility } from "../types";
/**
 * setVisibility
 * sends a message out to the iframe channel with a numeric height
 * @param visibility - true wills how the iframe, false will hdie the iframe
 */
export declare const setVisibility: ({ fieldID, visibility }: IAppVisibility) => void;
