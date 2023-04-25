import { IAppInstallContext } from "./IAppInstallContext"
import { IField } from "./IFieldParam"
import { IInstance } from "./IInstance"

export interface IContextParam {
	app: IAppInstallContext
	instance: IInstance
	locale: string
	field?: IField
	contentItem?: any
	contentModel?: any
}