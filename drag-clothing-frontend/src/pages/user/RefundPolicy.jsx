import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import Footer from '../../components/Footer';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col justify-between">
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-12 border-b border-gray-200 pb-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9B4819]">
            <RotateCcw size={16} />
            <span>Customer Satisfaction</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Refund & Cancellation Policy<span className="text-[#9B4819]">.</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Clear, transparent return & refund guidelines for DRAG Clothing shoppers
          </p>
        </motion.div>

        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              1. 7-Day Hassle-Free Returns & Exchanges
            </h2>
            <p>
              We want you to love your DRAG apparel. If you are not completely satisfied with your purchase, you may initiate a return or exchange within <strong>7 days</strong> of delivery.
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs space-y-1.5 text-gray-600">
              <p className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#25D366]" />
                <span>Items must be unused, unwashed, and in original condition.</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#25D366]" />
                <span>All brand tags, labels, and original packaging must be intact.</span>
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              2. Cancellation Policy
            </h2>
            <p>
              You may cancel your order at any time before it has been dispatched from our fulfillment center. Once an order is cancelled, a full refund will be processed automatically to your original payment method. If the product has already been shipped, you can refuse delivery or initiate a return upon receipt.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              3. Refund Processing Timeline
            </h2>
            <p>
              Once your returned item is received and inspected at our warehouse:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-600">
              <li><strong>Prepaid Orders (UPI / Cards / Netbanking via Razorpay):</strong> The refund will be credited back to your original source account within <strong>5 to 7 business days</strong>.</li>
              <li><strong>Cash on Delivery (COD) Orders:</strong> The refund will be transferred directly to your verified Bank Account or UPI ID within <strong>3 to 5 business days</strong> after you provide your bank details.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              4. Damaged or Defective Goods
            </h2>
            <p>
              In the rare event that an item arrives damaged or incorrect, please email photos to <strong>sagarrsinghh11@gmail.com</strong> or WhatsApp us at <strong>+91 7426977723</strong> within 48 hours of delivery. We will arrange a free immediate replacement or full refund.
            </p>
          </section>

          <div className="bg-[#FAFAFA] border border-[#9B4819]/30 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#9B4819] mb-2 flex items-center gap-2">
              <RefreshCw size={16} />
              <span>How to Initiate a Return?</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Visit your <strong>Profile &gt; Orders</strong> page on DRAG Clothing, select your order and click <em>Request Return</em>, or directly email us at <strong className="text-[#1A1A1A]">sagarrsinghh11@gmail.com</strong> with your Order ID.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
