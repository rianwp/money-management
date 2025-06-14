import { NextRequest, NextResponse } from 'next/server'
import { auth } from './lib/auth'

const protectedRoutes = ['/dashboard']

export default async function middleware(req: NextRequest) {
	const session = await auth()
	const pathname = req.nextUrl.pathname
	if (protectedRoutes.includes(pathname) && !session) {
		return NextResponse.redirect(new URL('/', req.url))
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
