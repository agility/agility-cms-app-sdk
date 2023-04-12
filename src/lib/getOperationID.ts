
let id = 0
export function generateId() {
	return ++id
}

export const getOperationID = () => {
	return `operation-${generateId()}`

}