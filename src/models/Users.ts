import { model, Schema } from 'mongoose'

import IUser from '@/interfaces/IUser'
import { generateRandomString } from '@/utils'

const UserSchema: Schema = new Schema<IUser>({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	verificationCode: {
		type: String,
		default: generateRandomString,
	},
	isVerified: {
		type: Boolean,
		required: true,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
}, {
	timestamps: true,
	toObject: { getters: true },
	toJSON: { getters: true },
})

export default model<IUser>('User', UserSchema)
