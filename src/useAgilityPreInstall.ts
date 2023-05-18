import React, { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { IInstallContext, IConfig, IContextParam, IAppInstallContext, IInstance  } from './types';
import { getOperationID } from './lib/getOperationID';
import { addOperation } from './lib/operationAccess';
import { operationDispatcher } from './lib/operationDispatcher';
import { invokeAppMethod } from './lib/invokeAppMethod';
import { getAppID } from './lib/getAppID';
interface AgilityPreInstallReturn {
	initializing: boolean,
	appInstallContext: IAppInstallContext | null,
	instance: IInstance | null,
	locale: string | null,
}

/**
 * The pre install hook, used to pass configuration values to the install screen.
 *
 * @returns {AgilityPreInstallReturn}
 */
export const useAgilityPreInstall = (): AgilityPreInstallReturn => {
	const [initializing, setInitializing] = useState(true)
	const [appInstallContext, setAppInstallContext] = useState<IAppInstallContext | null>(null)
	const [instance, setInstance] = useState<IInstance | null>(null)
	const [locale, setLocale] = useState<string | null>(null)

	useEffect(() => {

		const appID = getAppID()
		if (!appID) return


		//setup an operation observer to lcd isten for the context event after the initialize method

		const operation = new Subject<IContextParam>();
		operation.subscribe((context) => {

			if (context) {
				setAppInstallContext(context.app)
				setInitializing(false)
				operation.unsubscribe()
			}
		})

		const operationID = getOperationID()
		addOperation({ operationID, operation })

		//set up the listener for the app events
		window.addEventListener("message", operationDispatcher, false);

		//send the preinstall method call to the parent window - this will trigger the preInstallMessage event and return the extra config values

		invokeAppMethod<never>({
			appID,
			operationID,
			operationType: "preInstall"
		})


		return () => {
			//clean up the listener...
			removeEventListener("message", operationDispatcher, false);
			// removeOperations()
		}
	}, [])

	return {
		initializing,
		appInstallContext,
		instance,
		locale
	}
}