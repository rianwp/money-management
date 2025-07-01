import { UserSummary } from '@prisma/client'

export type IUserBalance = UserSummary & { totalBalance: number }

interface IGrowthData {
	percent: number
	label: string
	progress: number
}

export interface IUserGrowth {
	incomeGrowth: IGrowthData
	expenseGrowth: IGrowthData
	balanceGrowth: IGrowthData
}
