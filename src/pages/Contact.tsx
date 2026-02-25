import { motion } from 'framer-motion';
import { useState, ChangeEvent, FormEvent } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const contactItems = [
    { icon: Mail, label: 'Email Us', value: 'info@alpha-ultimate.com', href: 'mailto:info@alpha-ultimate.com', color: '#14f195' },
    { icon: MessageCircle, label: 'WhatsApp', value: '+966 56 3906822', href: 'https://wa.me/966563906822', color: '#25D366' },
    { icon: Phone, label: 'Phone', value: '+966 57 8695494', href: 'tel:+966578695494', color: '#9945ff' },
    { icon: MapPin, label: 'Location', value: 'Riyadh, Saudi Arabia', href: '#', color: '#ff6b35' },
  ];

  return (
    <div className="bg-[#070712] text-white pt-24 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-16">
          <div className="section-badge mb-4">Contact</div>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{fontFamily:'Syne,sans-serif'}}>
            Get In <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Have questions or need a custom quote? We're here to help 24/7.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Contact Cards */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="space-y-4">
            {contactItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <a key={i} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  className="spark-border p-5 flex items-center gap-4 hover:no-underline block transition-all"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                    <Icon size={22} style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-0.5">{item.label}</div>
                    <div className="text-white font-semibold text-sm">{item.value}</div>
                  </div>
                </a>
              );
            })}
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="spark-border p-8">
            {isSubmitted ? (
              <div className="text-center py-12">
                <CheckCircle size={56} className="mx-auto text-[#14f195] mb-4" />
                <h2 className="text-2xl font-black text-white mb-2" style={{fontFamily:'Syne,sans-serif'}}>Message Sent!</h2>
                <p className="text-gray-500">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black mb-6 text-white" style={{fontFamily:'Syne,sans-serif'}}>Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input type="text" name="name" required onChange={handleChange} className="input-field" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                      <input type="email" name="email" required onChange={handleChange} className="input-field" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                    <input type="text" name="subject" required onChange={handleChange} className="input-field" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea name="message" rows={5} required onChange={handleChange} className="input-field resize-none" placeholder="Tell us more..." />
                  </div>
                  <button type="submit" disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                    {isLoading ? <div className="neon-spinner !w-5 !h-5 !border-2" /> : <Send size={15} />}
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
