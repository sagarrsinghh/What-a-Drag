import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, MapPin, LogOut,ArrowLeft,
  Plus, Edit2, Trash2, ChevronRight,
  Shield, Phone, Save, X, Loader2, AlertCircle, Camera, User, Truck, CheckCircle, Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate , useLocation} from 'react-router-dom';
import { addressService, orderService } from '../../api/services';
import api from '../../api/axios'; // Ensure this axios instance has the Interceptor for the Token

// --- ANIMATION CONFIG ---
const transition = { type: "spring", stiffness: 300, damping: 30 };
const fadeIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

// --- REUSABLE INPUT ---
const InputField = ({ label, value, onChange, type = "text", isEditing = false, disabled = false, icon: Icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value || ''} // Handle null/undefined
        onChange={onChange}
        disabled={!isEditing || disabled}
        className={`w-full rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none
          ${isEditing && !disabled
            ? 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-black focus:bg-white'
            : 'bg-transparent border border-transparent text-gray-600 cursor-default p-0'
          }
        `}
      />
      {Icon && isEditing && <Icon size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />}
    </div>
  </div>
);

// --- 1. PROFILE TAB (UPDATED) ---
const ProfileTab = ({ userData, refreshProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Initial State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // ✅ Update Form Data when API data arrives
  useEffect(() => {
    if (userData) {
      // Split "John Doe" into "John" and "Doe"
      const fullName = userData.name || '';
      const splitName = fullName.split(' ');
      const firstName = splitName[0] || '';
      const lastName = splitName.slice(1).join(' ') || '';

      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: userData.email || '',
        phone: userData.phone || '',
      });
    }
  }, [userData]);

  const handleSave = async () => {
    setLoading(true);
    setSaveError('');
    try {
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      
      // Update Profile API Call
      await api.put(`/customers/${userData.id}`, { 
        name,
        phone: formData.phone
      });
      
      setIsEditing(false);
      // Refresh the main profile data to show updates immediately
      if(refreshProfile) refreshProfile(); 
      
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setSaveError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your account details.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
          >
            <Edit2 size={14} /> Edit
          </button>
        )}
      </div>

      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <InputField label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} isEditing={isEditing} />
          <InputField label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} isEditing={isEditing} />
          <InputField label="Email Address" value={formData.email} isEditing={false} disabled={true} icon={Shield} />
          <InputField label="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} isEditing={isEditing} icon={Phone} />
        </div>

        {saveError && <p className="text-red-500 text-xs font-bold">{saveError}</p>}

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              className="flex gap-4 pt-4 border-t border-gray-100"
            >
              <button onClick={handleSave} disabled={loading} className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
              </button>
              <button onClick={() => { setIsEditing(false); }} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- ADDRESS INPUT ---
const AddressFormInput = ({ label, value, onChange, type = "text", required = false }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:border-black focus:ring-0 outline-none transition-all"
    />
  </div>
);

// --- 2. ADDRESS TAB ---
const AddressTab = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [addresses, setAddresses] = useState([]);

  const initialFormState = { 
    fullName: '', phone: '', addressLine1: '', addressLine2: '', 
    city: '', state: '', postalCode: '', country: 'India' 
  };
  const [formData, setFormData] = useState(initialFormState);

  const fetchAddresses = async () => {
    setFetchLoading(true);
    try {
      const res = await addressService.getAddresses();
      const data = res.data?.data?.data || res.data?.data || res.data || [];
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleAddNew = () => {
    setFormData(initialFormState);
    setErrorMsg("");
    setIsFormOpen(true);
  };

  const handleSaveAddress = async () => {
    setErrorMsg("");
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await addressService.addAddress(formData);
      setIsFormOpen(false);
      setFormData(initialFormState);
      await fetchAddresses();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save address';
      setErrorMsg(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await addressService.deleteAddress(id);
      await fetchAddresses();
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Address Book</h3>
          <p className="text-sm text-gray-500 mt-1">Manage shipping locations.</p>
        </div>
        {!isFormOpen && (
          <button onClick={handleAddNew} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/20">
            <Plus size={14} /> Add New
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="bg-white p-1 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">New Address</h4>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={16} /></button>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <AddressFormInput required label="Full Name" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                  <AddressFormInput required label="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} type="number" />
                </div>
                <AddressFormInput required label="Address Line 1" value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} />
                <AddressFormInput label="Address Line 2 (Optional)" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <AddressFormInput required label="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  <AddressFormInput required label="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
                  <AddressFormInput required label="Postal Code" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} type="number" />
                  <AddressFormInput required label="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                </div>
              </div>

              {errorMsg && <div className="mt-4 flex items-center gap-2 text-red-500 text-xs font-bold"><AlertCircle size={14} /> {errorMsg}</div>}

              <div className="mt-6 flex gap-3">
                <button onClick={handleSaveAddress} disabled={loading} className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                </button>
                <button onClick={() => setIsFormOpen(false)} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black">Cancel</button>
              </div>
            </div>
          </motion.div>
        ) : fetchLoading ? (
          <div key="loader" className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-300" /></div>
        ) : addresses.length === 0 ? (
          <div key="empty" className="py-16 text-center">
            <MapPin size={32} className="mx-auto text-gray-200 mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No addresses yet</p>
            <p className="text-xs text-gray-400 mt-2">Add your first shipping address to get started.</p>
          </div>
        ) : (
          <div key="list" className="grid md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <motion.div layout key={addr.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-2xl border transition-all relative group bg-white border-gray-200 hover:border-black/20 hover:shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{addr.fullName || addr.name || 'Address'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(addr.id)} className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  {addr.phone && <p className="font-medium text-gray-900 pt-2 flex items-center gap-2"><Phone size={12} /> {addr.phone}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 3. ORDERS TAB ---
// --- 3. ORDERS TAB (UPDATED WITH YOUR API) ---
const OrdersTab = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders');
      let fetchedOrders = [];
      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        fetchedOrders = res.data.data.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        fetchedOrders = res.data.data;
      } else if (Array.isArray(res.data)) {
        fetchedOrders = res.data;
      }
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrders([]);
    } finally { 
      setLoading(false); 
    }
  };

  const handleOpenTracking = async (order) => {
    setSelectedOrder(order);
    try {
      const res = await api.get('/orders/' + order.id);
      const fullOrder = res.data?.data || res.data || order;
      setSelectedOrder(fullOrder);
    } catch (err) {
      console.warn('Could not fetch full order details:', err);
    }
  };

  const getStatusColor = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'DELIVERED' || s === 'COMPLETED') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s === 'CANCELLED' || s === 'FAILED') return 'bg-red-100 text-red-800 border-red-200';
    if (s === 'PROCESSING' || s === 'IN_TRANSIT' || s === 'SHIPPED' || s === 'CONFIRMED') return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  const getTrackingSteps = (status) => {
    const s = (status || '').toLowerCase();
    const steps = [
      { key: 'placed', label: 'Order Placed', desc: 'Order received & verified' },
      { key: 'confirmed', label: 'Confirmed & Packed', desc: 'Prepared for dispatch' },
      { key: 'shipped', label: 'Shipped / In Transit', desc: 'Handed to courier partner' },
      { key: 'delivered', label: 'Delivered', desc: 'Package delivered safely' },
    ];

    let activeIndex = 0;
    if (s === 'confirmed' || s === 'processing') activeIndex = 1;
    else if (s === 'shipped' || s === 'in_transit' || s === 'out_for_delivery') activeIndex = 2;
    else if (s === 'delivered') activeIndex = 3;
    else if (s === 'cancelled') activeIndex = -1;

    return { steps, activeIndex };
  };

  return (
    <div>
      <div className="mb-8 border-b border-gray-100 pb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Order History</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Click on any order to track live delivery status.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#9B4819] w-8 h-8" />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center">
          <Package size={36} className="mx-auto text-gray-300 mb-4" />
          <p className="text-sm font-black text-gray-500 uppercase tracking-widest">No orders yet</p>
          <p className="text-xs text-gray-400 mt-2">When you place an order, live tracking will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleOpenTracking(order)}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-200 hover:border-black transition-all cursor-pointer group bg-white shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-100 group-hover:bg-[#9B4819]/10 transition-colors">
                  <Package size={22} className="text-gray-400 group-hover:text-[#9B4819] transition-colors" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-gray-900 tracking-wide">
                      #{order.id?.slice(0, 8).toUpperCase() || 'ORDER'}
                    </span>
                    <span className={'text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ' + getStatusColor(order.status)}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-bold">
                    Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-black uppercase text-gray-400 block tracking-widest">Total</span>
                  <span className="font-black text-gray-900 text-sm">₹{order.totalAmount || order.total || 0}</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#1A1A1A] group-hover:bg-[#9B4819] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow"
                >
                  <Truck size={12} />
                  <span>Track Delivery</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRACKING MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col"
            >
              <div className="p-6 bg-[#1A1A1A] text-white flex justify-between items-center relative">
                <div>
                  <span className="text-[10px] font-bold text-[#9B4819] uppercase tracking-[0.25em]">Live Delivery Tracking</span>
                  <h4 className="text-xl font-black uppercase tracking-tight">Order #{selectedOrder.id?.slice(0, 8).toUpperCase()}</h4>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Courier Partner</span>
                    <span className="text-sm font-black text-gray-900 flex items-center gap-1.5 mt-0.5">
                      <Truck size={15} className="text-[#9B4819]" />
                      {selectedOrder.courierName || 'DRAG Express Logistics'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">AWB / Tracking Number</span>
                    <span className="text-xs font-mono font-bold bg-white px-3 py-1 rounded-lg border border-gray-200 block mt-0.5 text-gray-800">
                      {selectedOrder.trackingNumber || ('DRG-IN-' + selectedOrder.id.slice(0, 8).toUpperCase())}
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <h5 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Delivery Timeline</h5>
                  {(() => {
                    const { steps, activeIndex } = getTrackingSteps(selectedOrder.status);
                    return (
                      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                        {steps.map((st, idx) => {
                          const isDone = activeIndex >= idx && activeIndex !== -1;
                          const isCurrent = activeIndex === idx;
                          return (
                            <div key={st.key} className="relative flex items-start gap-4">
                              <span
                                className={'absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 transition-all ' +
                                  (isDone ? 'bg-[#1A1A1A] border-[#1A1A1A]' : 'bg-white border-gray-300') +
                                  (isCurrent ? ' ring-4 ring-[#9B4819]/20' : '')}
                              />
                              <div>
                                <p className={'text-xs font-black uppercase tracking-wide ' + (isDone ? 'text-gray-900' : 'text-gray-400')}>
                                  {st.label}
                                </p>
                                <p className="text-[11px] text-gray-500">{st.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h5 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Order Details</h5>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-gray-500 font-bold">Total Amount</span>
                    <span className="font-black text-gray-900 text-sm">₹{selectedOrder.totalAmount || selectedOrder.total || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs py-1">
                    <span className="text-gray-500 font-bold">Payment Method</span>
                    <span className="font-bold text-gray-800 uppercase">Cash on Delivery / Online</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#9B4819] text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN PROFILE CARD LAYOUT ---
const Profile = () => {
  const { user, logout } = useAuth(); // Context user (might be stale)
  const navigate = useNavigate();
   const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');

useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // ✅ NEW: Local state for fresh user data
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // ✅ NEW: Fetch Fresh Data from /auth/me on Mount
  const fetchUserProfile = async () => {
    try {
      // Assuming route is /auth/me based on @Get('me') inside AuthController
      const res = await api.get('/auth/me'); 
      setProfileData(res.data);
    } catch (err) {
      console.error("Failed to load profile", err);
      // Fallback to context user if API fails
      setProfileData(user);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Wait for auth context or API load
  if (!user || loadingProfile) return <div className="min-h-screen bg-[#F2F2F2] flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  // Use profileData (from API) preferentially, fallback to user (from Context)
  const displayUser = profileData || user;

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-24 pb-20 px-4 md:px-8 font-sans flex justify-center items-start md:items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* --- LEFT SIDEBAR --- */}
        <aside className="w-full md:w-72 bg-gray-50/50 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
          {/* User Info */}


          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-6 left-6 p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-all z-10 text-gray-500 hover:text-black shadow-sm flex items-center justify-center"
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="p-8 border-b border-gray-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-white border-2 border-gray-200 p-1 mb-4 shadow-sm relative group cursor-pointer">
              <div className="w-full h-full rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold uppercase overflow-hidden">
                {displayUser.name ? displayUser.name[0] : "U"}
              </div>
              <div className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-gray-200 shadow-sm text-gray-600 group-hover:text-black transition-colors">
                <Camera size={14} />
              </div>
            </div>
            <h2 className="text-lg font-bold text-gray-900">{displayUser.name || 'User'}</h2>
            <p className="text-xs text-gray-500 font-medium mt-1">{displayUser.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id
                    ? 'bg-white text-black shadow-md shadow-gray-100 border border-gray-100'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
                  }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </aside>

        {/* --- RIGHT CONTENT --- */}
        <main className="flex-1 p-8 md:p-12 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full"
            >
              {activeTab === 'profile' && (
                <ProfileTab 
                   userData={displayUser} 
                   refreshProfile={fetchUserProfile} // Pass function to refresh data after edit
                />
              )}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'addresses' && <AddressTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
};

export default Profile;
