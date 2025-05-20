import React, { useState } from 'react';
import './Cart.css'; 

const Cart = ({ isOpen, onClose }) => {
  // Sample cart items (you can replace this with real data later)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 10, quantity: 2 },
    { id: 2, name: 'Product 2', price: 15, quantity: 1 },
  ]);

  if (!isOpen) return null; // Don't render if cart is closed

  return (
    <div className="cart-overlay">
      <div className="cart-content">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity} = $
                {item.price * item.quantity}
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Cart;