import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, Plus, Check, Phone, User, Home, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { addressService } from '../../api/services';

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Fetch saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await addressService.getAddresses();
        const data = res.data?.data?.data || res.data?.data || res.data || [];
        const addrs = Array.isArray(data) ? data : [];
        setSavedAddresses(addrs);
        if (addrs.length > 0) {
          setSelectedAddressId(addrs[0].id);
          setIsAddingNew(false);
        } else {
          // If no address saved, open the address form immediately
          setIsAddingNew(true);
        }
      } catch (err) {
        console.error('Failed to fetch addresses:', err);
        setIsAddingNew(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSaveAndContinue = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.addressLine1.trim() || !formData.city.trim() || !formData.state.trim() || !formData.postalCode.trim()) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await addressService.addAddress(formData);
      const newAddr = res.data?.data || res.data;
      navigate('/checkout/payment', {
        state: { addressId: newAddr?.id, addressData: newAddr || formData },
      });
    } catch (err) {
      console.error('Failed to save address:', err);
      const msg = err.response?.data?.message || 'Failed to save address. Please try again.';
      setErrorMsg(Array.isArray(msg) ? msg[0] : String(msg));
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinueWithSaved = () => {
    if (!selectedAddressId) {
      setErrorMsg('Please select an address or add a new one.');
      return;
    }
    const selected = savedAddresses.find(a => a.id === selectedAddressId);
    navigate('/checkout/payment', {
      state: { addressId: selectedAddressId, addressData: selected },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 px-6 bg-[#FAFAFA] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-[#9B4819]" size={36} />
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">Loading Shipping Details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 bg-[#FAFAFA] flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white p-8 md:p-12 border border-[#E5E5E5] shadow-sm rounded-3xl"
      >
        {/* Progress Header */}
        <div className="flex items-center gap-4 mb-8 text-[11px] font-black uppercase tracking-[0.25em]">
          <span className="text-[#9B4819] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#9B4819] text-white flex items-center justify-center text-[9px]">1</span>
            Shipping Details
          </span>
          <span className="w-8 h-px bg-[#E5E5E5]"></span>
          <span className="text-gray-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-[9px]">2</span>
            Payment
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0F0F0] mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-[#1A1A1A]">
              Delivery Address<span className="text-[#9B4819]">.</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium mt-1">
              Where should we deliver your order?
            </p>
          </div>

          {savedAddresses.length > 0 && (
            <button
              onClick={() => {
                setIsAddingNew(!isAddingNew);
                setErrorMsg('');
              }}
              className="px-5 py-2.5 bg-[#F5F5F5] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              {isAddingNew ? <X size={14} /> : <Plus size={14} />}
              <span>{isAddingNew ? 'View Saved' : 'Add New'}</span>
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold uppercase tracking-wide">
            {errorMsg}
          </div>
        )}

        {/* SECTION 1: SAVED ADDRESSES */}
        {!isAddingNew && savedAddresses.length > 0 && (
          <div className="space-y-4 mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Select Delivery Address
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-6 border rounded-2xl cursor-pointer transition-all relative ${
                    selectedAddressId === addr.id
                      ? 'border-[#1A1A1A] bg-[#FAFAFA] shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-[#1A1A1A] uppercase tracking-wide">
                        {addr.fullName || addr.name || 'Recipient'}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        {addr.addressLine1}
                      </p>
                      {addr.addressLine2 && (
                        <p className="text-xs text-gray-500 font-medium">{addr.addressLine2}</p>
                      )}
                      <p className="text-xs text-gray-600 font-bold">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>
                      {addr.phone && (
                        <p className="text-xs text-gray-700 font-bold pt-2 flex items-center gap-1.5">
                          <Phone size={11} className="text-[#9B4819]" /> {addr.phone}
                        </p>
                      )}
                    </div>
                    {selectedAddressId === addr.id && (
                      <div className="w-6 h-6 bg-[#1A1A1A] rounded-full flex items-center justify-center shrink-0">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleContinueWithSaved}
                className="w-full bg-[#1A1A1A] hover:bg-[#9B4819] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        )}

        {/* SECTION 2: NEW ADDRESS FORM */}
        {isAddingNew && (
          <form onSubmit={handleSaveAndContinue} className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#9B4819] mb-2">
              <MapPin size={14} />
              <span>Enter Shipping & Contact Details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sagar Singh"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#1A1A1A] focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                  Phone Number (For Delivery Updates) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#1A1A1A] focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                Flat / House No. / Building / Street *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Flat 402, Royal Residency, MG Road"
                value={formData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#1A1A1A] focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                Area / Sector / Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Near Metro Station"
                value={formData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#1A1A1A] focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#1A1A1A] focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delhi"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#1A1A1A] focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 110001"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#1A1A1A] focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#1A1A1A] focus:bg-white rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>
            </div>

            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1A1A1A] hover:bg-[#9B4819] text-white font-black py-4 rounded-2xl text-xs uppercase tracking-[0.3em] transition-all shadow-xl flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Deliver to This Address & Pay</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default CheckoutAddress;
