export type APITypes = "preview" | "fetch"

export interface IAPIKeyParam {
  apiType: APITypes
  /**
   * When true, the full usable API key (including the secret, formatted as
   * `Name.secret`) is resolved on the returned key as `APIKey`. Defaults to
   * false, in which case only the key metadata is returned.
   */
  fullKey?: boolean
}