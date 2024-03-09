import { FullSlug, SimpleSlug, TransformOptions, simplifySlug, splitAnchor, stripSlashes, transformLink } from "../../util/path";
import { QuartzTransformerPlugin } from "../types";

interface Options {
  /** How to resolve Markdown paths */
  markdownLinkResolution: TransformOptions["strategy"]
}

const defaultOptions: Options = {
  markdownLinkResolution: "absolute",
}

export const CrawlDependencies: QuartzTransformerPlugin<Partial<Options> | undefined> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "DependencyProcessing",
    htmlPlugins(ctx) {
      return [
        () => {
          return (_, file) => {
            const tags = file.data.frontmatter?.tags ?? []
            if (!tags.includes("clue") && !tags.includes("archive")) return

            const curSlug = simplifySlug(file.data.slug!)
            const transformOptions: TransformOptions = {
              strategy: opts.markdownLinkResolution,
              allSlugs: ctx.allSlugs,
            }

            file.data.before = file.data.frontmatter?.before?.map((target) => {
              // copied from from links.ts
              const dest = transformLink(
                file.data.slug!,
                target,
                transformOptions,
              )
              const url = new URL(dest, "https://base.com/" + stripSlashes(curSlug, true))
              const canonicalDest = url.pathname
              let [destCanonical, _destAnchor] = splitAnchor(canonicalDest)
              if (destCanonical.endsWith("/")) {
                destCanonical += "index"
              }
              const full = decodeURIComponent(stripSlashes(destCanonical, true)) as FullSlug
              const simple = simplifySlug(full)
              return simple
            }) ?? []
          }
        }
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    before: SimpleSlug[]
  }
}
