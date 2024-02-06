/**
 * Sets a field's visibility
 *
 */
export interface IAppVisibility {
	/**
	 * The field name to set visibility for.  Case insensitive.
	 */
	fieldName: string
	/**
	 * True will show the field, false will hide the field.
	 */
	visibility: boolean
}