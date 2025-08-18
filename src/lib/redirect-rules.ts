import { Redirect } from 'next/dist/lib/load-custom-routes'

const redirectRules: Redirect[] = [
	{
		source: '/',
		destination: '/dashboard',
		permanent: true,
	},
]

export default redirectRules
