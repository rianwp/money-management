import prisma from '../src/lib/db'
import { hashPassword } from '../src/lib/utils'
import { TransactionType } from '@prisma/client'

async function main() {
	console.log('🌱 Starting database seeding...')

	// Create users with Indonesian data
	const hashedPassword = await hashPassword('password123')

	await prisma.user.createMany({
		data: [
			{
				email: 'budi.santoso@example.com',
				password: hashedPassword,
				name: 'Budi Santoso',
				phone: '+628123456789',
			},
			{
				email: 'sari.dewi@example.com',
				password: hashedPassword,
				name: 'Sari Dewi',
				phone: '+628987654321',
			},
			{
				email: 'ahmad.wijaya@example.com',
				password: hashedPassword,
				name: 'Ahmad Wijaya',
				phone: '+628112233445',
			},
		],
	})

	console.log('✅ Users created')

	// Get created users
	const createdUsers = await prisma.user.findMany()

	// Create categories for each user (in Indonesian)
	const categoryData = [
		// Income categories
		{
			name: 'Gaji',
			icon: 'briefcase',
			type: 'INCOME',
			description: 'Gaji bulanan',
		},
		{
			name: 'Freelance',
			icon: 'laptop',
			type: 'INCOME',
			description: 'Pendapatan freelance',
		},
		{
			name: 'Investasi',
			icon: 'trending-up',
			type: 'INCOME',
			description: 'Hasil investasi',
		},
		{
			name: 'Bisnis',
			icon: 'building-2',
			type: 'INCOME',
			description: 'Pendapatan bisnis',
		},
		{
			name: 'Pendapatan Lain',
			icon: 'dollar-sign',
			type: 'INCOME',
			description: 'Sumber pendapatan lainnya',
		},

		// Expense categories
		{
			name: 'Makanan & Restoran',
			icon: 'utensils-crossed',
			type: 'EXPENSE',
			description: 'Makan di restoran dan pengeluaran makanan',
		},
		{
			name: 'Belanja Harian',
			icon: 'shopping-cart',
			type: 'EXPENSE',
			description: 'Belanja kebutuhan sehari-hari',
		},
		{
			name: 'Transportasi',
			icon: 'car',
			type: 'EXPENSE',
			description: 'Mobil, bensin, transportasi umum',
		},
		{
			name: 'Listrik & Utilitas',
			icon: 'zap',
			type: 'EXPENSE',
			description: 'Tagihan listrik, air, gas',
		},
		{
			name: 'Tempat Tinggal',
			icon: 'home',
			type: 'EXPENSE',
			description: 'Sewa, KPR, maintenance rumah',
		},
		{
			name: 'Kesehatan',
			icon: 'heart',
			type: 'EXPENSE',
			description: 'Biaya medis dan kesehatan',
		},
		{
			name: 'Hiburan',
			icon: 'play',
			type: 'EXPENSE',
			description: 'Bioskop, game, subscription',
		},
		{
			name: 'Belanja',
			icon: 'shopping-bag',
			type: 'EXPENSE',
			description: 'Pakaian dan barang pribadi',
		},
		{
			name: 'Pendidikan',
			icon: 'book-open',
			type: 'EXPENSE',
			description: 'Buku, kursus, pelatihan',
		},
		{
			name: 'Asuransi',
			icon: 'shield',
			type: 'EXPENSE',
			description: 'Premi asuransi',
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

	// Create transactions for the past 6 months (in Rupiah)
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
					case 'Gaji':
						amount = Math.floor((Math.random() * 30000000 + 45000000)) // Rp 45jt - 75jt
						title = 'Gaji Bulanan'
						description = 'Pembayaran gaji bulanan'
						break
					case 'Freelance':
						amount = Math.floor((Math.random() * 12000000 + 3000000)) // Rp 3jt - 15jt
						title = 'Proyek Freelance'
						description = 'Pembayaran proyek web development'
						break
					case 'Investasi':
						amount = Math.floor((Math.random() * 4500000 + 750000)) // Rp 750rb - 5.25jt
						title = 'Dividen Saham'
						description = 'Dividen saham atau hasil investasi'
						break
					case 'Bisnis':
						amount = Math.floor((Math.random() * 22500000 + 7500000)) // Rp 7.5jt - 30jt
						title = 'Pendapatan Bisnis'
						description = 'Pendapatan bisnis bulanan'
						break
					default:
						amount = Math.floor((Math.random() * 7500000 + 1500000)) // Rp 1.5jt - 9jt
						title = 'Pendapatan Lain'
						description = 'Pendapatan lain-lain'
				}

				transactions.push({
					amount: amount,
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
					case 'Makanan & Restoran':
						amount = Math.floor((Math.random() * 1200000 + 300000)) // Rp 300rb - 1.5jt
						title = 'Makan di Restoran'
						description = 'Makan malam di restoran lokal'
						break
					case 'Belanja Harian':
						amount = Math.floor((Math.random() * 1800000 + 450000)) // Rp 450rb - 2.25jt
						title = 'Belanja Bulanan'
						description = 'Belanja kebutuhan bulanan'
						break
					case 'Transportasi':
						amount = Math.floor((Math.random() * 900000 + 150000)) // Rp 150rb - 1.05jt
						title = 'Bensin/Transportasi'
						description = 'SPBU atau transportasi umum'
						break
					case 'Listrik & Utilitas':
						amount = Math.floor((Math.random() * 2250000 + 750000)) // Rp 750rb - 3jt
						title = 'Tagihan Listrik'
						description = 'Pembayaran tagihan bulanan'
						break
					case 'Tempat Tinggal':
						amount = Math.floor((Math.random() * 7500000 + 12000000)) // Rp 12jt - 19.5jt
						title = 'Sewa Rumah'
						description = 'Sewa bulanan atau cicilan KPR'
						break
					case 'Kesehatan':
						amount = Math.floor((Math.random() * 3000000 + 750000)) // Rp 750rb - 3.75jt
						title = 'Biaya Kesehatan'
						description = 'Kunjungan dokter atau obat-obatan'
						break
					case 'Hiburan':
						amount = Math.floor((Math.random() * 750000 + 150000)) // Rp 150rb - 900rb
						title = 'Hiburan'
						description = 'Tiket bioskop atau subscription streaming'
						break
					case 'Belanja':
						amount = Math.floor((Math.random() * 1500000 + 375000)) // Rp 375rb - 1.875jt
						title = 'Belanja'
						description = 'Pakaian atau barang pribadi'
						break
					case 'Pendidikan':
						amount = Math.floor((Math.random() * 2250000 + 375000)) // Rp 375rb - 2.625jt
						title = 'Biaya Pendidikan'
						description = 'Buku atau kursus online'
						break
					case 'Asuransi':
						amount = Math.floor((Math.random() * 3000000 + 1500000)) // Rp 1.5jt - 4.5jt
						title = 'Premi Asuransi'
						description = 'Pembayaran asuransi bulanan'
						break
					default:
						amount = Math.floor((Math.random() * 1500000 + 300000)) // Rp 300rb - 1.8jt
						title = 'Lain-lain'
						description = 'Pengeluaran lainnya'
				}

				transactions.push({
					amount: amount,
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
