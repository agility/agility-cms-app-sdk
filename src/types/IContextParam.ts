import { IAppInstallContext } from "./IAppInstallContext"
import { IContentItem } from "./IContentItem"
import { IContentModel } from "./IContentModel"
import { IEmbedContext } from "./IEmbedContext"
import { IField } from "./IFieldParam"
import { IInstance } from "./IInstance"
import { IPageItem } from "./IPageItem"
import { ISectionContext, IStackItemContext } from "./IAppSurfaceContext"
import { IUser } from "./IUser"

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
	/** The app section the app was opened in.  `sections` surface only.  New in 2.5.0. */
	section?: ISectionContext
	/** The app's own stack item.  `items` surface only.  New in 2.5.0. */
	item?: IStackItemContext
	/** The stack item the app's item was opened on top of, or `null` at the bottom of the stack.  `items` surface only.  New in 2.5.0. */
	parent?: IStackItemContext | null
	/** The signed-in user.  Every surface, on a Manager App that sends it.  For the UI only.  New in 2.5.0. */
	user?: IUser
}