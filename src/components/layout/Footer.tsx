import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Successfully subscribed to Pavitra Innovations newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-[#F8F7F3] text-[#09090B] border-t border-gray-300 font-inter">
      <div className="max-w-7xl mx-auto px-6 py-14">
        
        {/* 5 Columns with thin vertical divider lines matching reference screenshot 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-0 lg:divide-x divide-gray-300 pb-12 border-b border-gray-300">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-4 lg:pr-6">
            <div className="flex flex-col">
              <span className="font-syne font-black text-2xl tracking-tighter leading-tight text-[#09090B] uppercase">
                PAVITRA
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#09090B] uppercase">
                INNOVATIONS
              </span>
            </div>
            <p className="text-xs text-gray-700 leading-relaxed font-semibold">
              We build smart, sustainable products that improve lives without costing the Earth.
            </p>

            {/* Social Media Buttons with 100% High-Contrast Visible Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-[#09090B] text-white flex items-center justify-center hover:bg-[#D7FF2F] hover:text-[#09090B] transition-colors shadow-sm"
              >
                <FaInstagram className="w-4 h-4 fill-current text-white hover:text-[#09090B]" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-[#09090B] text-white flex items-center justify-center hover:bg-[#D7FF2F] hover:text-[#09090B] transition-colors shadow-sm"
              >
                <FaFacebook className="w-4 h-4 fill-current text-white hover:text-[#09090B]" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="X Twitter"
                className="w-9 h-9 rounded-full bg-[#09090B] text-white flex items-center justify-center hover:bg-[#D7FF2F] hover:text-[#09090B] transition-colors shadow-sm"
              >
                <FaXTwitter className="w-4 h-4 fill-current text-white hover:text-[#09090B]" />
              </a>
              <a 
                href="https://youtu.be/U9x9-w-o8iM?si=UD7ywBn7y0J3wXZZ" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Pavitra Innovations YouTube Channel"
                className="w-9 h-9 rounded-full bg-[#09090B] text-white flex items-center justify-center hover:bg-[#D7FF2F] hover:text-[#09090B] transition-colors shadow-sm"
              >
                <FaYoutube className="w-4 h-4 fill-current text-white hover:text-[#09090B]" />
              </a>
            </div>
          </div>

          {/* Column 2: Newsletter Subscription matching reference screenshot 1 */}
          <div className="space-y-4 lg:px-6">
            <h4 className="text-xs font-black tracking-wider text-[#09090B] uppercase">
              NEWSLETTER
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed font-semibold">
              Get air quality tips, product updates and exclusive offers.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-bold text-green-800 bg-green-100 p-2.5 rounded border border-green-300">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-700" /> Subscribed to updates!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white border border-gray-400 px-3 py-2 text-xs text-[#09090B] focus:outline-none focus:border-[#09090B] rounded-none placeholder-gray-500 font-medium"
                  required
                />
                <button
                  type="submit"
                  className="w-auto bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs py-2 px-5 uppercase tracking-wider transition-colors rounded-none shadow-sm"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>

          {/* Column 3: Quick Links matching reference screenshot 1 */}
          <div className="space-y-3 lg:px-6">
            <h4 className="text-xs font-black tracking-wider text-[#09090B] uppercase">
              QUICK LINKS
            </h4>
            <ul className="space-y-2 text-xs font-bold text-gray-700">
              <li><Link to="/products" className="hover:text-[#09090B] hover:underline">Products</Link></li>
              <li><Link to="/how-it-works" className="hover:text-[#09090B] hover:underline">How It Works</Link></li>
              <li><Link to="/sustainability" className="hover:text-[#09090B] hover:underline">Sustainability</Link></li>
              <li><Link to="/about" className="hover:text-[#09090B] hover:underline">About Us</Link></li>
              <li><Link to="/support" className="hover:text-[#09090B] hover:underline">Support</Link></li>
              <li><Link to="/orders" className="hover:text-[#09090B] hover:underline">Track Order</Link></li>
            </ul>
          </div>

          {/* Column 4: Support matching reference screenshot 1 */}
          <div className="space-y-3 lg:px-6">
            <h4 className="text-xs font-black tracking-wider text-[#09090B] uppercase">
              SUPPORT
            </h4>
            <ul className="space-y-2 text-xs font-bold text-gray-700">
              <li><Link to="/faq" className="hover:text-[#09090B] hover:underline">FAQs</Link></li>
              <li><Link to="/policy/shipping" className="hover:text-[#09090B] hover:underline">Shipping & Delivery</Link></li>
              <li><Link to="/policy/refund" className="hover:text-[#09090B] hover:underline">Returns & Refunds</Link></li>
              <li><Link to="/policy/warranty" className="hover:text-[#09090B] hover:underline">Warranty</Link></li>
              <li><Link to="/contact" className="hover:text-[#09090B] hover:underline">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 5: Payment Badges matching reference screenshot 1 */}
          <div className="space-y-4 lg:pl-6">
            <h4 className="text-xs font-black tracking-wider text-[#09090B] uppercase">
              WE ACCEPT
            </h4>
            <div className="flex flex-col gap-3 pt-1">
              <div className="flex items-center gap-3">
                <span className="font-black italic text-blue-900 text-sm tracking-tighter">VISA</span>
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-red-600 opacity-90" />
                  <div className="w-4 h-4 rounded-full bg-amber-400 opacity-90" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-blue-800 text-xs tracking-tight">RuPay<span className="text-orange-500">▶</span></span>
                <span className="font-extrabold text-green-700 text-xs italic tracking-tighter">UPI▶</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-gray-800">
                <span className="w-3.5 h-3.5 border-2 border-[#09090B] flex items-center justify-center text-[8px]">🏛</span>
                <span>net banking</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar matching reference screenshot 1 */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-700 font-bold gap-4">
          <p>© 2026 Pavitra Innovations. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/policy/privacy" className="hover:text-[#09090B] hover:underline">Privacy Policy</Link>
            <Link to="/policy/terms" className="hover:text-[#09090B] hover:underline">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
