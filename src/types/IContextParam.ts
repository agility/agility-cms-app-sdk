import { IAppInstallContext } from "./IAppInstallContext"
import { IInstance } from "./IInstance"

export interface IField {
	id: string
	label: string
	typeName: string
	name: string
	value: any
	description?: string
	required: boolean
	readOnly: boolean
}

export interface IContextParam {
	app: IAppInstallContext
	instance: IInstance
	locale: string
	field?: IField
	contentItem?: any
	contentModel?: any
}