export default interface IUser {
	email: string
	username: string
	password: string
	verificationCode: string
	isVerified: boolean
	createdAt?: Date
	updatedAt?: Date
}
