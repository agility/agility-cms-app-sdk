export interface IInstance {
	guid: string // the guid of the instance
	websiteName: string // the name of the website
	/**
	 * The regional Content Fetch API base url for this instance, including the guid
	 * (e.g. https://api.aglty.io/{guid} or https://api-eu.aglty.io/{guid}).
	 * Provided by the manager so apps don't need to derive the region themselves.
	 */
	baseUrl?: string
	/**
	 * The region key for this instance (e.g. "" for USA, "ca", "eu", "aus", "usa2", "dev").
	 */
	region?: string
}
