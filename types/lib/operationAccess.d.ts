import { Subject } from "rxjs";
export interface IOperation<T> {
    operationID: string;
    operation: Subject<T>;
    autoDelete?: boolean;
}
/**
 * Adds an operation to the list of operations, indexed by the operationID
 *
 * @template T
 * @param {IOperation<T>} { operationID, operation }
 * @returns
 */
export declare const addOperation: <T>({ operationID, operation, autoDelete }: IOperation<T>) => Subject<T>;
export declare const getOperation: (operationID: string) => Subject<any> | null;
export declare const deleteOperation: (operationID: string) => void;
