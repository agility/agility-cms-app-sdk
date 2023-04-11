import { IAppInstallContext } from "./IAppInstallContext"
import { IInstance } from "./IInstance"

export interface IContextParam {
	app: IAppInstallContext
	instance: IInstance
	locale: string

}