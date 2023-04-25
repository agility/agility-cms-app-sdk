export interface IModalParam<T> {
	name: string
	props: any
	callback: (result: T) => void
}
