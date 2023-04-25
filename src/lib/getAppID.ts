export const getAppID = () => {
	if (typeof window === 'undefined') return "-1"
	const params = window.location.search
	const urlParams = new URLSearchParams(params)
	const id = urlParams.get('appID') ?? ""
	return id
}