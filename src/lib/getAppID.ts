export const getAppID = () => {
	if (typeof window === 'undefined') return -1
	const params = window.location.search
	const urlParams = new URLSearchParams(params)
	const id = Number(urlParams.get('appID'))
	if (isNaN(id)) return -1
	return id
}