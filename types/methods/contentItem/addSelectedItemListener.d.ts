interface Props {
    onChange: (fieldValue: any) => void;
}
/**
 * addSelectedItemListener
 * 	attach a listener to a particular fieldName
 * 	On every update of the subscribed field, it fires the onFieldChanged operation
 * @param { onChange }
 */
export declare const addSelectedItemListener: ({ onChange }: Props) => void;
export {};
