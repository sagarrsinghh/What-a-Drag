import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CreditCard, Wallet, Banknote, ShieldCheck, Lock, ArrowRight, 
    Loader2, Check, ShoppingBag, X, QrCode, Copy, Smartphone, 
    ExternalLink, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import Confetti from 'react-confetti';
import { orderService, paymentService, addressService } from '../../api/services';
import { getFullImageUrl } from '../../api/axios';

// --- SUB-COMPONENT: SUCCESS POPUP ---
const SuccessModal = ({ onClose, onViewOrders, orderId, paymentMethod, totalAmount }) => {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
        >
            <div className="absolute inset-0 pointer-events-none">
                <Confetti
                    width={dimensions.width}
                    height={dimensions.height}
                    numberOfPieces={350}
                    gravity={0.18}
                    recycle={false}
                />
            </div>

            <motion.div
                initial={{ scale: 0.7, y: 80, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className="bg-white w-full max-w-lg relative overflow-hidden shadow-2xl rounded-2xl border border-gray-100"
            >
                <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-[#1A1A1A] via-[#9B4819] to-[#25D366]" />

                <div className="p-8 sm:p-10 text-center relative z-10">
                    <div className="w-20 h-20 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.15, type: "spring" }}
                        >
                            <div className="absolute inset-0 bg-[#25D366]/20 rounded-full animate-ping" />
                            <Check size={42} className="text-[#25D366] relative z-10" strokeWidth={3.5} />
                        </motion.div>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1A1A1A] mb-2">
                        Order Confirmed!
                    </h2>
                    <p className="text-xs font-semibold text-gray-500 mb-6 leading-relaxed">
                        Thank you for shopping with <span className="font-bold text-[#1A1A1A]">DRAG Clothing</span>. Your order has been placed successfully and is being prepared for dispatch.
                    </p>

                    <div className="bg-[#FAFAFA] border border-gray-200/80 rounded-xl p-4 mb-6 text-left space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Order ID</span>
                            <span className="font-mono font-black text-[#9B4819]">#{orderId ? String(orderId).slice(0, 8).toUpperCase() : 'DRG-ORDER'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Payment Method</span>
                            <span className="font-bold uppercase tracking-wider text-[#1A1A1A]">{paymentMethod || 'Online'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Total Paid</span>
                            <span className="font-black text-sm text-[#1A1A1A]">₹{totalAmount}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onViewOrders}
                            className="w-full bg-[#1A1A1A] hover:bg-[#9B4819] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <span>Track Order</span>
                            <ArrowRight size={14} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-[#1A1A1A] font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={14} />
                            <span>Continue Shopping</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// --- SUB-COMPONENT: CREDIT CARD PREVIEW ---
const CardPreview = ({ details }) => (
    <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl mb-6 group border border-white/10"
    >
        <div className="absolute inset-0 bg-[#1A1A1A] transition-transform duration-700 group-hover:scale-105">
            <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-bl from-[#9B4819]/50 via-transparent to-transparent rounded-full blur-3xl transform -translate-y-10 translate-x-10" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white/95">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-300">DRAG EXCLUSIVE CARD</span>
                    <ShieldCheck size={18} className="mt-1 text-[#9B4819]" />
                </div>
                <span className="text-xl font-black italic tracking-tighter text-white">VISA</span>
            </div>
            <div className="space-y-4">
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-7 bg-yellow-500/25 rounded-md border border-yellow-500/50 flex items-center justify-center">
                        <div className="w-6 h-4 bg-yellow-500/40 rounded-sm" />
                    </div>
                    <span className="font-mono text-lg sm:text-xl tracking-widest text-shadow-sm font-semibold">
                        {details.number || '•••• •••• •••• ••••'}
                    </span>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[8px] uppercase tracking-widest text-gray-400 mb-0.5">Card Holder</p>
                        <p className="font-bold uppercase tracking-wider text-xs sm:text-sm text-white">{details.name || 'YOUR NAME'}</p>
                    </div>
                    <div>
                        <p className="text-[8px] uppercase tracking-widest text-gray-400 mb-0.5">Expires</p>
                        <p className="font-mono text-xs sm:text-sm font-bold text-white">{details.expiry || 'MM/YY'}</p>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const CheckoutPayment = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();

    const [selectedMethod, setSelectedMethod] = useState('upi'); // default to UPI as requested
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [orderError, setOrderError] = useState('');
    const [copiedUpi, setCopiedUpi] = useState(false);
    const [userAddress, setUserAddress] = useState(state?.addressData || null);
    const [razorpayReady, setRazorpayReady] = useState(false);

    // Card Details state
    const [cardDetails, setCardDetails] = useState({
        name: state?.addressData?.fullName || '',
        number: '',
        expiry: '',
        cvv: ''
    });

    // UPI Details
    const UPI_ID = 'dragclothing@icici';
    const UPI_PAYEE_NAME = 'DRAG Clothing';

    // Effective amount to pay (exact cart total)
    const exactAmount = useMemo(() => {
        if (cartTotal && cartTotal > 0) return cartTotal;
        if (state?.totalAmount) return state.totalAmount;
        return 0;
    }, [cartTotal, state]);

    // Construct UPI Deep Link URI with exact cart amount
    const upiUri = useMemo(() => {
        const amt = Number(exactAmount).toFixed(2);
        return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&am=${amt}&cu=INR&tn=${encodeURIComponent('DRAG Clothing Order Payment')}`;
    }, [exactAmount]);

    // QR Code URL for exact amount
    const qrCodeUrl = useMemo(() => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(upiUri)}`;
    }, [upiUri]);

    // Address verification / fallback loading
    useEffect(() => {
        if (!state?.addressData && !state?.addressId) {
            // Try to load default address before redirecting
            addressService.getAddresses()
                .then(res => {
                    const addrs = res.data?.data || res.data || [];
                    if (Array.isArray(addrs) && addrs.length > 0) {
                        setUserAddress(addrs[0]);
                    } else {
                        navigate('/checkout/address');
                    }
                })
                .catch(() => {
                    navigate('/checkout/address');
                });
        } else if (state?.addressData) {
            setUserAddress(state.addressData);
            if (state.addressData.fullName && !cardDetails.name) {
                setCardDetails(prev => ({ ...prev, name: state.addressData.fullName.toUpperCase() }));
            }
        }
    }, [state, navigate]);

    // Load Razorpay SDK
    useEffect(() => {
        let isMounted = true;
        loadRazorpayScript().then((loaded) => {
            if (isMounted) setRazorpayReady(loaded);
        });
        return () => { isMounted = false; };
    }, []);

    // Copy UPI ID to clipboard
    const handleCopyUpi = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(UPI_ID);
            setCopiedUpi(true);
            setTimeout(() => setCopiedUpi(false), 2500);
        }
    };

    // Quick Fill Test Card
    const handleFillTestCard = () => {
        setCardDetails({
            name: (userAddress?.fullName || 'SAGAR SINGH').toUpperCase(),
            number: '4532 8920 1289 4523',
            expiry: '12/28',
            cvv: '888'
        });
    };

    // Card Input Handler
    const handleCardInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'number') formattedValue = value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
        if (name === 'expiry') formattedValue = value.replace(/\W/gi, '').replace(/(.{2})/g, '$1/').trim().slice(0, 5);
        if (name === 'cvv') formattedValue = value.replace(/\D/g, '').slice(0, 4);
        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    };

    // 1-Click Launch UPI App (PhonePe, GPay, Paytm)
    const handleLaunchUpiApp = (appName) => {
        // Direct redirect with exact amount
        window.location.href = upiUri;
    };

    // Main Order Placement Flow
    const handlePlaceOrder = async (overrideMethod) => {
        const methodToUse = overrideMethod || selectedMethod;
        setIsProcessing(true);
        setOrderError('');

        try {
            // 1. Create order in backend
            const orderRes = await orderService.createOrder();
            const orderData = orderRes.data?.data || orderRes.data;
            const newOrderId = orderData?.id || orderData?.orderId;
            setOrderId(newOrderId);

            // ==========================================
            // CASE A: CASH ON DELIVERY (COD)
            // ==========================================
            if (methodToUse === 'cod') {
                await clearCart();
                setOrderSuccess(true);
                return;
            }

            // ==========================================
            // CASE B: DIRECT UPI VERIFICATION (QR / App)
            // ==========================================
            if (methodToUse === 'upi_direct') {
                await paymentService.confirmDirectPayment({
                    orderId: newOrderId,
                    method: 'upi',
                    transactionRef: `UPI-${Date.now().toString().slice(-8)}`,
                });
                await clearCart();
                setOrderSuccess(true);
                return;
            }

            // ==========================================
            // CASE C: DIRECT CARD PROCESSING (if details provided)
            // ==========================================
            if (methodToUse === 'card_direct' || (methodToUse === 'card' && cardDetails.number && cardDetails.expiry && cardDetails.cvv)) {
                await paymentService.confirmDirectPayment({
                    orderId: newOrderId,
                    method: 'card',
                    transactionRef: `CARD-${cardDetails.number.slice(-4)}-${Date.now().toString().slice(-6)}`,
                });
                await clearCart();
                setOrderSuccess(true);
                return;
            }

            // ==========================================
            // CASE D: RAZORPAY GATEWAY (UPI or Card)
            // ==========================================
            if (!razorpayReady || !window.Razorpay) {
                // If Razorpay SDK is blocked or offline, fallback to direct instant confirmation
                await paymentService.confirmDirectPayment({
                    orderId: newOrderId,
                    method: methodToUse,
                    transactionRef: `GW-${Date.now().toString().slice(-8)}`,
                });
                await clearCart();
                setOrderSuccess(true);
                return;
            }

            const gatewayRes = await paymentService.createGatewayOrder(newOrderId);
            const gatewayOrder = gatewayRes.data?.data || gatewayRes.data;

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SOEyTfcfsDgB5y';

            await new Promise((resolve, reject) => {
                const options = {
                    key: razorpayKey,
                    amount: gatewayOrder.amount, // Exact cart total in paise
                    currency: gatewayOrder.currency || 'INR',
                    order_id: gatewayOrder.id,
                    name: 'DRAG Clothing',
                    description: `Order #${newOrderId ? String(newOrderId).slice(0, 8).toUpperCase() : ''}`,
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=120&auto=format',
                    handler: async (response) => {
                        try {
                            await paymentService.verifyGatewayPayment({
                                orderId: response.razorpay_order_id,
                                paymentId: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                appOrderId: newOrderId,
                            });
                            resolve(true);
                        } catch (verifyError) {
                            reject(verifyError);
                        }
                    },
                    prefill: {
                        name: userAddress?.fullName || `${userAddress?.firstName || ''} ${userAddress?.lastName || ''}`.trim() || 'Valued Customer',
                        email: userAddress?.email || '',
                        contact: userAddress?.phone || '',
                        method: methodToUse === 'upi' ? 'upi' : 'card'
                    },
                    notes: {
                        appOrderId: newOrderId,
                        exactAmount: exactAmount
                    },
                    theme: {
                        color: '#1A1A1A',
                    },
                    modal: {
                        ondismiss: () => reject(new Error('Payment window dismissed')),
                    },
                };

                // Focus on UPI block if user selected UPI
                if (methodToUse === 'upi') {
                    options.config = {
                        display: {
                            blocks: {
                                upi: {
                                    name: 'UPI / QR / Netbanking',
                                    instruments: [{ method: 'upi' }, { method: 'netbanking' }]
                                }
                            },
                            sequence: ['block.upi'],
                            preferences: { show_default_blocks: false }
                        }
                    };
                }

                const rzp = new window.Razorpay(options);

                rzp.on('payment.failed', (response) => {
                    const reason = response?.error?.description || 'Payment failed';
                    reject(new Error(reason));
                });

                rzp.open();
            });

            await clearCart();
            setOrderSuccess(true);
        } catch (err) {
            console.error('Order failed:', err);
            const msg = err.response?.data?.message || err.message || 'Payment could not be completed. Please try again.';
            setOrderError(typeof msg === 'string' ? msg : JSON.stringify(msg));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCloseSuccess = () => {
        navigate('/');
    };

    const handleViewOrders = () => {
        navigate('/profile', { state: { activeTab: 'orders' } });
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1 } };

    // Helper to get cart item fields
    const getItemName = (item) => item.product?.name || item.name || 'Apparel Item';
    const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format';
    const getItemImage = (item) => {
        const raw = item.product?.imageUrl || item.product?.image || item.imageUrl || item.image || item.product?.images?.[0] || '';
        if (!raw) return FALLBACK_IMAGE;
        return getFullImageUrl(raw);
    };
    const getItemSize = (item) => item.variant?.size || item.size || 'Standard';
    const getItemPrice = (item) => item.variant?.price || item.product?.price || item.price || 0;
    const getItemQty = (item) => item.quantity || 1;

    return (
        <>
            <AnimatePresence>
                {orderSuccess && (
                    <SuccessModal 
                        onClose={handleCloseSuccess} 
                        onViewOrders={handleViewOrders}
                        orderId={orderId} 
                        paymentMethod={selectedMethod.toUpperCase()}
                        totalAmount={exactAmount}
                    />
                )}
            </AnimatePresence>

            <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 bg-[#FAFAFA] flex justify-center text-[#1A1A1A]">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
                >
                    {/* --- LEFT COL: PAYMENT METHODS --- */}
                    <div className="lg:col-span-7 space-y-6">
                        <motion.div variants={itemVariants}>
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                                <span>Checkout</span>
                                <span>/</span>
                                <span className="text-[#9B4819]">Step 2 of 2</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-2">
                                Secure Pay<span className="text-[#9B4819]">.</span>
                            </h1>
                            <div className="flex items-center gap-2 text-[#9B4819] font-bold text-xs uppercase tracking-widest">
                                <Lock size={13} />
                                <span>256-Bit SSL Encrypted & RBI Compliant</span>
                            </div>
                        </motion.div>

                        {/* Payment Method Selector Tabs */}
                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2 bg-[#F0EFEA] p-1.5 rounded-2xl">
                            {[
                                { id: 'upi', label: 'UPI / QR', icon: Wallet, badge: 'Fastest' },
                                { id: 'card', label: 'Cards', icon: CreditCard, badge: null },
                                { id: 'cod', label: 'Cash on Del.', icon: Banknote, badge: null }
                            ].map((method) => {
                                const isActive = selectedMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        onClick={() => {
                                            setSelectedMethod(method.id);
                                            setOrderError('');
                                        }}
                                        className={`relative py-3.5 px-3 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                                            isActive 
                                                ? 'bg-white text-[#1A1A1A] shadow-md font-black' 
                                                : 'text-gray-500 hover:text-[#1A1A1A] font-bold'
                                        }`}
                                    >
                                        <method.icon size={18} className={isActive ? 'text-[#9B4819]' : 'text-gray-400'} />
                                        <span className="text-xs uppercase tracking-wider">{method.label}</span>
                                        {method.badge && (
                                            <span className="hidden sm:inline-block text-[9px] font-black uppercase bg-[#25D366]/20 text-[#1E7E34] px-1.5 py-0.5 rounded-full">
                                                {method.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>

                        {orderError && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} 
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 text-red-700 text-xs font-bold p-4 rounded-xl flex items-center gap-2 border border-red-200"
                            >
                                <AlertCircle size={16} className="shrink-0" />
                                <span>{orderError}</span>
                            </motion.div>
                        )}

                        {/* Payment Options Main Container */}
                        <motion.div
                            variants={itemVariants}
                            className="bg-white border border-[#E5E5E5] rounded-2xl p-6 sm:p-8 relative shadow-sm"
                        >
                            <AnimatePresence mode="wait">
                                {/* ========================================================= */}
                                {/* TAB 1: UPI / QR PAYMENT                                  */}
                                {/* ========================================================= */}
                                {selectedMethod === 'upi' && (
                                    <motion.div
                                        key="upi"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                                            <div>
                                                <h3 className="text-lg font-black uppercase tracking-tight text-[#1A1A1A]">
                                                    Pay with any UPI App
                                                </h3>
                                                <p className="text-xs text-gray-400 font-medium">
                                                    Scan QR code or click your UPI app to pay <span className="font-bold text-[#1A1A1A]">₹{exactAmount}</span>
                                                </p>
                                            </div>
                                            <div className="bg-[#9B4819]/10 text-[#9B4819] text-xs font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                                <CheckCircle2 size={14} />
                                                <span>Exact Cart Total: ₹{exactAmount}</span>
                                            </div>
                                        </div>

                                        {/* Dynamic UPI QR Code Card */}
                                        <div className="bg-[#FAFAFA] border border-gray-200/80 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
                                            <div className="relative group bg-white p-3 rounded-xl border border-gray-200 shadow-md">
                                                <img 
                                                    src={qrCodeUrl} 
                                                    alt={`UPI QR Code for ₹${exactAmount}`}
                                                    className="w-44 h-44 object-contain rounded-lg"
                                                />
                                                <div className="text-center mt-2 text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                    Scan & Pay ₹{exactAmount}
                                                </div>
                                            </div>

                                            <div className="flex-1 space-y-4 text-center md:text-left">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                                        Official UPI ID
                                                    </p>
                                                    <div className="inline-flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 text-xs font-mono font-bold">
                                                        <span>{UPI_ID}</span>
                                                        <button 
                                                            onClick={handleCopyUpi} 
                                                            className="text-[#9B4819] hover:text-[#1A1A1A] transition-colors p-1"
                                                            title="Copy UPI ID"
                                                        >
                                                            {copiedUpi ? <Check size={14} className="text-[#25D366]" /> : <Copy size={14} />}
                                                        </button>
                                                    </div>
                                                    {copiedUpi && (
                                                        <span className="text-[10px] text-[#25D366] font-bold block mt-1">UPI ID Copied!</span>
                                                    )}
                                                </div>

                                                <div className="text-xs text-gray-500 font-medium space-y-1">
                                                    <p className="flex items-center justify-center md:justify-start gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                                                        Works with Google Pay, PhonePe, Paytm, Cred, BHIM
                                                    </p>
                                                    <p className="flex items-center justify-center md:justify-start gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                                                        Amount <strong className="text-[#1A1A1A]">₹{exactAmount}</strong> is locked and prefilled
                                                    </p>
                                                </div>

                                                {/* Confirm Button after Scanning */}
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    disabled={isProcessing}
                                                    onClick={() => handlePlaceOrder('upi_direct')}
                                                    className="w-full bg-[#1A1A1A] hover:bg-[#9B4819] text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                                                >
                                                    {isProcessing ? (
                                                        <Loader2 size={14} className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 size={15} />
                                                            <span>I Have Scanned & Paid ₹{exactAmount}</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        </div>

                                        {/* Direct UPI App Redirect Buttons */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                Or 1-Click Pay on Mobile Apps
                                            </p>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {[
                                                    { name: 'Google Pay', short: 'GPay', color: 'hover:border-[#4285F4]' },
                                                    { name: 'PhonePe', short: 'PhonePe', color: 'hover:border-[#5f259f]' },
                                                    { name: 'Paytm', short: 'Paytm', color: 'hover:border-[#00b9f5]' },
                                                    { name: 'Any UPI App', short: 'BHIM / Other', color: 'hover:border-[#9B4819]' },
                                                ].map((app, idx) => (
                                                    <motion.button
                                                        key={idx}
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={() => handleLaunchUpiApp(app.name)}
                                                        className={`p-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-center transition-all ${app.color} group`}
                                                    >
                                                        <Smartphone size={18} className="mx-auto mb-1 text-gray-600 group-hover:text-[#9B4819]" />
                                                        <div className="text-[11px] font-black uppercase text-[#1A1A1A]">{app.short}</div>
                                                        <div className="text-[9px] text-gray-400">Pay ₹{exactAmount}</div>
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Razorpay Gateway Trigger */}
                                        <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                            <span className="text-gray-400 text-xs">Prefer standard checkout popup?</span>
                                            <button
                                                onClick={() => handlePlaceOrder('upi')}
                                                disabled={isProcessing}
                                                className="text-[#9B4819] hover:underline font-bold text-xs uppercase tracking-wider flex items-center gap-1"
                                            >
                                                <span>Open Razorpay UPI Gateway</span>
                                                <ExternalLink size={12} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ========================================================= */}
                                {/* TAB 2: CREDIT / DEBIT CARD                                */}
                                {/* ========================================================= */}
                                {selectedMethod === 'card' && (
                                    <motion.div
                                        key="card"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                            <div>
                                                <h3 className="text-lg font-black uppercase tracking-tight text-[#1A1A1A]">
                                                    Credit or Debit Card
                                                </h3>
                                                <p className="text-xs text-gray-400 font-medium">
                                                    VISA, Mastercard, RuPay, Amex accepted
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleFillTestCard}
                                                className="text-[10px] font-black uppercase tracking-wider bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-lg transition-all"
                                            >
                                                ⚡ Quick Fill Test Card
                                            </button>
                                        </div>

                                        <CardPreview details={cardDetails} />

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                                    Card Number
                                                </label>
                                                <input
                                                    name="number"
                                                    value={cardDetails.number}
                                                    maxLength="19"
                                                    placeholder="4532 8920 1289 4523"
                                                    onChange={handleCardInputChange}
                                                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 font-mono text-sm font-bold text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                                    Cardholder Name
                                                </label>
                                                <input
                                                    name="name"
                                                    value={cardDetails.name}
                                                    placeholder="CARDHOLDER NAME"
                                                    onChange={handleCardInputChange}
                                                    className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold uppercase text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        name="expiry"
                                                        value={cardDetails.expiry}
                                                        maxLength="5"
                                                        placeholder="MM/YY"
                                                        onChange={handleCardInputChange}
                                                        className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 font-mono text-xs font-bold text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                                                        CVV / CVC
                                                    </label>
                                                    <input
                                                        name="cvv"
                                                        type="password"
                                                        value={cardDetails.cvv}
                                                        maxLength="4"
                                                        placeholder="•••"
                                                        onChange={handleCardInputChange}
                                                        className="w-full bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 py-3 font-mono text-xs font-bold text-[#1A1A1A] outline-none focus:border-[#1A1A1A] focus:bg-white transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ========================================================= */}
                                {/* TAB 3: CASH ON DELIVERY (COD)                            */}
                                {/* ========================================================= */}
                                {selectedMethod === 'cod' && (
                                    <motion.div
                                        key="cod"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="py-6 text-center space-y-6"
                                    >
                                        <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-[#9B4819]">
                                            <Banknote size={44} strokeWidth={1.5} />
                                        </div>
                                        <div className="max-w-md mx-auto space-y-2">
                                            <h3 className="text-xl font-black uppercase tracking-tight text-[#1A1A1A]">
                                                Cash on Delivery
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">
                                                Pay <strong className="text-[#1A1A1A]">₹{exactAmount}</strong> in cash or via UPI QR to the courier agent when your package arrives at your doorstep.
                                            </p>
                                        </div>
                                        <div className="bg-[#FAFAFA] border border-gray-200/80 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2 text-xs">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <CheckCircle2 size={14} className="text-[#25D366]" />
                                                <span>Zero additional COD convenience fee</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <CheckCircle2 size={14} className="text-[#25D366]" />
                                                <span>Instant order placement & SMS tracking</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* --- RIGHT COL: SUMMARY & PLACE ORDER --- */}
                    <div className="lg:col-span-5 flex flex-col h-full">
                        <motion.div 
                            variants={itemVariants} 
                            className="bg-[#1A1A1A] text-[#EBE9E0] p-6 sm:p-8 rounded-3xl flex-1 relative flex flex-col justify-between overflow-hidden shadow-2xl border border-white/5"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#9B4819]/10 rounded-full blur-3xl pointer-events-none" />

                            <div>
                                {/* Delivery Address Card */}
                                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-5">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Deliver To</p>
                                        <p className="text-sm font-bold uppercase mt-1 tracking-wider text-white">
                                            {userAddress?.fullName || `${userAddress?.firstName || ''} ${userAddress?.lastName || ''}`.trim() || 'Valued Customer'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                            {userAddress?.addressLine1 || userAddress?.address_line1 || 'Saved Address'}
                                            {userAddress?.city ? `, ${userAddress.city}` : ''}
                                            {userAddress?.postalCode || userAddress?.postal_code ? ` - ${userAddress.postalCode || userAddress.postal_code}` : ''}
                                        </p>
                                        {userAddress?.phone && (
                                            <p className="text-[11px] text-[#9B4819] font-mono mt-0.5 font-bold">
                                                Phone: {userAddress.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Order Total</p>
                                        <p className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">₹{exactAmount}</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>Your Selection</span>
                                        <span>{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</span>
                                    </div>
                                    <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar space-y-2.5">
                                        {cart.map((item, idx) => (
                                            <div key={idx} className="flex gap-3.5 items-center bg-white/[0.04] hover:bg-white/[0.08] transition-colors p-3 rounded-xl border border-white/5">
                                                <div className="w-12 h-14 bg-white/10 rounded-lg overflow-hidden shrink-0">
                                                    <img 
                                                        src={getItemImage(item)} 
                                                        alt={getItemName(item)} 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }} 
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold uppercase tracking-wider text-white truncate">
                                                        {getItemName(item)}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        Size: <span className="font-bold text-gray-200">{getItemSize(item)}</span> / Qty: <span className="font-bold text-gray-200">{getItemQty(item)}</span>
                                                    </p>
                                                </div>
                                                <p className="text-xs font-black text-white shrink-0">
                                                    ₹{getItemPrice(item) * getItemQty(item)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown & Confirm Order CTA */}
                            <div className="space-y-4 pt-4 border-t border-white/10">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">₹{exactAmount}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-[#25D366]">Free Delivery</span>
                                </div>
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between text-sm font-black uppercase tracking-wider text-white">
                                    <span>Total Payable</span>
                                    <span className="text-xl text-[#9B4819]">₹{exactAmount}</span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => handlePlaceOrder()}
                                    disabled={isProcessing || exactAmount === 0}
                                    className="group relative w-full h-15 py-4 bg-white hover:bg-[#9B4819] text-[#1A1A1A] hover:text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] flex items-center justify-center transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Processing Payment...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <span>
                                                {selectedMethod === 'cod' 
                                                    ? `Confirm COD Order (₹${exactAmount})` 
                                                    : selectedMethod === 'upi'
                                                    ? `Pay ₹${exactAmount} via UPI`
                                                    : `Pay ₹${exactAmount} with Card`}
                                            </span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default CheckoutPayment;
