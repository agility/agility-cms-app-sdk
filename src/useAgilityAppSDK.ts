import { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { IAppInstallContext, IInstance, IContextParam, IField, IContentItem, IContentModel, IPageItem } from './types';
import { getOperationID } from './lib/getOperationID';
import { addOperation } from './lib/operationAccess';
import { operationDispatcher } from './lib/operationDispatcher';
import { invokeAppMethod } from './lib/invokeAppMethod';
import { getAppID } from './lib/getAppID';


interface AgilityAddSKReturn {
	initializing: boolean,
	appInstallContext: IAppInstallContext | null,
	instance: IInstance | null,
	locale: string | null,
	field: IField | null,
	contentItem: IContentItem | null,
	contentModel: IContentModel | null
	pageItem: IPageItem | null,
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
		pageItem
	}
}