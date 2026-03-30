// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { useCart, type CartItem } from '@/lib/cart-store'

const sampleItem: CartItem = {
  id: 'prod-1',
  name: 'Test Product',
  price: 29.99,
  quantity: 1,
  slug: 'test-product',
}

const anotherItem: CartItem = {
  id: 'prod-2',
  name: 'Another Product',
  price: 49.99,
  quantity: 2,
  slug: 'another-product',
}

beforeEach(() => {
  useCart.setState({ items: [] })
  localStorage.removeItem('native-archival-cart')
})

describe('cart-store', () => {
  describe('addItem', () => {
    it('adds item to empty cart', () => {
      useCart.getState().addItem(sampleItem)
      expect(useCart.getState().items).toHaveLength(1)
      expect(useCart.getState().items[0]).toEqual(sampleItem)
    })

    it('merges quantity when adding duplicate item', () => {
      useCart.getState().addItem(sampleItem)
      useCart.getState().addItem({ ...sampleItem, quantity: 3 })
      expect(useCart.getState().items).toHaveLength(1)
      expect(useCart.getState().items[0].quantity).toBe(4)
    })

    it('adds different items separately', () => {
      useCart.getState().addItem(sampleItem)
      useCart.getState().addItem(anotherItem)
      expect(useCart.getState().items).toHaveLength(2)
    })
  })

  describe('removeItem', () => {
    it('removes existing item', () => {
      useCart.getState().addItem(sampleItem)
      useCart.getState().addItem(anotherItem)
      useCart.getState().removeItem('prod-1')
      expect(useCart.getState().items).toHaveLength(1)
      expect(useCart.getState().items[0].id).toBe('prod-2')
    })

    it('does nothing for nonexistent id', () => {
      useCart.getState().addItem(sampleItem)
      useCart.getState().removeItem('nonexistent')
      expect(useCart.getState().items).toHaveLength(1)
    })
  })

  describe('updateQuantity', () => {
    it('updates quantity to new value', () => {
      useCart.getState().addItem(sampleItem)
      useCart.getState().updateQuantity('prod-1', 5)
      expect(useCart.getState().items[0].quantity).toBe(5)
    })

    it('removes item when quantity set to 0', () => {
      useCart.getState().addItem(sampleItem)
      useCart.getState().updateQuantity('prod-1', 0)
      expect(useCart.getState().items).toHaveLength(0)
    })

    it('removes item when quantity set to negative', () => {
      useCart.getState().addItem(sampleItem)
      useCart.getState().updateQuantity('prod-1', -1)
      expect(useCart.getState().items).toHaveLength(0)
    })
  })

  describe('clearCart', () => {
    it('empties all items', () => {
      useCart.getState().addItem(sampleItem)
      useCart.getState().addItem(anotherItem)
      useCart.getState().clearCart()
      expect(useCart.getState().items).toHaveLength(0)
    })
  })

  describe('total', () => {
    it('calculates sum of price * quantity', () => {
      useCart.getState().addItem(sampleItem) // 29.99 * 1
      useCart.getState().addItem(anotherItem) // 49.99 * 2
      expect(useCart.getState().total()).toBeCloseTo(129.97)
    })

    it('returns 0 for empty cart', () => {
      expect(useCart.getState().total()).toBe(0)
    })
  })

  describe('count', () => {
    it('returns sum of quantities', () => {
      useCart.getState().addItem(sampleItem) // qty 1
      useCart.getState().addItem(anotherItem) // qty 2
      expect(useCart.getState().count()).toBe(3)
    })

    it('returns 0 for empty cart', () => {
      expect(useCart.getState().count()).toBe(0)
    })
  })
})
