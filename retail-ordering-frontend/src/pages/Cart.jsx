// ─── Cart.jsx — with delivery address input ────────────────────────────────
// Address is collected here and passed to CartContext.checkout(address).
// Backend: POST /api/orders?menuId=&quantity=&deliveryAddress=
// ───────────────────────────────────────────────────────────────────────────
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

const FOOD_EMOJI = { Pizza: '🍕', Burger: '🍔', Cakes: '🎂', SoftDrink: '🥤', Bread: '🍞', Subway: '🥪' }
function foodIcon(category) {
  if (!category) return '🍽️'
  const key = Object.keys(FOOD_EMOJI).find(k => category.toLowerCase().includes(k.toLowerCase()))
  return key ? FOOD_EMOJI[key] : '🍽️'
}

function CartItemRow({ item, onUpdate, onRemove }) {
  const [updating, setUpdating] = useState(false)

  const handleQty = async (newQty) => {
    if (newQty < 1) return
    setUpdating(true)
    try { onUpdate(item.id, newQty) } finally { setUpdating(false) }
  }

  return (
    <div className="cart-item">
      <div className="cart-item-icon">{foodIcon(item.category)}</div>

      <div className="cart-item-info">
        <div className="cart-item-name">{item.name ?? 'Product'}</div>
        <div className="cart-item-meta">
          {item.brand && <span>{item.brand}</span>}
          {item.brand && item.category && <span> · </span>}
          {item.category && <span>{item.category}</span>}
        </div>
        <div className="cart-item-price" style={{ marginTop: 4 }}>
          ₨{((item.price ?? 0) * item.quantity).toFixed(2)}
          {item.quantity > 1 && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 6 }}>
              (₨{(item.price ?? 0).toFixed(2)} each)
            </span>
          )}
        </div>
      </div>

      <div className="qty-controls">
        <button className="qty-btn" onClick={() => handleQty(item.quantity - 1)} disabled={updating || item.quantity <= 1}>−</button>
        <span className="qty-value">{item.quantity}</span>
        <button className="qty-btn" onClick={() => handleQty(item.quantity + 1)} disabled={updating}>+</button>
      </div>

      <button className="btn btn-danger btn-sm btn-icon" onClick={() => onRemove(item.id)} title="Remove">
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  )
}

export default function Cart() {
  const { cart, updateQty, removeItem, clearCart, checkout, totalAmount } = useCart()
  const { user } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [placing, setPlacing] = useState(false)
  const [address, setAddress] = useState('')
  const [addressError, setAddressError] = useState('')

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return
    if (!address.trim()) {
      setAddressError('Please enter a delivery address.')
      return
    }
    setAddressError('')
    setPlacing(true)
    try {
      await checkout(address)
      addToast('Order placed successfully! 🎉', 'success')
      navigate('/profile')
    } catch (err) {
      addToast(err.response?.data?.message ?? err.message ?? 'Failed to place order.', 'error')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="page-content page-wrapper">
      <div className="page-header">
        <h1 className="page-title">CART</h1>
        <p className="page-subtitle">{cart.length} item{cart.length !== 1 ? 's' : ''} in your cart</p>
      </div>

      {cart.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <div className="empty-title">Your Cart is Empty</div>
          <div className="empty-body">Head to the menu to browse items.</div>
          <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* Items list */}
          <div className="flex flex-col gap-12">
            {cart.map(item => (
              <CartItemRow key={item.id} item={item} onUpdate={updateQty} onRemove={removeItem} />
            ))}
          </div>

          {/* Order Summary + Address */}
          <div className="order-summary">
            <div className="summary-title">ORDER SUMMARY</div>

            {cart.map(item => (
              <div key={item.id} className="summary-line">
                <span className="truncate" style={{ maxWidth: 160 }}>{item.name} ×{item.quantity}</span>
                <span className="font-mono">₨{((item.price ?? 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="summary-total" style={{ marginTop: 16 }}>
              <span className="summary-total-label">Total</span>
              <span className="summary-total-amount">₨{totalAmount.toFixed(2)}</span>
            </div>

            {/* ── Delivery Address ── */}
            <div className="form-group" style={{ marginTop: 24 }}>
              <label className="form-label">
                📍 Delivery Address <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Enter your full delivery address…"
                value={address}
                onChange={e => { setAddress(e.target.value); setAddressError('') }}
                style={{ resize: 'vertical', minHeight: 72 }}
              />
              {addressError && (
                <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{addressError}</div>
              )}
            </div>

            {/* Show saved phone if available */}
            {user?.phone && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                📞 Contact: {user.phone}
              </div>
            )}

            <button
              className="btn btn-primary btn-full btn-lg"
              style={{ marginTop: 8 }}
              onClick={handlePlaceOrder}
              disabled={placing}
            >
              {placing ? 'Placing Orders…' : '⚡ Place Order'}
            </button>

            <button className="btn btn-ghost btn-full btn-sm" style={{ marginTop: 10 }} onClick={clearCart}>
              🗑 Clear Cart
            </button>

            <Link to="/menu" className="btn btn-ghost btn-full btn-sm" style={{ marginTop: 6 }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
