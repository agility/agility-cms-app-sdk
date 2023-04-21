import { Subject } from "rxjs"

export interface IOperation<T> {
	operationID: string
	operation: Subject<T>
}


const operations: { [operationID: string]: Subject<any> } = {}

/**
 * Adds an operation to the list of operations, indexed by the operationID
 *
 * @template T
 * @param {IOperation<T>} { operationID, operation }
 * @returns
 */
export const addOperation = <T>({ operationID, operation }: IOperation<T>) => {
	operations[operationID] = operation
	return operation

}

export const getOperation = (operationID:string): Subject<any> | null => {
	const op = operations[operationID]
	delete operations[operationID]
	return op || null

}