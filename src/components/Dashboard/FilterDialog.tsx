import { Filter } from 'lucide-react'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import ButtonLoader from '../utils/ButtonLoader'
import { Button } from '../ui/button'
import DynamicFilterForm from '../utils/DynamicFilterForm'
import { IFilterField } from '@/types/form'
import { useState } from 'react'

interface IFilterDialogProps {
	disabled?: boolean
	isLoading?: boolean
	fields: IFilterField[]
}

const FilterDialog = ({ disabled, isLoading, fields }: IFilterDialogProps) => {
	const [filters, setFilters] = useState<Record<string, any>>({})
	const handleFilterSubmit = (values: Record<string, any>) => {
		setFilters(values)
		console.log(filters)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<ButtonLoader
					variant="outline"
					size="lg"
					isLoading={isLoading}
					disabled={disabled}
					icon={<Filter />}
				>
					Filter
				</ButtonLoader>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Filter</DialogTitle>
				</DialogHeader>

				<DynamicFilterForm
					fields={fields}
					onSubmit={handleFilterSubmit}
					defaultValues={filters}
				/>

				<DialogFooter className="sm:grid gap-2 grid-cols-2">
					<DialogClose asChild>
						<Button variant="outline" type="button" className="w-full">
							Cancel
						</Button>
					</DialogClose>
					<ButtonLoader
						type="submit"
						form="dynamic-filter-form"
						className="w-full"
						isLoading={isLoading}
					>
						Apply
					</ButtonLoader>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default FilterDialog
