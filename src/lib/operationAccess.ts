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

export const getOperation = (operationID: string): Subject<any> | null => {
	const opCheck = operations[operationID]
	if (opCheck) {
		const { operation, autoDelete }: { operation: Subject<any>, autoDelete?: boolean } = opCheck

		if (autoDelete) {
			delete operations[operationID]
		}

		return operation || null
	}
	return null
}

export const peekOperation = (operationID: string): Subject<any> | null => {
	const opCheck = operations[operationID]
	if (opCheck) {
		const { operation, autoDelete }: { operation: Subject<any>, autoDelete?: boolean } = opCheck
		return operation
	}

	return null
}

export const deleteOperation = (operationID: string) => {
	delete operations[operationID]
}