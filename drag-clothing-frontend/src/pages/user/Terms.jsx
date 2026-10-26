import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import Footer from '../../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col justify-between">
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-12 border-b border-gray-200 pb-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9B4819]">
            <FileText size={16} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Terms of Service<span className="text-[#9B4819]">.</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Last Updated: October 2026 | DRAG Clothing Official Operations
          </p>
        </motion.div>

        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or purchasing from <strong>DRAG Clothing</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), you agree to be bound by these Terms of Service and all applicable Indian laws and regulations. If you do not agree with any part of these terms, please do not use our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              2. Products & Pricing
            </h2>
            <p>
              All products listed on DRAG Clothing are subject to availability. We reserve the right to modify prices, discontinue items, or correct typographical errors at any time without prior notice. All prices are displayed in Indian Rupees (INR) and are inclusive of applicable GST unless explicitly stated otherwise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              3. Orders & Payment Processing
            </h2>
            <p>
              We accept payments via <strong>Razorpay</strong>, Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm, BHIM), Netbanking, and Cash on Delivery (COD). By submitting payment information, you warrant that you are authorized to use the chosen payment method. Orders are confirmed once payment authorization is verified by our gateway partners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              4. User Accounts & Security
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. Any activity conducted under your account remains your sole responsibility. Notify us immediately at <span className="font-bold text-[#1A1A1A]">sagarrsinghh11@gmail.com</span> if you suspect unauthorized access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              5. Intellectual Property
            </h2>
            <p>
              All content, brand identity, apparel designs, graphics, visual media, and code on DRAG Clothing are the exclusive intellectual property of DRAG Clothing and are protected by Indian copyright and trademark laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              6. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms shall be governed and interpreted under the laws of the Republic of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in Jaipur, Rajasthan.
            </p>
          </section>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#1A1A1A] mb-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#25D366]" />
              <span>Questions Regarding Terms?</span>
            </h3>
            <p className="text-xs text-gray-500">
              For any legal or operational inquiries, contact our grievance team at <strong className="text-[#1A1A1A]">sagarrsinghh11@gmail.com</strong> or call <strong className="text-[#1A1A1A]">+91 7426977723</strong>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
