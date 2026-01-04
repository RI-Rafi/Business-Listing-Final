// Delivery selection modal for food orders
import { useState } from 'react';

function DeliveryModal({ business, onClose, onDeliverySelect }) {
    const [selectedPlatform, setSelectedPlatform] = useState(null);

    const handleDeliver = () => {
        if (!selectedPlatform) return;
        const platform = business.deliveryPlatforms.find(p => p.name === selectedPlatform);
        if (platform) {
            window.open(platform.url, '_blank');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full m-4 animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    How would you like to enjoy {business.name}?
                </h2>

                {/* Dine-in or Delivery */}
                <div className="space-y-4 mb-6">
                    <button
                        onClick={() => {
                            // Just close modal, they can see address/phone on the page
                            onClose();
                        }}
                        className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🍽️</span>
                            <div className="text-left">
                                <div className="font-semibold">Dine In</div>
                                <div className="text-sm text-blue-100">Visit the restaurant</div>
                            </div>
                        </div>
                        <span className="text-xl">→</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">or get it delivered</span>
                        </div>
                    </div>
                </div>

                {/* Delivery Platforms */}
                {business.deliveryPlatforms && business.deliveryPlatforms.length > 0 ? (
                    <>
                        <p className="text-gray-700 mb-4 font-medium">Choose delivery platform:</p>
                        <div className="space-y-3 mb-6">
                            {business.deliveryPlatforms.map((platform) => (
                                <label
                                    key={platform.name}
                                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPlatform === platform.name
                                            ? 'border-blue-600 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="platform"
                                        value={platform.name}
                                        checked={selectedPlatform === platform.name}
                                        onChange={() => setSelectedPlatform(platform.name)}
                                        className="w-5 h-5 text-blue-600"
                                    />
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800">{platform.name}</div>
                                        <div className="text-sm text-gray-600">Order directly from their platform</div>
                                    </div>
                                    <span className="text-2xl">
                                        {platform.name === 'Foodpanda' ? '🐼' : platform.name === 'Uber Eats' ? '🚗' : '🛵'}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <button
                            onClick={handleDeliver}
                            disabled={!selectedPlatform}
                            className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${selectedPlatform
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {selectedPlatform ? `Order via ${selectedPlatform} 🚀` : 'Select a platform'}
                        </button>
                    </>
                ) : (
                    <p className="text-gray-600 text-center py-4">
                        No delivery partners available. Please dine in!
                    </p>
                )}

                <button
                    onClick={onClose}
                    className="w-full mt-4 px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default DeliveryModal;
