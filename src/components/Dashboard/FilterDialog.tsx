'use client'

import { useState } from 'react'
import { Filter } from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '../ui/dialog'
import ButtonLoader from '../utils/ButtonLoader'
import DynamicFilterForm from '../utils/DynamicFilterForm'
import { IFilterField } from '@/types/form'
import useUtilsSearchParams from '@/hooks/useUtilsSearchParams'

interface IFilterDialogProps {
	disabled?: boolean
	isLoading?: boolean
	fields: IFilterField[]
	handleSubmit: (values: Record<string, any>) => void
	defaultValues: Record<string, any>
	description?: string
}

const FilterDialog = ({
	handleSubmit,
	defaultValues,
	disabled,
	isLoading,
	fields,
	description,
}: IFilterDialogProps) => {
	const [open, setOpen] = useState(false)
	const { clearSearchParams } = useUtilsSearchParams()

	const handleClear = () => {
		clearSearchParams()
		setOpen(false)
	}

	const onSubmit = (values: Record<string, any>) => {
		handleSubmit(values)
		setOpen(false)
	}

	return (
		<>
			<ButtonLoader
				variant="outline"
				size="lg"
				isLoading={isLoading}
				disabled={disabled}
				icon={<Filter />}
				onClick={() => setOpen(true)}
			>
				Filter
			</ButtonLoader>

			<Dialog open={open} onOpenChange={setOpen}>
				{open && (
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Filter</DialogTitle>
							<DialogDescription>
								{description || 'Filter your data using the options below'}
							</DialogDescription>
						</DialogHeader>

						<DynamicFilterForm
							fields={fields}
							onSubmit={onSubmit}
							defaultValues={defaultValues}
						/>

						<DialogFooter className="sm:grid gap-2 grid-cols-2">
							<ButtonLoader
								className="w-full"
								variant="destructive"
								isLoading={isLoading}
								onClick={handleClear}
							>
								Clear
							</ButtonLoader>
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
				)}
			</Dialog>
		</>
	)
}

export default FilterDialog
