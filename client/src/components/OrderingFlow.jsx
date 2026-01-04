import { useState } from 'react';
import { X, MapPin, Truck, Bike } from 'lucide-react';
import useAuthStore from '../state/authStore';
import toast from 'react-hot-toast';

const OrderingFlow = ({ business, onClose }) => {
    const { user } = useAuthStore();
    const [step, setStep] = useState(1); // 1: Items, 2: Platform, 3: Address
    const [selectedItems, setSelectedItems] = useState([]);
    const [deliveryPlatform, setDeliveryPlatform] = useState(null);
    const [address, setAddress] = useState({
        street: user?.address?.street || '',
        area: user?.address?.area || '',
        city: user?.address?.city || 'Dhaka',
        phone: user?.phone || '',
        notes: ''
    });

    const hasMenu = business.menuItems && business.menuItems.length > 0;
    const hasServices = business.services && business.services.length > 0;

    const toggleItem = (item) => {
        const exists = selectedItems.find(si => si._id === item._id);
        if (exists) {
            setSelectedItems(selectedItems.filter(si => si._id !== item._id));
        } else {
            setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
        }
    };

    const updateQuantity = (itemId, delta) => {
        setSelectedItems(selectedItems.map(item =>
            item._id === itemId
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        ));
    };

    const getTotalPrice = () => {
        return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleProceed = () => {
        if (step === 1) {
            if (selectedItems.length === 0 && hasMenu) {
                toast.error('Please select at least one item');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            if (!deliveryPlatform) {
                toast.error('Please select a delivery platform');
                return;
            }
            setStep(3);
        } else if (step === 3) {
            handleFinalOrder();
        }
    };

    const handleFinalOrder = () => {
        // Build smart URL for delivery platform
        const businessSlug = business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const platformUrl = deliveryPlatform.url || `https://www.${deliveryPlatform.name.toLowerCase().replace(/\s/g, '')}.com.bd/restaurant/${businessSlug}`;

        // In a real app, we'd save the order to backend here
        toast.success(`Redirecting to ${deliveryPlatform.name}...`, { duration: 2000 });

        setTimeout(() => {
            window.open(platformUrl, '_blank');
            onClose();
        }, 1500);
    };

    const getAvailablePlatforms = () => {
        if (business.category === 'Food' && business.deliveryPlatforms?.length > 0) {
            return business.deliveryPlatforms;
        } else if (business.category === 'Electronics') {
            return [{ name: 'Pathao', url: 'https://pathao.com/' }];
        }
        return [];
    };

    const platforms = getAvailablePlatforms();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{business.name}</h2>
                        <p className="text-sm text-gray-600">
                            {step === 1 && 'Select Items'}
                            {step === 2 && 'Choose Delivery Platform'}
                            {step === 3 && 'Confirm Address'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Step 1: Select Items */}
                    {step === 1 && (
                        <div className="space-y-4">
                            {/* Menu Items */}
                            {hasMenu && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Menu</h3>
                                    <div className="grid gap-3">
                                        {business.menuItems.filter(item => item.available).map((item) => {
                                            const isSelected = selectedItems.find(si => si._id === item._id);
                                            return (
                                                <div
                                                    key={item._id}
                                                    className={`border rounded-lg p-4 cursor-pointer transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                    onClick={() => toggleItem(item)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                                            <p className="text-blue-600 font-semibold mt-2">{item.price} BDT</p>
                                                        </div>
                                                        {isSelected && (
                                                            <div className="flex items-center gap-2 ml-4">
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, -1); }}
                                                                    className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                                                                >-</button>
                                                                <span className="font-semibold w-8 text-center">{isSelected.quantity}</span>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, 1); }}
                                                                    className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center"
                                                                >+</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Services */}
                            {hasServices && !hasMenu && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Services</h3>
                                    <div className="grid gap-3">
                                        {business.services.filter(s => s.available).map((service) => (
                                            <div key={service._id} className="border rounded-lg p-4">
                                                <h4 className="font-semibold">{service.name}</h4>
                                                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                                <div className="flex justify-between mt-2">
                                                    <span className="text-blue-600 font-semibold">{service.price} BDT</span>
                                                    <span className="text-gray-500 text-sm">{service.duration}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Total */}
                            {selectedItems.length > 0 && (
                                <div className="border-t pt-4 mt-4">
                                    <div className="flex justify-between items-center text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-blue-600">{getTotalPrice()} BDT</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Choose Platform */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <p className="text-gray-600 mb-4">Select your preferred delivery platform:</p>
                            <div className="grid gap-3">
                                {platforms.map((platform) => (
                                    <div
                                        key={platform.name}
                                        onClick={() => setDeliveryPlatform(platform)}
                                        className={`border rounded-lg p-4 cursor-pointer transition flex items-center gap-4 ${deliveryPlatform?.name === platform.name ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {platform.name.includes('Pathao') ? <Bike className="w-8 h-8 text-blue-600" /> : <Truck className="w-8 h-8 text-green-600" />}
                                        <div>
                                            <h4 className="font-semibold text-lg">{platform.name}</h4>
                                            <p className="text-sm text-gray-600">Fast, reliable delivery</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Enter Address */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                <MapPin className="w-4 h-4" />
                                <span>Delivery address will be shared with {deliveryPlatform?.name}</span>
                            </div>
                            <div className="grid gap-4">
                                <input
                                    type="text"
                                    placeholder="Street/House Number"
                                    value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    className="border rounded-lg px-4 py-3"
                                />
                                <input
                                    type="text"
                                    placeholder="Area (e.g., Gulshan, Dhanmondi)"
                                    value={address.area}
                                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                                    className="border rounded-lg px-4 py-3"
                                />
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    className="border rounded-lg px-4 py-3"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={address.phone}
                                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                                    className="border rounded-lg px-4 py-3"
                                />
                                <textarea
                                    placeholder="Delivery instructions (optional)"
                                    value={address.notes}
                                    onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                                    className="border rounded-lg px-4 py-3"
                                    rows="3"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleProceed}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        {step === 3 ? `Order via ${deliveryPlatform?.name}` : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderingFlow;
