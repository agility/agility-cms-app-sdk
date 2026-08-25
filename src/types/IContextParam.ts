import { IAppInstallContext } from "./IAppInstallContext"
import { IContentItem } from "./IContentItem"
import { IContentModel } from "./IContentModel"
import { IEmbedContext } from "./IEmbedContext"
import { IField } from "./IFieldParam"
import { IInstance } from "./IInstance"
import { IPageItem } from "./IPageItem"

export interface IContextParam {
	app: IAppInstallContext
	instance: IInstance
	locale: string
	field?: IField
	contentItem?: IContentItem
	contentModel?: IContentModel
	pageItem?: IPageItem
	modalProps?: any
	embed?: IEmbedContext
	closeModalID?: string
}