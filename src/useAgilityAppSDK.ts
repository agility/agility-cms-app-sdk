import { useEffect, useId, useState } from 'react';

import { IAppEventParam } from './types/IAppEventParam'
import { IAppInstallContext } from "./types/IAppInstallContext"
import { IInstance } from "./types/IInstance"
import { IContextParam } from './types';

export const useAgilityAppSDK = () => {
	const [initializing, setInitializing] = useState(true)
	const [appInstallContext, setAppInstallContext] = useState<IAppInstallContext | null>(null)
	const [instance, setInstance] = useState<IInstance | null>(null)
	const [locale, setLocale] = useState<string | null>(null)

	const operationID = useId()

	useEffect(() => {

		const params = window.location.search
		const urlParams = new URLSearchParams(params)
		const appID = Number(urlParams.get('appID'))


		//set up the listener for the app events
		const listener = (event: any) => {
			const { data } = event as { data: IAppEventParam<any> }

			switch (data.operationType) {
				case "context":
					const context = data.arg as IContextParam
					setAppInstallContext(context.app)
					setInstance(context.instance)
					setLocale(context.locale)
					setInitializing(false)
					break;

			}
		}

		window.addEventListener("message", listener, false);

		//send the init method call to the parent window
		const initArg: IAppEventParam<never> = {
			appID,
			operationID,
			operationType: "initialize"
		}

		window.parent.postMessage(initArg)

		return () => {
			removeEventListener("message", listener, false);
		}

	}, [])

	return {
		initializing,
		appInstallContext,
		instance,
		locale
	}
}