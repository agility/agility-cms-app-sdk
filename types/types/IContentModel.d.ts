interface FieldSettingsType {
    AvailableSettingAttributes: string[];
    Description: string;
    DesignerOnly: boolean;
    Editable: boolean;
    FieldID: string;
    FieldName: string;
    FieldType: string;
    HiddenField: boolean;
    IsDataField: boolean;
    ItemOrder: number;
    Label: string;
    LabelHelpDescription: string;
    Settings: any;
}
export interface IContentModel {
    AllowTagging: boolean;
    ContentDefinitionID: number;
    CustomIFrameUrl: string | null;
    CustomInputForm: boolean;
    CustomScripts: string | null;
    EnableLikes: boolean;
    EnableRating: boolean;
    EnableVoting: boolean;
    FieldSettings: FieldSettingsType[];
    LegacyInputForm: boolean;
    ReferenceName: string;
    Title: string;
}
export {};
