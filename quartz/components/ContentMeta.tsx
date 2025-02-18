import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { resolveRelative, simplifySlug } from "../util/path"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, allFiles, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: string[] = []

      if (fileData.dates) {
        segments.push(formatDate(getDate(cfg, fileData)!, cfg.locale))
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(displayedTime)
      }

      let before
      if (fileData.before?.length) {
        before = (
          <>
            Before:{" "}
            {fileData.before!.map((slug, i) => [
              i > 0 && ", ",
              slug === "Trailhead" ? (
                "None (Trailhead)"
              ) : (
                <a href={resolveRelative(fileData.slug!, slug)} class="internal">
                  {fileData.frontmatter?.before?.[i] ?? slug}
                </a>
              ),
            ])}
          </>
        )
      }

      const thisSlug = simplifySlug(fileData.slug!)
      const afterFiles = allFiles.filter((file) => file.before?.includes(thisSlug))
      let after
      if (afterFiles.length > 0) {
        after = (
          <>
            After:{" "}
            {afterFiles.map((file) => (
              <a href={resolveRelative(fileData.slug!, file.slug!)} class="internal">
                {file.frontmatter!.title}
              </a>
            ))}
          </>
        )
      }

      return (
        <p class={classNames(displayClass, "content-meta")}>
          {segments.join(", ")}
          {(before || after) && (
            <>
              <br />« {before} {before && after && "|"} {after} »
            </>
          )}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = `
  .content-meta {
    margin-top: 0;
    color: var(--gray);
  }
  `
  return ContentMetadata
}) satisfies QuartzComponentConstructor
