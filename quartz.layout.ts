import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/TeamOm3ga",
      Twitter: "https://twitter.com/WeBrokeOlega",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer({
      folderClickBehavior: "link",
      sortFn(a, b) {
        // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
        // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    })),
  ],
  right: [
    Component.Graph({
      localGraph: {
        showTags: false
      },
      globalGraph: {
        showTags: false
      }
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    Component.DesktopOnly(Component.Explorer({
      folderClickBehavior: "link",
      sortFn(a, b) {
        // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
        // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
        return a.displayName.localeCompare(b.displayName, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      },
    })),
  ],
  right: [
    Component.Graph({
      localGraph: {
        showTags: false
      },
      globalGraph: {
        showTags: false
      }
    }),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}
