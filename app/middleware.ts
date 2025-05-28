// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('gtracker_token')?.value

  // Rotas que requerem autenticação
  const protectedPaths = ['/dashboard', '/forum', '/upload', '/chat', '/donate', '/rules']
  
  // Rotas que só devem ser acessadas por usuários não autenticados
  const authPaths = ['/login', '/register']

  const pathname = request.nextUrl.pathname

  // Se está tentando acessar rota protegida sem token
  if (protectedPaths.some(path => pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se está autenticado e tentando acessar login/register
  if (authPaths.some(path => pathname.startsWith(path)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/forum/:path*',
    '/upload/:path*',
    '/chat/:path*',
    '/donate/:path*',
    '/rules/:path*',
    '/login',
    '/register'
  ]
}