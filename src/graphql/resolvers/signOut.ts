import type StatusType from '../../types/StatusType'
import { getDefaultSessionToken } from '../../lib/session'


export default async function signIn() {
	return {
		sessionToken: await getDefaultSessionToken(),
	}
}

