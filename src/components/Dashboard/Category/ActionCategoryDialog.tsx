import { useState } from 'react'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from '@/components/ui/select'
import {
	categoryCreateSchema,
	ICategoryCreateRequest,
} from '@/types/category/api'
import useCreateCategory from '@/hooks/category/useCreateCategory'
import ButtonLoader from '@/components/utils/ButtonLoader'
import DynamicIcon from '@/components/utils/DynamicIcon'
import { IconName } from '@/types/icon'
import { TransactionType } from '@prisma/client'

interface IActionCategoryDialogProps {
	type: TransactionType
	children: React.ReactNode
}

const iconNames: IconName[] = [
	'circle',
	'star',
	'heart',
	'shopping-cart',
	'gift',
	'home',
	'car',
	'book',
	'briefcase',
	'utensils',
	'film',
	'music',
	'plane',
	'camera',
	'gamepad',
	'globe',
	'phone',
	'laptop',
	'smile',
	'sun',
	'moon',
	'cloud',
	'coffee',
	'droplet',
	'leaf',
	'battery',
	'bell',
	'calendar',
	'clock',
	'dollar-sign',
	'trending-up',
	'trending-down',
	'users',
	'zap',
	'wrench',
	'key',
	'lock',
	'map',
	'medal',
	'monitor',
	'package',
	'pie-chart',
	'printer',
	'scissors',
	'send',
	'server',
	'settings',
	'shield',
	'shopping-bag',
	'sliders',
	'tag',
	'target',
	'thermometer',
	'thumbs-up',
	'truck',
	'wallet',
	'watch',
	'wifi',
	'wind',
	'wine',
	'x',
	'zap-off',
]

const ActionCategoryDialog = ({
	type = 'INCOME',
	children,
}: IActionCategoryDialogProps) => {
	const [open, setOpen] = useState(false)
	const { mutateAsync, isPending } = useCreateCategory()
	const form = useForm<ICategoryCreateRequest>({
		resolver: zodResolver(categoryCreateSchema),
		defaultValues: {
			name: '',
			type,
			description: '',
			icon: iconNames[0],
			monthlyTarget: undefined,
		},
	})

	const onSubmit = async (values: ICategoryCreateRequest) => {
		await mutateAsync({
			...values,
			monthlyTarget: values.monthlyTarget
				? Number(values.monthlyTarget)
				: undefined,
		})
		setOpen(false)
		form.reset({
			name: '',
			type,
			description: '',
			icon: iconNames[0],
			monthlyTarget: undefined,
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Category</DialogTitle>
					<DialogDescription>
						Add a new category for your transactions.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Category name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Type</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select type" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value={TransactionType.INCOME}>
												Income
											</SelectItem>
											<SelectItem value={TransactionType.EXPENSE}>
												Expense
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<Select value={field.value} onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select icon" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{iconNames.map((icon) => (
												<SelectItem key={icon} value={icon}>
													<span className="flex items-center gap-2">
														<DynamicIcon name={icon} className="w-4 h-4" />
														{icon}
													</span>
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input placeholder="Description (optional)" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="monthlyTarget"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Monthly Target</FormLabel>
									<FormControl>
										<Input
											placeholder="Monthly target (optional)"
											type="number"
											{...field}
											onChange={(e) =>
												field.onChange(e.target.valueAsNumber || e.target.value)
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter className="sm:grid gap-2 grid-cols-2">
							<DialogClose asChild>
								<Button variant="outline" type="button" className="w-full">
									Cancel
								</Button>
							</DialogClose>
							<ButtonLoader
								onClick={form.handleSubmit(onSubmit)}
								type="submit"
								isLoading={isPending}
								className="w-full"
							>
								Add
							</ButtonLoader>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default ActionCategoryDialog
