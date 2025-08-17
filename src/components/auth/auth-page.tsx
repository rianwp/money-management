import Logo from '../logo'

interface IAuthPageProps {
	children: React.ReactNode
}

const AuthPage = ({ children }: IAuthPageProps) => {
	return (
		<div className="relative flex lg:flex-row flex-col h-screen bg-gradient-to-l from-blue-800 to-blue-500">
			<div className="lg:w-1/2 w-full lg:h-full shrink-0 lg:flex justify-center items-center text-center">
				<div className="lg:static absolute top-[13%] w-full lg:w-auto flex justify-center gap-6 items-center">
					<Logo size="responsive" />
					<h1 className="font-bold lg:text-5xl sm:text-2xl text-lg text-white">
						Money Tracker
					</h1>
				</div>
			</div>
			<div className="w-full h-full flex justify-center items-center">
				<div className="md:w-1/2">{children}</div>
			</div>
		</div>
	)
}

export default AuthPage
