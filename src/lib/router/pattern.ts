import { convertType, prefs } from "./utils"

export const pattern = (
    path: string,
    pattern: string | RegExp = "*",
    {
        loose = false,
        sensitive = false,
        blank = false,
        decode = decodeURIComponent,
    }: {
        loose?: boolean
        sensitive?: boolean
        blank?: boolean
        decode?: typeof decodeURIComponent
    } = {}
): Record<string, string> | null => {
    const blanks: Record<string, string> = {}
    const rgx =
        pattern instanceof RegExp
            ? pattern
            : pattern.split("/").reduce((rgx, seg, i, { length }) => {
                  if (seg) {
                      const pfx = seg[0]
                      if (pfx === "*") {
                          delete blanks["wild"]
                          rgx += "/(?<wild>.*)"
                      } else if (pfx === ":") {
                          const opt = seg.indexOf("?", 1)
                          const ext = seg.indexOf(".", 1)
                          const isOpt = !!~opt
                          const isExt = !!~ext

                          const key = seg.substring(
                              1,
                              isOpt ? opt : isExt ? ext : seg.length
                          )
                          delete blanks[key]

                          rgx +=
                              isOpt && !isExt
                                  ? `(?:/(?<${key}>[^/]+?))?`
                                  : `/(?<${key}>[^/]+?)`
                          if (isExt)
                              rgx += `${isOpt ? "?" : ""}\\${seg.substring(
                                  ext
                              )}`
                      } else {
                          rgx += `/${seg}`
                      }
                  }

                  if (i === length - 1) {
                      rgx += loose ? "(?:$|/)" : "/?$"
                  }

                  return rgx
              }, "^")

    const flags = sensitive ? "" : "i"
    const matches = new RegExp(rgx, flags).exec(path)

    return matches
        ? Object.entries(matches.groups || {}).reduce(
              (params: Record<string, string>, [key, val]) => {
                  const value = decode(val)
                  params[key] = prefs.convertTypes ? convertType(value) : value
                  return params
              },
              {}
          )
        : blank
        ? blanks
        : null
}
