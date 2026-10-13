/**
 * Where to send the Manager App.
 *
 * A target is an **intent, not a URL**. The host owns the Manager App's URL grammar and
 * builds the address from the instance and locale the editor is already looking at, which
 * buys two things that a raw path would not:
 *
 * - **An app cannot navigate out of the instance it is installed on.** Nothing in the
 *   payload names a guid, a locale, or an origin, so there is nothing to point elsewhere.
 *   That matters because the host does not check `event.origin` on inbound messages.
 * - **The URL grammar stays internal.** `list-`, `listitem-` and `newlistitem-` are the
 *   Manager App's private business. Apps in the wild pin old SDK versions; if they held
 *   URLs, that grammar could never change again.
 *
 * There is deliberately no `{ type: "path" }` escape hatch. Add a new member here when a
 * new destination is needed — that is additive, and every old app keeps working.
 */
export type INavigationTarget =
	| {
			/** An existing content item, opened in the content editor. */
			type: "contentItem"
			/**
			 * The item's content ID — the one the Management and Fetch APIs use, and the
			 * one shown in the CMS. On a Management **list** row this is
			 * `itemContainerID`, *not* `contentItemID`.
			 *
			 * @type {number}
			 */
			contentID: number
			/**
			 * The container the item lives in. Only needed when the destination is a
			 * screen of its own rather than one stacked on the current screen — see
			 * `openInStack` on {@link INavigateParam}.
			 *
			 * @type {number}
			 */
			containerID?: number
	  }
	| {
			/** A blank content item form, ready to fill in and save. */
			type: "newContentItem"
			/**
			 * The container the new item will be created in.
			 *
			 * @type {number}
			 */
			containerID: number
	  }
	| {
			/** A content list, as the Content section shows it. */
			type: "contentList"
			/**
			 * The container to list.
			 *
			 * @type {number}
			 */
			containerID: number
	  }
	| {
			/** A page, opened in the Pages section. */
			type: "page"
			/**
			 * The page's item container ID — what the Management API calls
			 * `ItemContainerID` on a page item.
			 *
			 * @type {number}
			 */
			pageID: number
	  }

export interface INavigateParam {
	/**
	 * The destination.
	 *
	 * @type {INavigationTarget}
	 * @memberof INavigateParam
	 */
	target: INavigationTarget

	/**
	 * Open the destination **on top of the current screen**, keeping it in the breadcrumb,
	 * rather than replacing it. Defaults to `true`.
	 *
	 * This is how the CMS's own nested-content fields behave, and it is almost always
	 * what an app on a content item wants: the editor goes in, does the thing, and the
	 * breadcrumb brings them back to where they were.
	 *
	 * Surfaces with no breadcrumb of their own — the dashboards, the install screen —
	 * ignore it and navigate to the destination's own screen.
	 *
	 * @type {boolean}
	 * @memberof INavigateParam
	 */
	openInStack?: boolean
}

export interface INavigationUrl {
	/**
	 * The full address, including the Manager App's origin — for example
	 * `https://app.agilitycms.com/instance/{guid}/en-us/content/list-30/listitem-1866`.
	 *
	 * **Absolute on purpose.** An app runs on its own origin, so a relative href inside
	 * it would resolve against the app, not the CMS. This is the one to put in an
	 * `<a href>`.
	 *
	 * @type {string}
	 * @memberof INavigationUrl
	 */
	url: string

	/**
	 * The same address without the origin, as the Manager App's own router sees it.
	 *
	 * Rarely what an app wants — see `url` — but it is what `navigate` acted on, and it
	 * is stable to compare.
	 *
	 * @type {string}
	 * @memberof INavigationUrl
	 */
	path: string
}
