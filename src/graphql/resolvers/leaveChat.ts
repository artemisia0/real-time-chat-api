import UserChatRelation from '../../mongooseModels/UserChatRelation'
import Message from '../../mongooseModels/Message'


export default async function leaveChat(_: any, { username, chatID }: { username: string; chatID: string }) {
	await UserChatRelation.findOneAndDelete({ username, chatID })
	await Message.deleteMany({ chatID, authorUsername: username })
	return {
		ok: true,
		message: "Successfully leaved a chat.",
	}
}

