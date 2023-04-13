import { useEffect, useMemo, useState } from 'react';
import { Subject } from 'rxjs';
import { IAppEventParam , IAppInstallContext, IInstance, IContextParam } from './types';
import { getOperationID } from './lib/getOperationID';
import { addOperation } from './lib/operationAccess';
import { operationDispatcher } from './lib/operationDispatcher';
import { invokeAppMethod } from './lib/invokeAppMethod';
import { getAppID } from './lib/getAppID';

export const useAgilityAppSDK = () => {
	const [initializing, setInitializing] = useState(true)
	const [appInstallContext, setAppInstallContext] = useState<IAppInstallContext | null>(null)
	const [instance, setInstance] = useState<IInstance | null>(null)
	const [locale, setLocale] = useState<string | null>(null)

	const appID = useMemo(() => {
		return getAppID()
	}, [])

	// const updateConfigurationValue = (key: string, value: string) => {
	// 	if (appInstallContext) {
	// 		const arg: IAppEventParam<{ key: string, value: string }> = {
	// 			appID,
	// 			operationID: getOperationID(),
	// 			operationType: "updateConfigurationValue",
	// 			arg: {
	// 				key,
	// 				value
	// 			}
	// 		}

	// 		window.parent.postMessage(arg, "*")
	// 	}
	// }

	useEffect(() => {

		if (appID < 0) return

		//setup an operation observer to listen for the context event after the initialize method
		const operation = new Subject<IContextParam>();

		operation.subscribe((context) => {
			if (context) {
				setAppInstallContext(context.app)
				setInstance(context.instance)
				setLocale(context.locale)
				setInitializing(false)
				operation.unsubscribe()
			}
		})

		const operationID = getOperationID()
		addOperation({ operationID, operation })

		//set up the listener for the app events
		window.addEventListener("message", operationDispatcher, false);

		//send the init method call to the parent window
		invokeAppMethod<never>({
			appID,
			operationID,
			operationType: "initialize"
		})

		return () => {
			//clean up the listener...
			removeEventListener("message", operationDispatcher, false);
		}



	}, [appID])

	return {
		initializing,
		appInstallContext,
		instance,
		locale
	}
}