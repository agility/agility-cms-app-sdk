import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { IAppInstallContext, IInstance, IContextParam, IField, IContentItem, IContentModel, IPageItem } from './types';
import { getOperationID } from './lib/getOperationID';
import { addOperation } from './lib/operationAccess';
import { operationDispatcher } from './lib/operationDispatcher';
import { invokeAppMethod } from './lib/invokeAppMethod';
import { getAppID } from './lib/getAppID';
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
	 * The current field value.  Only available when on a custom field.
	 * If the field value changes outside of the SDK, this value will be updated.
	 *
	 * @type {string}
	 * @memberof AgilityAddSKReturn
	 */
	fieldValue: string
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
				setContentModel(context.contentModel || null)
				setModalProps(context.modalProps || null)

				if (context.field) {
					//if we are on a custom field, add a listener for the field value
					setFieldValue(context.contentItem?.values[context.field.name] || "")

					addFieldListener({
						fieldName: context.field?.name,
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

		//send the init method call to the parent window
		invokeAppMethod<{ updateContextID: string }>({
			appID,
			operationID,
			operationType: "initialize"
		})

		return () => {
			//clean up the listener...
			removeEventListener("message", operationDispatcher, false);
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
		fieldValue
	}
}