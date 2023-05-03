export interface IPageItem {
	ParentPageID: number,
	ParentPageItemContainerID: number,
	PageTemplateID: number,
	PageTemplateName: string | null,
	ContentItemID: number,
	DetachPageContent: boolean,
	RequiresAuthentication: boolean,
	IncludeInStatsTracking: boolean,
	ExcludeFromOutputCache: boolean,
	CustomAnalyticsScript: string,
	PagePath: string | null,
	PageType: number,
	PageHierarchyPosition: number,
	PageName: string,
	URL: string | null,
	MetaKeyWords: string,
	MetaTagsRaw: string,
	MetaTags: string
	LanguageCode: string,
	DomainName: string,
	IsValid: boolean,
	PageTemplateRelativePath: string,
	StyleSheets: any[],
	PreviewUrl: string | null,
	RequiresApproval: boolean,
	ItemContainerID: number,
	CurrentItemID: number,
	StagingItemID: number,
	PublishedItemID: number,
	CreatedDate: string,
	PublishedDate: string,
	ReleaseDate: string,
	PullDate: string,
	Mode: number,
	State: number,
	Menu: any,
	CurrentUserCanDelete: boolean,
	CurrentUserCanEdit: boolean
	CurrentUserCanDesign: boolean
	CurrentUserCanManage: boolean
	DynamicPageContentViewID: number
	DynamicPageContentDefinitionID: number
	DynamicPageContentViewFieldName: string | null
	DynamicPageContentViewSort: string | null
	DynamicPageContentViewFilter: string | null
	DynamicPageTitle: string | null
	DynamicPageName: string | null
	DynamicPageMenuText: string | null
	DynamicPageVisibleOnMenu: boolean
	DynamicPageVisibleOnSitemap: boolean
	DigitalChannelID: number
	Title: string
	CreatedAuthor: IAuthorType,
	PublishedAuthor: IAuthorType,
	Users: any[],
	Teams: any[],
	Notifications: any[]
}

interface IAuthorType {
	UserID: number
	EmailAddress: string,
	UserName: string
	FirstName: string
	LastName: string
	FullName: string
	IsDeleted: boolean
	IsTeamUser: boolean
	TeamID: number | null
	DefaultUILanguage: string,
	IsSuspended: boolean
}