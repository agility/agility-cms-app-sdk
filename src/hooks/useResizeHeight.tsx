import { useCallback } from "react"
import { setHeight } from "../methods"

/**
 * useResizeHeight
 * @param padding 
 * @returns a ref callback, that executes anytime a ref is attached to an element
 */
const useResizeHeight = (padding?: number) => {
 
  // Object refs don't trigger useEffect re-renders, so instead, use a ref-callback
  // to determine when a ref is attached to a node.
  return useCallback((node: any) => {
    if (node !== null) {
      // when ref attaches to node (node !== null) attach observable
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry) return
        // any time there's a resize event on this node, trigger setHeight in the sdk.
        const p = padding ?? 0 // if padding is undefined then set to 0
        setHeight({ height: entry.contentRect.height + p })
      })

      observer.observe(node)
    }
  }, [])
}

export default useResizeHeight