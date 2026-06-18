import { getOperationID } from '../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../lib/operationAccess';
import { getAppID } from '../lib/getAppID';
import { invokeAppMethod } from '../lib/invokeAppMethod';
import { IAppEventParam, IAPIKeyParam, APITypes } from '../types';

/**
 * Gets a ready-to-use Content Fetch API key of the given type (fetch/preview)
 * for the current instance. The manager resolves the key + secret and returns
 * the full key string (e.g. "defaultlive.xxxxx") that can be passed directly in
 * the `APIKey` header of a Content Fetch API request.
 *
 * Available on any app surface (content item sidebar, page sidebar, etc.).
 *
 * @returns {Promise<string | null>} the full API key string, or null if none is available
 */
export const getFetchAPIKey = ({ apiType }: IAPIKeyParam):(Promise<string | null> | undefined) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const arg: IAppEventParam<{ apiType: APITypes }> = {
		appID,
		operationID,
		operationType: "getFetchAPIKey",
		arg: {
			apiType
		}
	}

	const operation = new Subject<{ apiKey: string | null }>();

	//setup the return promise so we can call it when the parent window returns the result
	const p = new Promise<string | null>((resolve) => {
		operation.subscribe(({ apiKey }) => {
			resolve(apiKey)
			operation.unsubscribe()
		})
	})

	addOperation<{ apiKey: string | null }>({ operationID, operation })

	//call the method in the parent windpow
	invokeAppMethod(arg)


	return p

}