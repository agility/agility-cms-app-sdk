export interface SelectedItem {
  contentItemID: number | string,
  contentViewID: number,
  createdDate: string,
  itemContainerID: number | string,
  state: string,
  title: string,
  userName: string 
}

export interface IAppSelectedItems {
  selectedItems: SelectedItem[]
}