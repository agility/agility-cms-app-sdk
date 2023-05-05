interface Props {
    fieldName: string;
    onChange: (fieldValue: any) => void;
}
/**
 * addFieldListener
 * 	attach a listener to a particular fieldName
 * 	On every update of the subscribed field, it fires the onFieldChanged operation
 * @param { fieldName, onChange }
 */
export declare const addFieldListener: ({ fieldName, onChange }: Props) => void;
export {};
