interface IAuthPageProps {
	children: React.ReactNode
}

const AuthPage = ({ children }: IAuthPageProps) => {
	return (
		<div className="flex flex-row h-screen">
			<div className="lg:w-1/2 w-0 h-full bg-blue-400 shrink-0"></div>
			<div className="w-full h-full flex justify-center items-center">
				<div className="md:w-1/2">{children}</div>
			</div>
		</div>
	)
}

export default AuthPage
