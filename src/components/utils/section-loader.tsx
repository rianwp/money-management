import { Loader2 } from 'lucide-react'

const SectionLoader = () => {
	return (
		<div className="flex justify-center items-center">
			<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
		</div>
	)
}

export default SectionLoader
