import { describe, expectTypeOf, it } from "vitest"
import type {
	AgilityAddSKReturn,
	IAppReportCapability,
	IAppSectionCapability,
	IContextParam,
	INavigationTarget,
	IReportContext
} from "../src"

// The reports surface is a contract with the Manager App: these pin its shape.
describe("reports surface types", () => {
	it("types a report capability like a section's, without icon or panel", () => {
		const report: IAppReportCapability = { name: "usage-by-day", label: "Usage by day", permissions: [1] }
		expectTypeOf(report).toMatchTypeOf<{ name: string; label: string; description?: string; permissions?: number[] }>()
	})

	it("lets a report choose its left-panel group and its order in it (2.5.0-beta.2)", () => {
		const report: IAppReportCapability = {
			name: "usage",
			label: "Usage",
			group: "Secure Assets",
			order: 4
		}
		expectTypeOf(report.group).toEqualTypeOf<string | undefined>()
		expectTypeOf(report.order).toEqualTypeOf<number | undefined>()
	})

	it("carries report: { name, appName } in the context and the hook", () => {
		expectTypeOf<IContextParam["report"]>().toEqualTypeOf<IReportContext | undefined>()
		expectTypeOf<AgilityAddSKReturn["report"]>().toEqualTypeOf<IReportContext | null>()
		expectTypeOf<IReportContext>().toEqualTypeOf<{ name: string; appName: string }>()
	})

	it("accepts an appReport navigation target", () => {
		const target: INavigationTarget = { type: "appReport", name: "usage-by-day" }
		expectTypeOf(target).toMatchTypeOf<INavigationTarget>()
	})

	it("lets a section name its own SVG icon with a named fallback", () => {
		const section: IAppSectionCapability = {
			name: "secure-assets",
			label: "Secure Assets",
			icon: "IconLock",
			iconUrl: "/secure-assets-icon.svg"
		}
		expectTypeOf(section.iconUrl).toEqualTypeOf<string | undefined>()
	})
})
