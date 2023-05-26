export const getCloseModalID = (): string | null => {
		if (typeof window === 'undefined') return null
	const params = window.location.search
	const urlParams = new URLSearchParams(params)
	const id = urlParams.get('closeModalID') ?? null
	return id
}