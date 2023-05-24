import { IAppConfigValue, IAppEventParam, IAssetItem } from '../../types';
import { getOperationID } from '../../lib/getOperationID';
import { Subject } from 'rxjs';
import { addOperation } from '../../lib/operationAccess';
import { getAppID } from '../../lib/getAppID';
import { invokeAppMethod } from '../../lib/invokeAppMethod';

interface ISelectAssets {
	title: string
	singleSelectOnly: boolean
	callback: (assets: IAssetItem[]) => void
}

/**
 * selectAssets
 * Selects assets for the current context
 * This is meant to be used on the pages dashboard or content dashboard.
 *
 * @returns {Promise<any>}
 */
export const selectAssets = ({ title, singleSelectOnly, callback }: ISelectAssets) => {

	const appID = getAppID()
	if (!appID) return
	const operationID = getOperationID()
	const closeModalID = getOperationID()

	const arg: IAppEventParam<{ closeModalID: string, title: string, singleSelectOnly: boolean }> = {
		appID,
		operationID,
		operationType: "selectAssets",
		arg: {
			closeModalID,
			title,
			singleSelectOnly,
		}
	}

	const operation = new Subject<void>();
	addOperation<void>({ operationID, operation })

	const closeOperation = new Subject<{assets: IAssetItem[]}>();
	closeOperation.subscribe(({ assets }) => {
		callback(assets)
		closeOperation.unsubscribe()
	})

	addOperation<{assets: IAssetItem[]}>({ operationID: closeModalID, operation: closeOperation })

	//call the method in the parent windpow
	invokeAppMethod(arg)

}