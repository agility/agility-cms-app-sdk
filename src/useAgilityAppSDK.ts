import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { IAppInstallContext, IInstance, IContextParam, IField, IContentItem, IContentModel, IPageItem, IEmbedContext, IReportContext, ISectionContext, IStackItemContext, IUser } from './types';
import { getOperationID } from './lib/getOperationID';
import { addOperation } from './lib/operationAccess';
import { operationDispatcher } from './lib/operationDispatcher';
import { invokeAppMethod } from './lib/invokeAppMethod';
import { getAppID } from './lib/getAppID';
import { readContextUpdate } from "./lib/contextUpdate"
import { addFieldListener } from './methods/contentItem';


export interface AgilityAddSKReturn {
	/**
	 * Indicates if the SDK is still initializing.
	 *
	 * @type {boolean}
	 * @memberof AgilityAddSKReturn
	 */
	initializing: boolean,
	/**
	 * The app install context.
	 *
	 * @type {(IAppInstallContext | null)}
	 * @memberof AgilityAddSKReturn
	 */
	appInstallContext: IAppInstallContext | null,

	/**
	 * The current instance.
	 *
	 * @type {(IInstance | null)}
	 * @memberof AgilityAddSKReturn
	 */
	instance: IInstance | null,

	/**
	 * The current locale.
	 *
	 * @type {(string | null)}
	 * @memberof AgilityAddSKReturn
	 */
	locale: string | null,

	/**
	 * The current field.  Only available when on a custom field.
	 *
	 * @type {(IField | null)}
	 * @memberof AgilityAddSKReturn
	 */
	field: IField | null,

	/**
	 * The current content item.  Only available when on a custom field or content item sidebar.
	 *
	 * @type {(IContentItem | null)}
	 * @memberof AgilityAddSKReturn
	 */
	contentItem: IContentItem | null,

	/**
	 * The current content model.  Only available when on a custom field, content item or list sidebar.
	 *
	 * @type {(IContentModel | null)}
	 * @memberof AgilityAddSKReturn
	 */
	contentModel: IContentModel | null

	/**
	 * The current page.  Only available when on a page sidebar.
	 *
	 * @type {(IPageItem | null)}
	 * @memberof AgilityAddSKReturn
	 */
	pageItem: IPageItem | null,

	/**
	 * The current modal props.  Only available when on a modal surface.
	 *
	 * @type {*}
	 * @memberof AgilityAddSKReturn
	 */
	modalProps: any

	/**
	 * The rich text editor embed being inserted or edited.  Only available when on the
	 * rteToolbar surface.
	 *
	 * @type {(IEmbedContext | null)}
	 * @memberof AgilityAddSKReturn
	 */
	embed: IEmbedContext | null

	/**
	 * The current field value.  Only available when on a custom field.
	 * If the field value changes outside of the SDK, this value will be updated.
	 *
	 * @type {string}
	 * @memberof AgilityAddSKReturn
	 */
	fieldValue: string

	/**
	 * The app section the app was opened in.  Only available on the sections surface.
	 * New in 2.5.0.
	 *
	 * @type {(ISectionContext | null)}
	 * @memberof AgilityAddSKReturn
	 */
	section: ISectionContext | null

	/**
	 * The app report the app was opened in: `{ name, appName }`.  Only available on the
	 * reports surface.  New in 2.5.0-beta.1.
	 *
	 * @type {(IReportContext | null)}
	 * @memberof AgilityAddSKReturn
	 */
	report: IReportContext | null

	/**
	 * The app's own stack item, from the `{name}-{id}` segment of the URL.  Available on the
	 * items surface, and on a section panel, where it's the item open on the right (the top of
	 * the section's stack; `null` at the section's home) and **updates as the user navigates**
	 * (2.5.0-beta.1).  New in 2.5.0.
	 *
	 * @type {(IStackItemContext | null)}
	 * @memberof AgilityAddSKReturn
	 */
	item: IStackItemContext | null

	/**
	 * The stack item the app's item was opened on top of, such as `{ name: "listitem", id: "1001" }`.
	 * `null` when the item is the first on the stack, and on every other surface.  On a section
	 * panel it's the entry under the open item, and updates with it.  New in 2.5.0.
	 *
	 * @type {(IStackItemContext | null)}
	 * @memberof AgilityAddSKReturn
	 */
	parent: IStackItemContext | null

	/**
	 * The signed-in user and their permissions in this instance.  Available on every surface
	 * when the Manager App sends it; `null` on older hosts.  New in 2.5.0.
	 *
	 * ⚠️ For the UI only: use it to show or hide things.  Your server must re-verify every
	 * request.
	 *
	 * @type {(IUser | null)}
	 * @memberof AgilityAddSKReturn
	 */
	user: IUser | null
}

/**
 * The main hook for using the Agility App SDK.
 *
 * @returns {AgilityAddSKReturn}
 */
export const useAgilityAppSDK = (): AgilityAddSKReturn => {

	const [initializing, setInitializing] = useState(true)
	const [appInstallContext, setAppInstallContext] = useState<IAppInstallContext | null>(null)
	const [instance, setInstance] = useState<IInstance | null>(null)
	const [locale, setLocale] = useState<string | null>(null)
	const [field, setField] = useState<IField | null>(null)
	const [contentModel, setContentModel] = useState<IContentModel | null>(null)
	const [contentItem, setContentItem] = useState<IContentItem | null>(null)
	const [pageItem, setPageItem] = useState<IPageItem | null>(null)
	const [fieldValue, setFieldValue] = useState<string>("")

	const [modalProps, setModalProps] = useState<any>(null)
	const [embed, setEmbed] = useState<IEmbedContext | null>(null)
	const [section, setSection] = useState<ISectionContext | null>(null)
	const [report, setReport] = useState<IReportContext | null>(null)
	const [item, setItem] = useState<IStackItemContext | null>(null)
	const [parent, setParent] = useState<IStackItemContext | null>(null)
	const [user, setUser] = useState<IUser | null>(null)

	useEffect(() => {
		const appID = getAppID()
		if (!appID) return

		//setup an operation observer to lcd isten for the context event after the initialize method
		const operation = new Subject<IContextParam>();

		operation.subscribe((context) => {
			if (context) {
				setAppInstallContext(context.app)
				setInstance(context.instance)
				setLocale(context.locale)

				setField(context.field || null)

				setContentItem(context.contentItem || null)
				// The page sidebar sends the page in its initialize context; this was never read, so pageItem was always null.
				setPageItem(context.pageItem || null)
				setContentModel(context.contentModel || null)
				setModalProps(context.modalProps || null)
				setEmbed(context.embed || null)
				setSection(context.section || null)
				setReport(context.report || null)
				setItem(context.item || null)
				setParent(context.parent || null)
				setUser(context.user || null)

				if (context.field) {
					//if we are on a custom field, add a listener for the field value
					setFieldValue(context.contentItem?.values[context.field.name] || "")

					addFieldListener({
						fieldName: context.field.name,
						onChange: (fieldValue) => {
							setFieldValue(fieldValue || "")
						}
					})
				}


				setInitializing(false)
				operation.unsubscribe()
			}
		})

		const operationID = getOperationID()
		addOperation({ operationID, operation })

		//set up the listener for the app events
		window.addEventListener("message", operationDispatcher, false);

		// A section panel stays mounted while the user navigates beside it; the host posts the open
		// item as `contextUpdated` instead of reloading it.
		const onContextUpdated = (event: MessageEvent) => {
			const update = readContextUpdate(event, appID, window.parent)
			if (!update) return
			if ("item" in update) setItem(update.item ?? null)
			if ("parent" in update) setParent(update.parent ?? null)
		}
		window.addEventListener("message", onContextUpdated, false);

		//send the init method call to the parent window
		invokeAppMethod<{ updateContextID: string }>({
			appID,
			operationID,
			operationType: "initialize"
		})

		return () => {
			//clean up the listener...
			removeEventListener("message", operationDispatcher, false);
			removeEventListener("message", onContextUpdated, false);
		}
	}, [])

	return {
		initializing,
		appInstallContext,
		instance,
		locale,
		field,
		contentItem,
		contentModel,
		pageItem,
		modalProps,
		embed,
		fieldValue,
		section,
		report,
		item,
		parent,
		user
	}
}