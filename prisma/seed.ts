import prisma from '../src/lib/db'
import { hashPassword } from '../src/lib/utils'
import { TransactionType } from '@prisma/client'

async function main() {
	console.log('🌱 Starting database seeding...')

	// Create users
	const hashedPassword = await hashPassword('password123')

	await prisma.user.createMany({
		data: [
			{
				email: 'john.doe@example.com',
				password: hashedPassword,
				name: 'John Doe',
				phone: '+1234567890',
			},
			{
				email: 'jane.smith@example.com',
				password: hashedPassword,
				name: 'Jane Smith',
				phone: '+1987654321',
			},
			{
				email: 'mike.johnson@example.com',
				password: hashedPassword,
				name: 'Mike Johnson',
				phone: '+1122334455',
			},
		],
	})

	console.log('✅ Users created')

	// Get created users
	const createdUsers = await prisma.user.findMany()

	// Create categories for each user
	const categoryData = [
		// Income categories
		{
			name: 'Salary',
			icon: 'briefcase',
			type: 'INCOME',
			description: 'Monthly salary',
		},
		{
			name: 'Freelancing',
			icon: 'laptop',
			type: 'INCOME',
			description: 'Freelance work income',
		},
		{
			name: 'Investment',
			icon: 'trending-up',
			type: 'INCOME',
			description: 'Investment returns',
		},
		{
			name: 'Business',
			icon: 'building-2',
			type: 'INCOME',
			description: 'Business income',
		},
		{
			name: 'Other Income',
			icon: 'dollar-sign',
			type: 'INCOME',
			description: 'Other sources of income',
		},

		// Expense categories
		{
			name: 'Food & Dining',
			icon: 'utensils-crossed',
			type: 'EXPENSE',
			description: 'Restaurant and food expenses',
		},
		{
			name: 'Groceries',
			icon: 'shopping-cart',
			type: 'EXPENSE',
			description: 'Grocery shopping',
		},
		{
			name: 'Transportation',
			icon: 'car',
			type: 'EXPENSE',
			description: 'Car, fuel, public transport',
		},
		{
			name: 'Utilities',
			icon: 'zap',
			type: 'EXPENSE',
			description: 'Electricity, water, gas bills',
		},
		{
			name: 'Housing',
			icon: 'home',
			type: 'EXPENSE',
			description: 'Rent, mortgage, maintenance',
		},
		{
			name: 'Healthcare',
			icon: 'heart',
			type: 'EXPENSE',
			description: 'Medical expenses',
		},
		{
			name: 'Entertainment',
			icon: 'play',
			type: 'EXPENSE',
			description: 'Movies, games, subscriptions',
		},
		{
			name: 'Shopping',
			icon: 'shopping-bag',
			type: 'EXPENSE',
			description: 'Clothing and personal items',
		},
		{
			name: 'Education',
			icon: 'book-open',
			type: 'EXPENSE',
			description: 'Books, courses, training',
		},
		{
			name: 'Insurance',
			icon: 'shield',
			type: 'EXPENSE',
			description: 'Insurance premiums',
		},
	]

	for (const user of createdUsers) {
		for (const category of categoryData) {
			await prisma.category.create({
				data: {
					...category,
					userId: user.id,
					type: category.type as TransactionType,
				},
			})
		}
	}

	console.log('✅ Categories created')

	// Get all categories
	const categories = await prisma.category.findMany()

	// Create transactions for the past 6 months
	const currentDate = new Date()
	const transactions = []

	for (const user of createdUsers) {
		const userCategories = categories.filter((cat) => cat.userId === user.id)
		const incomeCategories = userCategories.filter(
			(cat) => cat.type === 'INCOME'
		)
		const expenseCategories = userCategories.filter(
			(cat) => cat.type === 'EXPENSE'
		)

		// Generate transactions for the past 6 months
		for (let month = 0; month < 6; month++) {
			const transactionDate = new Date(currentDate)
			transactionDate.setMonth(currentDate.getMonth() - month)

			// Generate income transactions (2-4 per month)
			const incomeCount = Math.floor(Math.random() * 3) + 2
			for (let i = 0; i < incomeCount; i++) {
				const category =
					incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
				const day = Math.floor(Math.random() * 28) + 1
				const date = new Date(
					transactionDate.getFullYear(),
					transactionDate.getMonth(),
					day
				)

				let amount, title, description

				switch (category.name) {
					case 'Salary':
						amount = (Math.random() * 2000 + 3000).toFixed(2) // $3000-5000
						title = 'Monthly Salary'
						description = 'Regular monthly salary payment'
						break
					case 'Freelancing':
						amount = (Math.random() * 800 + 200).toFixed(2) // $200-1000
						title = 'Freelance Project'
						description = 'Web development project payment'
						break
					case 'Investment':
						amount = (Math.random() * 300 + 50).toFixed(2) // $50-350
						title = 'Dividend Payment'
						description = 'Stock dividend or investment return'
						break
					case 'Business':
						amount = (Math.random() * 1500 + 500).toFixed(2) // $500-2000
						title = 'Business Revenue'
						description = 'Monthly business income'
						break
					default:
						amount = (Math.random() * 500 + 100).toFixed(2) // $100-600
						title = 'Other Income'
						description = 'Miscellaneous income'
				}

				transactions.push({
					amount: parseFloat(amount),
					title,
					description,
					type: 'INCOME' as TransactionType,
					date,
					userId: user.id,
					categoryId: category.id,
				})
			}

			// Generate expense transactions (8-15 per month)
			const expenseCount = Math.floor(Math.random() * 8) + 8
			for (let i = 0; i < expenseCount; i++) {
				const category =
					expenseCategories[
						Math.floor(Math.random() * expenseCategories.length)
					]
				const day = Math.floor(Math.random() * 28) + 1
				const date = new Date(
					transactionDate.getFullYear(),
					transactionDate.getMonth(),
					day
				)

				let amount, title, description

				switch (category.name) {
					case 'Food & Dining':
						amount = (Math.random() * 80 + 20).toFixed(2) // $20-100
						title = 'Restaurant Meal'
						description = 'Dinner at local restaurant'
						break
					case 'Groceries':
						amount = (Math.random() * 120 + 30).toFixed(2) // $30-150
						title = 'Grocery Shopping'
						description = 'Weekly grocery shopping'
						break
					case 'Transportation':
						amount = (Math.random() * 60 + 10).toFixed(2) // $10-70
						title = 'Fuel/Transport'
						description = 'Gas station or public transport'
						break
					case 'Utilities':
						amount = (Math.random() * 150 + 50).toFixed(2) // $50-200
						title = 'Utility Bill'
						description = 'Monthly utility payment'
						break
					case 'Housing':
						amount = (Math.random() * 500 + 800).toFixed(2) // $800-1300
						title = 'Rent Payment'
						description = 'Monthly rent or mortgage'
						break
					case 'Healthcare':
						amount = (Math.random() * 200 + 50).toFixed(2) // $50-250
						title = 'Medical Expense'
						description = 'Doctor visit or medication'
						break
					case 'Entertainment':
						amount = (Math.random() * 50 + 10).toFixed(2) // $10-60
						title = 'Entertainment'
						description = 'Movie tickets or streaming subscription'
						break
					case 'Shopping':
						amount = (Math.random() * 100 + 25).toFixed(2) // $25-125
						title = 'Shopping'
						description = 'Clothing or personal items'
						break
					case 'Education':
						amount = (Math.random() * 150 + 25).toFixed(2) // $25-175
						title = 'Educational Expense'
						description = 'Books or online course'
						break
					case 'Insurance':
						amount = (Math.random() * 200 + 100).toFixed(2) // $100-300
						title = 'Insurance Premium'
						description = 'Monthly insurance payment'
						break
					default:
						amount = (Math.random() * 100 + 20).toFixed(2) // $20-120
						title = 'Miscellaneous'
						description = 'Other expense'
				}

				transactions.push({
					amount: parseFloat(amount),
					title,
					description,
					type: 'EXPENSE' as TransactionType,
					date,
					userId: user.id,
					categoryId: category.id,
				})
			}
		}
	}

	// Batch create transactions
	await prisma.transaction.createMany({
		data: transactions,
	})

	console.log('✅ Transactions created')

	// Create user summaries
	for (const user of createdUsers) {
		const userTransactions = await prisma.transaction.findMany({
			where: { userId: user.id },
		})

		const currentMonth = currentDate.getMonth() + 1
		const currentYear = currentDate.getFullYear()

		// Calculate current month totals
		const currentMonthTransactions = userTransactions.filter((t) => {
			const transactionDate = new Date(t.date)
			return (
				transactionDate.getMonth() + 1 === currentMonth &&
				transactionDate.getFullYear() === currentYear
			)
		})

		const totalIncome = currentMonthTransactions
			.filter((t) => t.type === 'INCOME')
			.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

		const totalOutcome = currentMonthTransactions
			.filter((t) => t.type === 'EXPENSE')
			.reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

		await prisma.userSummary.create({
			data: {
				userId: user.id,
				totalIncome: totalIncome,
				totalOutcome: totalOutcome,
				currentMonth,
				currentYear,
			},
		})
	}

	console.log('✅ User summaries created')

	// Display summary
	const totalUsers = await prisma.user.count()
	const totalCategories = await prisma.category.count()
	const totalTransactions = await prisma.transaction.count()
	const totalSummaries = await prisma.userSummary.count()

	console.log('📊 Seeding completed successfully!')
	console.log(`Created ${totalUsers} users`)
	console.log(`Created ${totalCategories} categories`)
	console.log(`Created ${totalTransactions} transactions`)
	console.log(`Created ${totalSummaries} user summaries`)
}

main()
	.catch((e) => {
		console.error('❌ Error during seeding:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
