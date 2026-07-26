import React, { useState } from 'react';
import { useProductStore } from '../store/useProductStore';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const SupportPage: React.FC = () => {
  const { cms } = useProductStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const actualEmail = 'snehakrishnamurthy25@gmail.com';
  const actualPhone = '9036767664';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please complete all required fields');
      return;
    }
    toast.success('Support ticket submitted! Our engineering team will respond within 4 hours.');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="bg-[#09090B] text-white min-h-screen py-16 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#111111] border border-gray-800 text-[#D7FF2F] text-xs font-black tracking-widest uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>24/7 SUPPORT CENTER</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-syne tracking-tighter uppercase text-white">
            WE ARE HERE TO <span className="text-[#D7FF2F]">HELP</span>
          </h1>
          <p className="text-gray-300 text-sm font-medium">
            Have questions about replacing a module, tracking an order, or bio-PLA recycling? Get in touch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#111111] border border-[#27272A] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h3 className="font-syne font-black text-xl text-white uppercase">CONTACT INFORMATION</h3>

              <div className="space-y-4 text-xs font-medium">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#D7FF2F] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block font-bold">EMAIL SUPPORT</span>
                    <a href={`mailto:${actualEmail}`} className="text-white hover:text-[#D7FF2F] font-bold">{actualEmail}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#D7FF2F] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block font-bold">TOLL FREE HELPLINE</span>
                    <a href={`tel:${actualPhone}`} className="text-white hover:text-[#D7FF2F] font-bold">+91 {actualPhone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D7FF2F] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block font-bold">HEADQUARTERS</span>
                    <span className="text-white font-bold">{cms.contactAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Form Column */}
          <div className="lg:col-span-7 bg-[#111111] border border-[#27272A] rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-syne font-black text-xl text-white uppercase mb-6">SUBMIT A SUPPORT TICKET</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-1">YOUR NAME *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D7FF2F]"
                    placeholder="Sneha K."
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D7FF2F]"
                    placeholder="snehakrishnamurthy25@gmail.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">SUBJECT</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D7FF2F]"
                  placeholder="e.g. Module replacement request"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">MESSAGE *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D7FF2F]"
                  placeholder="Describe your query..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <Send className="w-4 h-4" /> SUBMIT TICKET
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
