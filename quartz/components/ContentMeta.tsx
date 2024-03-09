import { Date, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import { resolveRelative, simplifySlug } from "../util/path"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, allFiles, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(<Date date={getDate(cfg, fileData)!} locale={cfg.locale} />)
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>{displayedTime}</span>)
      }

      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

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
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
          {(before || after) && (
            <span>
              <br />« {before} {before && after && "|"} {after} »
            </span>
          )}
        </p>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
