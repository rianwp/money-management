import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatRupiah } from '@/lib/utils'
import { IApiResponse } from '@/types/api'
import { IUserBalance } from '@/types/user/api'
import { Decimal } from '@prisma/client/runtime/library'
import {
	Eye,
	EyeOff,
	LucideArrowDownLeft,
	LucideArrowUpRight,
} from 'lucide-react'
import { useState } from 'react'

interface IBalanceCardProps {
	isLoading: boolean
	data?: IApiResponse<IUserBalance>
}

const BalanceCard = ({ data, isLoading }: IBalanceCardProps) => {
	const [blur, setBlur] = useState(false)

	const handleBlur = () => {
		setBlur((blur) => !blur)
	}

	const defaultBlur = (data?: number | Decimal) =>
		blur || isLoading ? '***' : formatRupiah(Number(data || 0))

	return (
		<Card className="bg-gradient-to-r from-blue-600 to-purple-600 w-full h-full">
			<CardContent className="flex flex-col gap-y-3 text-white">
				<div className="flex flex-row gap-x-2 justify-between items-center">
					<p className="text-sm ">Total Balance</p>
					<Button variant="ghost" onClick={() => handleBlur()}>
						{blur ? <EyeOff /> : <Eye />}
					</Button>
				</div>
				<h2 className="text-4xl font-bold">
					{defaultBlur(data?.data?.totalBalance)}
				</h2>
				<div className="flex flex-row gap-x-2 justify-between">
					<div className="flex flex-row items-center gap-x-2">
						<LucideArrowUpRight className="size-5 text-green-300" />
						<div className="flex flex-col">
							<p className="text-sm ">Income</p>
							<p className="font-semibold">
								{defaultBlur(data?.data?.totalIncome)}
							</p>
						</div>
					</div>
					<div className="flex flex-row items-center gap-x-2">
						<div className="flex flex-col items-end">
							<p className="text-sm ">Expense</p>
							<p className="font-semibold">
								{defaultBlur(data?.data?.totalOutcome)}
							</p>
						</div>
						<LucideArrowDownLeft className="size-5 text-red-300" />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default BalanceCard
