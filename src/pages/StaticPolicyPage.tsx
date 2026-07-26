import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../store/useProductStore';
import { FileText, ArrowLeft, Mail, Phone } from 'lucide-react';

export const StaticPolicyPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const { cms } = useProductStore();

  const actualEmail = 'snehakrishnamurthy25@gmail.com';
  const actualPhone = '9036767664';

  let title = 'POLICY & COMPLIANCE';
  let content = cms.privacyPolicy;

  if (type === 'privacy') {
    title = 'PRIVACY POLICY';
    content = cms.privacyPolicy;
  } else if (type === 'shipping') {
    title = 'SHIPPING & DELIVERY POLICY';
    content = cms.shippingPolicy;
  } else if (type === 'refund') {
    title = 'RETURNS & REFUND POLICY';
    content = cms.refundPolicy;
  } else if (type === 'terms') {
    title = 'TERMS OF SERVICE';
    content = cms.termsAndConditions;
  } else if (type === 'warranty') {
    title = '1-YEAR COMPREHENSIVE WARRANTY POLICY';
    content = 'Pavitra Innovations provides a full 1-year replacement warranty on all electronics, motor modules, and smart AQI meters. If any part experiences technical defects, we ship a free replacement module to your doorstep.';
  }

  return (
    <div className="bg-[#09090B] text-white min-h-screen py-16 font-inter">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#D7FF2F] mb-8">
          <ArrowLeft className="w-4 h-4" /> RETURN TO HOME
        </Link>

        <div className="bg-[#111111] border border-[#27272A] rounded-3xl p-8 sm:p-12 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#27272A] pb-4">
            <FileText className="w-6 h-6 text-[#D7FF2F]" />
            <h1 className="font-syne font-black text-2xl sm:text-3xl text-white uppercase">{title}</h1>
          </div>

          <div className="text-sm text-gray-300 leading-relaxed space-y-4 font-medium">
            <p>{content}</p>

            <div className="pt-6 border-t border-[#27272A] space-y-2">
              <p className="font-bold text-white">FOR SUPPORT OR COMPLIANCE ENQUIRIES:</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-bold pt-1">
                <a href={`mailto:${actualEmail}`} className="flex items-center gap-2 text-[#D7FF2F] hover:underline">
                  <Mail className="w-4 h-4" /> {actualEmail}
                </a>
                <a href={`tel:${actualPhone}`} className="flex items-center gap-2 text-[#D7FF2F] hover:underline">
                  <Phone className="w-4 h-4" /> +91 {actualPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
