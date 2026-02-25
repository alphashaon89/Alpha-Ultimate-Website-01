import { NavLink } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="relative border-t border-white/[0.05] overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-[#14f195]/15 to-transparent" />
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <NavLink to="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14f195] to-[#0ea572] flex items-center justify-center">
                <img src="/src/assets/alpha-logo.png" alt="Alpha" className="w-7 h-7 object-contain" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
              </div>
              <span className="text-xl font-black tracking-widest text-white" style={{fontFamily:'Syne,sans-serif'}}>ALPHA</span>
            </NavLink>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">{t('footer.tagline')}</p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Twitter, href: '#' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} className="w-9 h-9 rounded-xl glass flex items-center justify-center text-gray-500 hover:text-[#14f195] hover:border-[#14f195]/30 transition-all duration-300">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5" style={{fontFamily:'Syne,sans-serif'}}>{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {[
                { label: t('nav.services'), to: '/services' },
                { label: t('nav.pricing'), to: '/pricing' },
                { label: t('nav.gallery'), to: '/gallery' },
                { label: t('nav.book'), to: '/booking' },
                { label: t('nav.faq'), to: '/faq' },
              ].map((link, i) => (
                <li key={i}>
                  <NavLink to={link.to} className="text-gray-600 hover:text-[#14f195] text-sm transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-[#14f195]/0 group-hover:bg-[#14f195] transition-all" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5" style={{fontFamily:'Syne,sans-serif'}}>{t('footer.legal')}</h3>
            <ul className="space-y-3">
              {[t('footer.privacyPolicy'), t('footer.termsOfService'), t('footer.refundPolicy')].map((item, i) => (
                <li key={i}>
                  <NavLink to="/legal" className="text-gray-600 hover:text-[#14f195] text-sm transition-colors duration-300">{item}</NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-5" style={{fontFamily:'Syne,sans-serif'}}>{t('footer.contactUs')}</h3>
            <ul className="space-y-3">
              <li><a href="mailto:info@alpha-ultimate.com" className="text-gray-600 hover:text-[#14f195] text-sm transition-colors flex items-center gap-2"><Mail size={13} />info@alpha-ultimate.com</a></li>
              <li><a href="https://wa.me/966563906822" className="text-gray-600 hover:text-[#25D366] text-sm transition-colors flex items-center gap-2"><MessageCircle size={13} />+966 56 3906822</a></li>
              <li><a href="tel:+966578695494" className="text-gray-600 hover:text-[#14f195] text-sm transition-colors flex items-center gap-2"><Phone size={13} />+966 57 8695494</a></li>
              <li className="text-gray-600 text-sm flex items-center gap-2"><MapPin size={13} className="flex-shrink-0" />Riyadh, Saudi Arabia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.05] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-700 text-xs">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-gray-700 text-xs">{t('footer.developer')}</p>
          <NavLink to="/admin/login" className="text-gray-800 hover:text-gray-600 text-xs transition-colors">Admin</NavLink>
        </div>
      </div>
    </footer>
  );
}
