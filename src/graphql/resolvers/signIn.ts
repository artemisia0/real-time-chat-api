import type UserCredentialsType from '../../types/UserCredentialsType'
import bcrypt from 'bcrypt'
import User from '../../mongooseModels/User'
import { getSessionToken } from '../../lib/session'


interface ArgsType {
	userCredentials: UserCredentialsType;
}

export default async function signIn(_: any, args: ArgsType) {
	const { password, username } = args.userCredentials
	const foundUser = await User.findOne({ username })
	if (!foundUser) {
		return {
			status: {
				ok: false,
				message: "Invalid username.",
			}
		}
	}
	if (!(await bcrypt.compare(password, foundUser.hashedPassword ?? ""))) {
		return {
			status: {
				ok: false,
				message: "Invalid password.",
			}
		}
	}
	const sessionToken = await getSessionToken({
		username,
		userRole: 'user',
	})
	return {
		status: {
			ok: true,
			message: "Successfully signed in.",
		},
		sessionToken,
	}
}

