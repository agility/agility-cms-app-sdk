import { IAppInstallContext, IContextParam, IInstance, IUser } from "../types"

/**
 * What useAgilityPreInstall keeps from the host's `context` reply to `preInstall`: the install context, the
 * instance, the locale and the user.  Before 2.5.0-beta.3 the hook declared `instance` and `locale` but never set
 * them, so they stayed `null`.
 */
export const readPreInstallContext = (
	context: Partial<IContextParam> | null | undefined
): { appInstallContext: IAppInstallContext | null; instance: IInstance | null; locale: string | null; user: IUser | null } => ({
	appInstallContext: context?.app ?? null,
	instance: context?.instance ?? null,
	locale: context?.locale ?? null,
	user: context?.user ?? null
})
