import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAdminToken } from '@/lib/admin-auth'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } })

    if (!admin) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createAdminToken(email)
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}
