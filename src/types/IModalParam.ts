export interface IModalParam<T> {
	title: string
	props?: any
	callback: (result: T) => void
}
