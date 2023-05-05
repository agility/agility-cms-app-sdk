export interface IAssetItem {
	ContainerEdgeUrl?: string
	ContainerID?: number
	ContainerOriginUrl?: string
	ContentType?: string
	DateModified?: string
	EdgeUrl?: string
	FileName?: string
	GridThumbnailID?: number
	GridThumbnailSuffix?: string | number
	HasChildren?: boolean
	IsDeleted?: boolean
	IsFolder?: boolean
	IsImage?: boolean
	IsSvg?: boolean
	MediaGroupingID?: number
	MediaGroupingName?: string | number
	MediaGroupingSortOrder?: number
	MediaID?: number
	MetaData?: any
	ModifiedBy?: number
	ModifiedByName?: string
	OriginKey?: string
	OriginUrl?: string
	Size?: number
	ThumbnailUrl?: string
}