declare const useElementHeight: <T extends HTMLElement = HTMLDivElement>() => [(node: T | null) => void, number];
export default useElementHeight;
