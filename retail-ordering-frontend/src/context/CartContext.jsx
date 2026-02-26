// ─── CartContext — integrated with retail-ordering backend ─────────────────
// Cart is pure React state (no backend cart endpoints).
// checkout(deliveryAddress) posts one order per item with the delivery address.
// ───────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useCallback } from 'react'
import { ordersAPI } from '../services/api'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading] = useState(false)

  const addToCart = useCallback((product, quantity = 1) => {
  // If somehow only an id was passed, bail out
  if (!product || typeof product !== 'object') {
    console.error('addToCart expects a product object, got:', product)
    return
  }
  setCart(prev => {
    const existing = prev.find(i => i.id === product.id)
    if (existing) {
      return prev.map(i =>
        i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
      )
    }
    return [...prev, { ...product, quantity }]
  })
}, [])

  const updateQty = useCallback((itemId, quantity) => {
    if (quantity < 1) return
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i))
  }, [])

  const removeItem = useCallback((itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  /**
   * Checkout — posts one order per cart item, all to the same deliveryAddress.
   * @param {string} deliveryAddress  - required, from the cart address input
   * @returns {Array} array of Order objects returned by backend
   */
  const checkout = useCallback(async (deliveryAddress) => {
    if (cart.length === 0) throw new Error('Cart is empty')
    if (!deliveryAddress?.trim()) throw new Error('Delivery address is required')

    const results = []
    for (const item of cart) {
      const res = await ordersAPI.place(item.id, item.quantity, deliveryAddress.trim())
      results.push(res.data)
    }
    setCart([])
    return results
  }, [cart])

  const itemCount = cart.reduce((sum, i) => sum + (i.quantity ?? 1), 0)
  const totalAmount = cart.reduce((sum, i) => sum + (i.price ?? 0) * (i.quantity ?? 1), 0)

  return (
    <CartContext.Provider value={{
      cart, loading,
      addToCart, updateQty, removeItem, clearCart, checkout,
      itemCount, totalAmount,
      fetchCart: () => {},
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
