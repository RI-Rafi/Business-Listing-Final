import { useState, useEffect } from 'react';
import { cartAPI } from '../lib/api';

function Cart() {
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
            alert('Cart updated!');
        } catch (error) {
            alert('Error updating cart');
        }
    };

    const deleteCartItem = async (itemId) => {
        if (!window.confirm('Remove this item from cart?')) return;
        try {
            await cartAPI.deleteCartItem(itemId);
            fetchCart();
        } catch (error) {
            alert('Error deleting item');
        }
    };

    const checkout = async () => {
        try {
            await cartAPI.checkout();
            alert('✅ Booking created! Service providers will contact you soon.');
            setCart({ items: [], totalAmount: 0 });
        } catch (error) {
            alert('Error during checkout: ' + error.message);
        }
    };

    if (loading) return <div className="container mx-auto px-4 py-12">Loading cart...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">🛒 My Shopping Cart</h1>

            {cart.items.length === 0 ? (
                <div className="bg-white p-12 rounded-lg shadow-md text-center">
                    <p className="text-2xl text-gray-600 mb-4">Your cart is empty</p>
                    <p className="text-gray-500">Browse services and add them to your cart!</p>
                    <a
                        href="/listings"
                        className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Browse Services
                    </a>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {cart.items.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {item.serviceName}
                                        </h3>
                                        <p className="text-gray-600">{item.listing?.name || 'Service'}</p>
                                        <p className="text-blue-600 font-bold mt-2">
                                            ${item.price} × {item.quantity}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => deleteCartItem(item._id)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>

                                {editingItem === item._id ? (
                                    <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Date</label>
                                            <input
                                                type="date"
                                                defaultValue={item.scheduledDate ? new Date(item.scheduledDate).toISOString().split('T')[0] : ''}
                                                id={`date-${item._id}`}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Time</label>
                                            <input
                                                type="time"
                                                defaultValue={item.scheduledTime || ''}
                                                id={`time-${item._id}`}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Quantity</label>
                                            <input
                                                type="number"
                                                min="1"
                                                defaultValue={item.quantity}
                                                id={`qty-${item._id}`}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium mb-2">Notes</label>
                                            <textarea
                                                defaultValue={item.notes || ''}
                                                rows="2"
                                                id={`notes-${item._id}`}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>

                                        <div className="col-span-2 flex gap-2">
                                            <button
                                                onClick={() => {
                                                    updateCartItem(item._id, {
                                                        scheduledDate: document.getElementById(`date-${item._id}`).value,
                                                        scheduledTime: document.getElementById(`time-${item._id}`).value,
                                                        quantity: document.getElementById(`qty-${item._id}`).value,
                                                        notes: document.getElementById(`notes-${item._id}`).value,
                                                    });
                                                }}
                                                className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setEditingItem(null)}
                                                className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm"><strong>Date:</strong> {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'Not set'}</p>
                                        <p className="text-sm"><strong>Time:</strong> {item.scheduledTime || 'Not set'}</p>
                                        <p className="text-sm"><strong>Quantity:</strong> {item.quantity}</p>
                                        {item.notes && <p className="text-sm"><strong>Notes:</strong> {item.notes}</p>}

                                        <button
                                            onClick={() => setEditingItem(item._id)}
                                            className="mt-3 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                        >
                                            ✏️ Edit Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 bg-blue-50 p-6 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-gray-800">Total:</span>
                            <span className="text-3xl font-bold text-blue-600">${cart.totalAmount}</span>
                        </div>
                        <button
                            onClick={checkout}
                            className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-semibold"
                        >
                            ✅ Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
