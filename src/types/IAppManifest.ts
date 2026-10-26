/**
 * Entries of the app manifest's `capabilities`, typed for apps that build their manifest in
 * TypeScript.  The manifest is plain JSON served by the app; nothing in the SDK reads it.
 * The host validates every entry and skips (and logs) a bad one without failing the others.
 */

/**
 * One entry of `capabilities.sections`: a left-navigation entry and a full-pane screen at
 * `{appUrl}/sections/{name}`.  New in 2.5.0.
 *
 * @export
 * @interface IAppSectionCapability
 */
export interface IAppSectionCapability {
	/** 2–40 lowercase letters, digits and hyphens, starting with a letter.  Not a built-in section name. */
	name: string
	label: string
	description?: string
	/**
	 * A Tabler icon name from the host's allow-list (`IconFolder`, `IconLock`, …).  Anything else
	 * falls back to `IconApps`.  Also the fallback for `iconUrl`.
	 */
	icon?: string
	/**
	 * Your own nav icon: an SVG resolved against your app's URL (`"/my-icon.svg"` works) and
	 * accepted only on your app's own origin.  Draw it like the Manager App's own nav icons: a
	 * `0 0 20 20` viewBox, `fill="none"`, `stroke="currentColor"` and no `stroke-width`, using
	 * only `g`, `path`, `rect`, `circle`, `ellipse`, `line`, `polyline` and `polygon`.  Serve it
	 * with `Access-Control-Allow-Origin: *`.  The host inlines a sanitized copy so the nav's
	 * colours apply; it shows `icon` instead while it loads, and whenever the file is off-origin,
	 * fails to load or uses anything outside that list.  New in 2.5.0-beta.1.
	 */
	iconUrl?: string
	/** ANY of these permission ids (or FullControl) shows the section.  Absent or empty means Read. */
	permissions?: number[]
	/** `true` gives the section a navigation panel at `/sections/{name}/panel`.  New in 2.5.0-beta.1. */
	panel?: boolean
}

/**
 * One entry of `capabilities.items`: a screen on the item stack at `{appUrl}/items/{name}`.
 * New in 2.5.0.
 *
 * @export
 * @interface IAppItemCapability
 */
export interface IAppItemCapability {
	/** 3–30 lowercase letters and digits, starting with a letter, **no hyphen**. */
	name: string
	label: string
	description?: string
}

/**
 * One entry of `capabilities.reports`: an entry in the Reports section's left panel, under the
 * group `group` names (your app's name when absent), and a full-pane report at
 * `{appUrl}/reports/{name}`.  New in 2.5.0-beta.1; `group` and `order` in 2.5.0-beta.2.
 *
 * @export
 * @interface IAppReportCapability
 */
export interface IAppReportCapability {
	/** 2–40 lowercase letters, digits and hyphens, starting with a letter.  Unique within your app. */
	name: string
	/** The entry's text in the Reports left panel, and the report's heading until `setTitle`. */
	label: string
	description?: string
	/** ANY of these permission ids (or FullControl) shows the report.  Absent or empty means Read. */
	permissions?: number[]
	/**
	 * The heading of the Reports left-panel group to list the report under.  New in 2.5.0-beta.2.
	 *
	 * - A built-in group's key or English label, in any case, joins that group, after its own entries:
	 *   `"agility-reports"` / `"Agility Reports"`, `"custom-reports"` / `"Custom Reports"`.
	 * - Anything else makes a group with that heading.  Reports from different apps with the same
	 *   `group` (ignoring case) share one group.
	 * - Absent: your app's install name.
	 *
	 * Trimmed; 1–60 characters of plain text (no control characters, no `<` or `>`), always shown
	 * as text.  An invalid value is logged and treated as absent.  The report's URL doesn't change
	 * with its group.
	 */
	group?: string
	/**
	 * The report's position within its group, ascending.  Reports without one follow those with
	 * one.  Not a number: logged and treated as absent.  New in 2.5.0-beta.2.
	 */
	order?: number
}
