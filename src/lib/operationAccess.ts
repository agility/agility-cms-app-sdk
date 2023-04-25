import { Subject } from "rxjs"

export interface IOperation<T> {
	operationID: string
	operation: Subject<T>
	autoDelete?: boolean
}

interface IOperationsHash {
 [operationID: string]: { operation: Subject<any>, autoDelete?: boolean } 
}

const operations: IOperationsHash = {}

/**
 * Adds an operation to the list of operations, indexed by the operationID
 *
 * @template T
 * @param {IOperation<T>} { operationID, operation }
 * @returns
 */
export const addOperation = <T>({ operationID, operation, autoDelete = true }: IOperation<T>) => {
	operations[operationID] = { operation, autoDelete }
	return operation

}

export const getOperation = (operationID:string): Subject<any> | null => {
	const { operation, autoDelete }: { operation: Subject<any>, autoDelete?: boolean } = operations[operationID]

	if (autoDelete) {
		delete operations[operationID]
	}

	return operation || null
}


export const removeOperations = () => {
	for (const id of Object.getOwnPropertyNames(operations)) {
		const { operation } = operations[id]
		operation.unsubscribe()
		delete operations[id]
	}
}