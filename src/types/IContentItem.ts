export interface INormalizedContentItem {
    contentID: number
    referenceName: string
    values: { [key: string]: any }
}

export interface IContentItem {
    ContentID: number
    Values: { [key: string]: any }
}