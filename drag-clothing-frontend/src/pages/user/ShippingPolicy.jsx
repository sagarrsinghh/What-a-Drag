import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, ShieldCheck } from 'lucide-react';
import Footer from '../../components/Footer';

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col justify-between">
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-12 border-b border-gray-200 pb-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9B4819]">
            <Truck size={16} />
            <span>Fast Logistics</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Shipping & Delivery Policy<span className="text-[#9B4819]">.</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Pan-India delivery across 19,000+ PIN codes with live tracking
          </p>
        </motion.div>

        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              1. Delivery Timelines
            </h2>
            <p>
              We process and dispatch all orders within <strong>24 to 48 hours</strong> of order confirmation. Expected delivery timelines are:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-1">
                  <Clock size={15} className="text-[#9B4819]" />
                  <span>Metro Cities</span>
                </div>
                <p className="text-xs text-gray-500">2 to 4 business days (Delhi, Mumbai, Bengaluru, Jaipur, etc.)</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#1A1A1A] mb-1">
                  <MapPin size={15} className="text-[#9B4819]" />
                  <span>Rest of India</span>
                </div>
                <p className="text-xs text-gray-500">4 to 7 business days depending on location.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              2. Shipping Charges
            </h2>
            <p>
              We are pleased to offer <strong>FREE Shipping</strong> on all prepaid orders (UPI, Cards, Netbanking) and standard Cash on Delivery orders nationwide. No hidden handling or delivery surcharges are added at checkout.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              3. Order Tracking
            </h2>
            <p>
              Once your package is handed over to our logistics partners (BlueDart, Delhivery, XpressBees, DTDC), an Air Waybill (AWB) number and live tracking link will be updated in your <strong>Profile &gt; Orders</strong> section and sent via SMS/Email.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              4. Non-Delivery or Delayed Shipments
            </h2>
            <p>
              If a shipment cannot be delivered due to an incorrect address or customer unavailability, our courier partner will attempt delivery up to 3 times before returning the parcel to our Jaipur hub. You can reach out to our team anytime to request re-attempt or address correction.
            </p>
          </section>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#25D366]" />
              <span>Dispatch Center</span>
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              DRAG Clothing Logistics Hub, Karolan ka Barh, Jagatpura, Jaipur, Rajasthan - 303905. Contact: <strong className="text-[#1A1A1A]">+91 7426977723</strong>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
