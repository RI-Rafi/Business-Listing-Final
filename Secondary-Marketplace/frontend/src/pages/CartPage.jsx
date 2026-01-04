import { useState, useEffect } from 'react';
import { cartAPI } from '../lib/api';
import '../styles/index.css';

function CartPage() {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await cartAPI.getCart();
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateCartItem = async (itemId, updates) => {
        try {
            await cartAPI.updateCartItem(itemId, updates);
            fetchCart();
            setEditingItem(null);
        } catch (error) {
            alert('Error updating cart item');
        }
    };

    const deleteCartItem = async (itemId) => {
        if (!confirm('Remove this item from cart?')) return;
        try {
            await cartAPI.deleteCartItem(itemId);
            fetchCart();
        } catch (error) {
            alert('Error deleting item');
        }
    };

    const checkout = async () => {
        try {
            const response = await cartAPI.checkout();
            alert('Booking created! Check your email for confirmation.');
            setCart({ items: [], totalAmount: 0 });
        } catch (error) {
            alert('Error during checkout: ' + error.message);
        }
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading cart...</div>;

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                🛒 My Shopping Cart
            </h1>

            {cart.items.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>Your cart is empty</p>
                    <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
                        Browse services and add them to your cart to book!
                    </p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cart.items.map((item) => (
                            <div key={item._id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                            {item.service.name}
                                        </h3>
                                        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
                                            {item.business?.name || 'Business'}
                                        </p>
                                        <p style={{ color: '#2563eb', fontWeight: 'bold', marginTop: '0.5rem' }}>
                                            ${item.service.price} × {item.quantity}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => deleteCartItem(item._id)}
                                        className="btn-danger"
                                        style={{ padding: '0.5rem 1rem' }}
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>

                                {editingItem === item._id ? (
                                    <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                defaultValue={new Date(item.scheduledDate).toISOString().split('T')[0]}
                                                id={`date-${item._id}`}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                                Time
                                            </label>
                                            <input
                                                type="time"
                                                defaultValue={item.scheduledTime}
                                                id={`time-${item._id}`}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                defaultValue={item.quantity}
                                                id={`qty-${item._id}`}
                                            />
                                        </div>

                                        <div style={{ gridColumn: 'span 2' }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                                Notes
                                            </label>
                                            <textarea
                                                defaultValue={item.notes}
                                                rows="2"
                                                id={`notes-${item._id}`}
                                            />
                                        </div>

                                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => {
                                                    updateCartItem(item._id, {
                                                        scheduledDate: document.getElementById(`date-${item._id}`).value,
                                                        scheduledTime: document.getElementById(`time-${item._id}`).value,
                                                        quantity: document.getElementById(`qty-${item._id}`).value,
                                                        notes: document.getElementById(`notes-${item._id}`).value,
                                                    });
                                                }}
                                                className="btn-primary"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setEditingItem(null)}
                                                className="btn-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
                                        <p><strong>Date:</strong> {new Date(item.scheduledDate).toLocaleDateString()}</p>
                                        <p><strong>Time:</strong> {item.scheduledTime}</p>
                                        <p><strong>Quantity:</strong> {item.quantity}</p>
                                        {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}

                                        <button
                                            onClick={() => setEditingItem(item._id)}
                                            className="btn-secondary"
                                            style={{ marginTop: '1rem' }}
                                        >
                                            ✏️ Edit Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="card" style={{ marginTop: '2rem', backgroundColor: '#eff6ff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: '600' }}>Total:</span>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>
                                ${cart.totalAmount}
                            </span>
                        </div>
                        <button
                            onClick={checkout}
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.125rem' }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
