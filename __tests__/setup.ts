import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock next/headers - cookies() returns an async cookie store
const cookieMap = new Map<string, { name: string; value: string }>()

export function setMockCookie(name: string, value: string) {
  cookieMap.set(name, { name, value })
}

export function clearMockCookies() {
  cookieMap.clear()
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: (name: string) => cookieMap.get(name) || undefined,
    set: (name: string, value: string) => {
      cookieMap.set(name, { name, value })
    },
    delete: (name: string) => {
      cookieMap.delete(name)
    },
  })),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))
