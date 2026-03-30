// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

let mockCount = 0

vi.mock('@/lib/cart-store', () => ({
  useCart: (selector: (s: { count: () => number }) => unknown) =>
    selector({ count: () => mockCount }),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

import Navbar from '@/components/Navbar'

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText('Shop')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('shows cart badge when count > 0', () => {
    mockCount = 3
    render(<Navbar />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('hides cart badge when count is 0', () => {
    mockCount = 0
    render(<Navbar />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('toggles mobile menu on hamburger click', () => {
    mockCount = 0
    render(<Navbar />)
    const toggleButton = screen.getByLabelText('Toggle menu')

    // Menu should be hidden initially
    const shopLinks = screen.getAllByText('Shop')
    expect(shopLinks).toHaveLength(1) // only desktop link

    // Click to open
    fireEvent.click(toggleButton)
    const shopLinksAfterOpen = screen.getAllByText('Shop')
    expect(shopLinksAfterOpen.length).toBeGreaterThan(1) // desktop + mobile
  })
})
