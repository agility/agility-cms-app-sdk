export interface IField {
    id: string;
    label: string;
    typeName: string;
    name: string;
    value: any;
    description?: string;
    required: boolean;
    readOnly: boolean;
}
