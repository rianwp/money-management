import { z } from 'zod'
import { transactionQuerySchema } from '../transaction/api'

export const categoryQuerySchema = transactionQuerySchema

export type ICategoryQuery = z.infer<typeof categoryQuerySchema>
