// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const mockAddItem = vi.fn()

vi.mock('@/lib/cart-store', () => ({
  useCart: (selector: (s: { addItem: typeof mockAddItem }) => unknown) =>
    selector({ addItem: mockAddItem }),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

import ShopClient from '@/app/(shop)/shop/ShopClient'

const mockProducts = [
  {
    id: '1', name: 'Album A', slug: 'album-a', description: 'desc',
    price: 20, comparePrice: null, category: 'Albums', featured: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2', name: 'Storage B', slug: 'storage-b', description: 'desc',
    price: 50, comparePrice: 60, category: 'Photo Storage', featured: false,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: '3', name: 'Album C', slug: 'album-c', description: 'desc',
    price: 10, comparePrice: null, category: 'Albums', featured: false,
    createdAt: new Date('2024-03-01'),
  },
]

beforeEach(() => {
  mockAddItem.mockClear()
})

describe('ShopClient', () => {
  it('renders all products when All category selected', () => {
    render(<ShopClient products={mockProducts} />)
    expect(screen.getByText('Album A')).toBeInTheDocument()
    expect(screen.getByText('Storage B')).toBeInTheDocument()
    expect(screen.getByText('Album C')).toBeInTheDocument()
  })

  it('filters by category when category button clicked', () => {
    render(<ShopClient products={mockProducts} />)
    fireEvent.click(screen.getByRole('button', { name: 'Albums' }))
    expect(screen.getByText('Album A')).toBeInTheDocument()
    expect(screen.getByText('Album C')).toBeInTheDocument()
    expect(screen.queryByText('Storage B')).not.toBeInTheDocument()
  })

  it('sorts by price ascending', () => {
    render(<ShopClient products={mockProducts} />)
    fireEvent.change(screen.getByDisplayValue('Featured'), {
      target: { value: 'price-asc' },
    })
    const prices = screen.getAllByText(/^\$\d+\.\d{2}$/)
    const priceValues = prices.map(el => parseFloat(el.textContent!.replace('$', '')))
    expect(priceValues[0]).toBeLessThanOrEqual(priceValues[1])
  })

  it('sorts by price descending', () => {
    render(<ShopClient products={mockProducts} />)
    fireEvent.change(screen.getByDisplayValue('Featured'), {
      target: { value: 'price-desc' },
    })
    // Get only the primary price spans (class contains font-medium but not line-through)
    const priceElements = screen.getAllByText(/^\$\d+\.\d{2}$/).filter(
      el => !el.className.includes('line-through')
    )
    const priceValues = priceElements.map(el => parseFloat(el.textContent!.replace('$', '')))
    for (let i = 0; i < priceValues.length - 1; i++) {
      expect(priceValues[i]).toBeGreaterThanOrEqual(priceValues[i + 1])
    }
  })

  it('shows empty state when no products match category', () => {
    render(<ShopClient products={mockProducts} />)
    fireEvent.click(screen.getByText('Portfolios'))
    expect(screen.getByText('No products found in this category.')).toBeInTheDocument()
  })

  it('calls addItem with correct data on Add to Cart click', () => {
    render(<ShopClient products={mockProducts} />)
    const addButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addButtons[0])
    expect(mockAddItem).toHaveBeenCalledWith({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
      quantity: 1,
      slug: expect.any(String),
    })
  })

  it('displays compare price with strikethrough when present', () => {
    render(<ShopClient products={mockProducts} />)
    expect(screen.getByText('$60.00')).toBeInTheDocument()
  })
})
