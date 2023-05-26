export interface IModalParam<T> {
	/**
	 * The title to show on the model. Include this to have the built-in title bar with close button.  Omit it to do your own title bar.
	 *
	 * @type {string}
	 * @memberof IModalParam
	 */
	title: string

	/**
	 * The name of the modal to show.
	 *
	 * @type {string}
	 * @memberof IModalParam
	 */
	name: string

	/**
	 * The props to pass to the modal.
	 *
	 * @type {*}
	 * @memberof IModalParam
	 */
	props?: any

	/**
	 * The callback for when the modal is closed.
	 *
	 * @memberof IModalParam
	 */
	callback: (result?: T) => void
}
