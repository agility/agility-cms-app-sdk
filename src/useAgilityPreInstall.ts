import React, { useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { IInstallContext, IConfig  } from './types';
import { getOperationID } from './lib/getOperationID';
import { addOperation } from './lib/operationAccess';
import { operationDispatcher } from './lib/operationDispatcher';
import { invokeAppMethod } from './lib/invokeAppMethod';
import { getAppID } from './lib/getAppID';
interface AgilityPreInstallReturn {
	configuration: IConfig[]
}

/**
 * The pre install hook, used to pass configuration values to the install screen.
 *
 * @returns {AgilityPreInstallReturn}
 */
export const useAgilityPreInstall = (): AgilityPreInstallReturn => {

	 const [configuration, setConfiguration] = useState<IConfig[]>([])

	const appID = getAppID()
	if (!appID) return { configuration }

	useEffect(() => {
		//setup an operation observer to lcd isten for the context event after the initialize method

		const operation = new Subject<IInstallContext>();
		operation.subscribe((context) => {
			if (context) {
				setConfiguration(context.configuration)
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
		configuration
	}
}