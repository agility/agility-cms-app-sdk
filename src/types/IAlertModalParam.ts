export interface IAlertModalParam {
	title: string
	/** Defaults to an empty string*/
	message: string
	iconName?: string
	/**Icon Color - defaults to gray*/
	iconColor?: string
	okButtonText: string
	cancelButtonText: string
	callback: (result: boolean) => void
}