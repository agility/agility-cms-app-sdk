import { useLayoutEffect, useEffect } from "react"
// usehooks-ts
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect