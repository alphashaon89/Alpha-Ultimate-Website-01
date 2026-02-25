import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Check, Zap } from 'lucide-react';
import PriceEstimator from '../components/PriceEstimator';
import { useTranslation } from 'react-i18next';

const TIERS = [
  { name: 'Standard', price: 'SAR 80+', color: '#14f195', features: ['Regular Maintenance', 'Dusting & Vacuuming', 'Kitchen & Bathrooms', 'Floor Mopping'], popular: false },
  { name: 'Deep Clean', price: 'SAR 150+', color: '#9945ff', features: ['Everything in Standard', 'Inside Appliances', 'Hard-to-Reach Areas', 'Detailed Scrubbing', 'Eco Products'], popular: true },
  { name: 'Move In/Out', price: 'SAR 250+', color: '#ff6b35', features: ['Full Interior Clean', 'Cabinet & Drawers', 'Appliance Interiors', 'Full Sanitization', 'Move-Ready Results'], popular: false },
];

const FAQ_DATA = [
  { q: 'How do you calculate the price?', a: 'We use a base rate by property type adjusted for service level, condition, and location.' },
  { q: 'Are there any hidden fees?', a: 'No. The price we quote is the price you pay. No surprises.' },
  { q: 'Do you offer discounts for recurring bookings?', a: 'Yes! Weekly and bi-weekly bookings get discounted rates.' },
  { q: 'What payment methods do you accept?', a: 'We accept cash, bank transfer, and all major credit cards.' },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="spark-border overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex justify-between items-center p-5 text-left hover:bg-white/[0.02] transition-colors">
        <span className="font-semibold text-gray-200 pr-4 text-sm">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={16} className={open ? 'text-[#14f195]' : 'text-gray-600'} />
        </motion.div>
      </button>
      <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <p className="px-5 pb-5 text-gray-500 text-sm border-t border-white/[0.05] pt-4">{a}</p>
      </motion.div>
    </div>
  );
};

export default function Pricing() {
  return (
    <div className="bg-[#070712] text-white pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="section-badge mb-4">Pricing</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            Transparent <span className="gradient-text">Pricing</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">No hidden fees. Use our estimator below for a personalized quote.</p>
        </motion.div>

        {/* Estimator */}
        <div className="mb-20">
          <PriceEstimator />
        </div>

        {/* Tiers */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-white" style={{fontFamily:'Syne,sans-serif'}}>Standard Pricing Tiers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {TIERS.map((tier, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`spark-border p-7 flex flex-col relative ${tier.popular ? 'ring-1' : ''}`}
                style={tier.popular ? { ringColor: tier.color } : {}}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="section-badge text-[10px] py-1 px-3" style={{ background: `${tier.color}15`, borderColor: `${tier.color}30`, color: tier.color }}>
                      <Zap size={10} />Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-black text-white mb-1" style={{fontFamily:'Syne,sans-serif'}}>{tier.name}</h3>
                  <div className="text-3xl font-black" style={{ color: tier.color }}>{tier.price}</div>
                </div>
                <ul className="space-y-3 flex-grow mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-400">
                      <Check size={14} style={{ color: tier.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="/booking" className="btn-primary text-center text-sm" style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}cc)` }}>
                  Book This Plan
                </a>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-8 text-white" style={{fontFamily:'Syne,sans-serif'}}>Pricing FAQ</h2>
          <div className="space-y-3">
            {FAQ_DATA.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
