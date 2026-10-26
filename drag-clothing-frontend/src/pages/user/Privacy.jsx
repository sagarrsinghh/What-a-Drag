import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye } from 'lucide-react';
import Footer from '../../components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] flex flex-col justify-between">
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mb-12 border-b border-gray-200 pb-8"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#9B4819]">
            <Lock size={16} />
            <span>Data Protection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Privacy Policy<span className="text-[#9B4819]">.</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            Effective Date: October 2026 | DRAG Clothing Privacy Standards
          </p>
        </motion.div>

        <div className="space-y-10 text-sm leading-relaxed text-gray-700">
          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              1. Information We Collect
            </h2>
            <p>
              When you browse or place an order on DRAG Clothing, we collect the necessary personal information provided by you, including your name, email address, phone number, shipping address, and order transaction history.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              2. How We Use Your Information
            </h2>
            <p>
              The information we collect is strictly used to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-gray-600">
              <li>Process, fulfill, and deliver your apparel orders.</li>
              <li>Communicate order status, tracking updates, and delivery confirmations.</li>
              <li>Process secure payments via RBI-authorized payment aggregators (Razorpay).</li>
              <li>Prevent fraud and ensure platform integrity and compliance with Indian laws.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              3. Payment Security & Data Handling
            </h2>
            <p>
              We prioritize your financial security. DRAG Clothing <strong>does not store or retain</strong> your credit card numbers, CVVs, UPI PINs, or netbanking passwords on our servers. All financial transactions are securely tokenized and handled directly by <strong>Razorpay Payment Solutions</strong> using industry-standard 256-bit SSL encryption adhering to PCI-DSS Level 1 compliance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              4. Third-Party Disclosures
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. We share data only with verified logistics partners (couriers for delivery) and payment gateways solely for order completion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              5. Cookies & Analytics
            </h2>
            <p>
              We use functional cookies to remember your cart items, authentication session, and browsing preferences. You can configure your browser to disable cookies, though certain shopping features may require cookies to function properly.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-black uppercase tracking-wider text-[#1A1A1A]">
              6. Contacting the Grievance Officer
            </h2>
            <p>
              In accordance with the Information Technology Act 2000 and rules made thereunder, for any privacy concerns or data erasure requests, please contact:
            </p>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-xs space-y-1">
              <p><strong>Grievance Officer:</strong> Sagar Singh Tomar</p>
              <p><strong>Brand:</strong> DRAG Clothing</p>
              <p><strong>Email:</strong> sagarrsinghh11@gmail.com</p>
              <p><strong>Address:</strong> Karolan ka Barh, Jagatpura, Jaipur, Rajasthan - 303905</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
