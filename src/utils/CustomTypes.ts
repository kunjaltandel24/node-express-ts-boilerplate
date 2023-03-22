import mongoose, { FilterQuery, UpdateQuery } from 'mongoose'

export interface CustomError extends Error {
	notAllowed?: boolean
	notFound?: boolean
	gone?: boolean
	locked?: boolean
	forbidden?: boolean
	invalidCredential?: boolean
	unauthorized?: boolean
	badRequest?: boolean
	conflict?: boolean
	expectationFailed?: boolean
	limitCrossed?: boolean
	message: string
}

export interface IBaseQueryParams {
	limit?: string
	offset?: string
	q?: string
	orderBy?: { [key: string]: 1 | -1 }
	tags?: string[]
	priceMin?: number
	priceMax?: number
}

export type PopulateType = mongoose.PopulateOptions | (mongoose.PopulateOptions | string)[]
export type Only<T, K extends keyof T> = Pick<T, K>
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type UpdateOne<T> = {
	updateOne: {
		filter: FilterQuery<T>
		update: UpdateQuery<T>
	}
}
