interface IAuthPageProps {
	children: React.ReactNode
}

const AuthPage = ({ children }: IAuthPageProps) => {
	return (
		<div className="flex flex-row h-screen bg-gradient-to-l from-blue-800 to-blue-500">
			<div className="lg:w-1/2 w-0 h-full shrink-0 lg:flex justify-center items-center text-center hidden">
				<h1 className="font-bold text-5xl text-white">Money Management App</h1>
			</div>
			<div className="w-full h-full flex justify-center items-center">
				<div className="md:w-1/2">{children}</div>
			</div>
		</div>
	)
}

export default AuthPage
