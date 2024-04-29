import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'


export { default } from 'next-auth/middleware'

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    console.log("Middleware mein to aaya hai");

    const token = await getToken({req : request})
    const url = request.nextUrl
    // console.log("Token" , token);
    // console.log("Url" , url);

    if(token && 
        (
            url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')  ||
            url.pathname.startsWith('/')
        )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    if(!token && url.pathname.startsWith("/dashboard")){
        return NextResponse.redirect(new URL('/sign-in' , request.url))
    }

    return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/sign-up",
    '/sign-in',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
],
}

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
 
// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL('/', request.url))
// }
 
// // See "Matching Paths" below to learn more
// export const config = {
//     matcher: [
//     '/sign-in',
//     '/sign-up',
//     '/',
//     '/dashboard/:path*',
//     '/verify/:path*'
// ],
// }