import { z } from 'zod'

export const creatorRoleSchema = z.enum(['MANAGER', 'EMPLOYEE'])
export const userStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED'])
export const subscriptionPlanSchema = z.enum(['FREE', 'PRO', 'BASIC'])

export const creatorRowSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string(),
  role: creatorRoleSchema,
  status: userStatusSchema,
  subscriptionPlan: subscriptionPlanSchema,
  telegramId: z.string().nullable(),
})

export const clientStatusSchema = z.enum(['ACTIVE', 'INACTIVE'])
export const clientRowSchema = z.object({
  id: z.number(),
  telegramId: z.number(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  phone: z.string().nullable(),
  status: clientStatusSchema,
})

export const businessProfileStatusSchema = z.enum(['ACTIVE', 'SUSPENDED', 'DELETED'])
export const profileRowSchema = z.object({
  id: z.string(),
  creatorId: z.number(),
  name: z.string(),
  description: z.string(),
  status: businessProfileStatusSchema,
})

export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

export const paginatedDataSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: paginationSchema,
  })

export const apiSuccessSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.literal('success'),
    data: dataSchema,
  })

export const creatorsResponseSchema = apiSuccessSchema(paginatedDataSchema(creatorRowSchema))
export const clientsResponseSchema = apiSuccessSchema(paginatedDataSchema(clientRowSchema))
export const profilesResponseSchema = apiSuccessSchema(paginatedDataSchema(profileRowSchema))

export type CreatorRow = z.infer<typeof creatorRowSchema>
export type ClientRow = z.infer<typeof clientRowSchema>
export type ProfileRow = z.infer<typeof profileRowSchema>

export type PaginationMeta = z.infer<typeof paginationSchema>
export type PaginatedData<T> = {
  data: T[]
  pagination: PaginationMeta
}
