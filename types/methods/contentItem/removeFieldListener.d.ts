interface Props {
    fieldName: string;
}
/**
 * removeFieldListener
 * 	attach a listener to a particular fieldName
 * 	On every update of the subscribed field, it fires the onFieldChanged operation
 * @param { fieldName, onChange }
 */
export declare const removeFieldListener: ({ fieldName }: Props) => void;
export {};
