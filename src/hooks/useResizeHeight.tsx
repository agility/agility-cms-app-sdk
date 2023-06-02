import {  useEffect, RefObject } from "react"
import { setHeight } from "../methods"

interface Props {
  ref: RefObject<HTMLElement>
  padding?: number
}

/**
 * useResizeHeight detects the height of the current ref object, and triggers the setHeight method to update the Content Manager
 * @param ref - html ref.
 * @param padding - optional additional padding for the height
 */
const useResizeHeight = ({ ref, padding = 0 }: Props) => {
  useEffect(() => {
    const mdeSizeElm = ref?.current
    if (!mdeSizeElm) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      // with a little extra height as padding
      setHeight({ height: entry.contentRect.height + padding })
    })

    observer.observe(mdeSizeElm)
    return () => observer.disconnect()
  }, [ref?.current])
}

export default useResizeHeight