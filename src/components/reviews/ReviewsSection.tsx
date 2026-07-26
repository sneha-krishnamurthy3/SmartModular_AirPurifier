import React, { useState } from 'react';
import { useProductStore } from '../../store/useProductStore';
import { Star, CheckCircle2, Play, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview } = useProductStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newAuthor, setNewAuthor] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) {
      toast.error('Please complete author name and comment');
      return;
    }
    addReview({
      productId: 'prod-001',
      authorName: newAuthor,
      location: newLocation || 'India',
      rating: newRating,
      title: 'Great Modular Purifier',
      comment: newComment,
      verifiedPurchase: true,
    });
    toast.success('Thank you! Your review has been published.');
    setIsModalOpen(false);
    setNewAuthor('');
    setNewComment('');
  };

  return (
    <section className="bg-[#09090B] text-white py-16 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout matching reference design: Solid Black Outer Box with Left Purple Card & Right 3 Dark Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Purple Card (5 Cols) */}
          <div className="lg:col-span-5 bg-[#6C3EF4] p-8 sm:p-10 flex flex-col justify-between shadow-xl text-white">
            <div className="space-y-6">
              
              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black font-syne tracking-tighter uppercase leading-[0.95] text-white">
                TRUSTED BY THOUSANDS OF CLEAN AIR BELIEVERS.
              </h2>
              
              {/* Initial Letter Icons + Yellow 4.8 Rating Circle */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#D7FF2F] text-[#09090B] font-black font-syne text-base flex items-center justify-center border-2 border-[#6C3EF4] shadow-md">
                    R
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#09090B] text-white font-black font-syne text-base flex items-center justify-center border-2 border-[#6C3EF4] shadow-md">
                    A
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white text-[#09090B] font-black font-syne text-base flex items-center justify-center border-2 border-[#6C3EF4] shadow-md">
                    K
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full bg-[#D7FF2F] text-[#09090B] font-black text-lg flex items-center justify-center font-mono shadow-md">
                    4.8
                  </span>
                  <div className="text-xs leading-tight font-bold">
                    <div>average rating</div>
                    <div className="opacity-80 font-normal">from 2000+ customers</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Write Review Button */}
            <div className="pt-8">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#09090B] text-white hover:bg-black font-black text-xs py-3.5 px-4 uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <PlusCircle className="w-4 h-4 text-[#D7FF2F]" /> WRITE A REVIEW
              </button>
            </div>
          </div>

          {/* Right Column: 3 Dark Cards with Name Initial Letter Badges (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6 bg-[#09090B] p-2">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.slice(0, 3).map((rev) => {
                const initialLetter = rev.authorName ? rev.authorName.charAt(0).toUpperCase() : 'U';
                return (
                  <div 
                    key={rev.id}
                    className="bg-[#111111] border border-[#27272A] p-5 flex flex-col justify-between hover:border-gray-600 transition-all space-y-4 shadow-sm"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1 text-[#F59E0B]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-700'}`} 
                          />
                        ))}
                      </div>

                      <p className="text-xs text-white leading-relaxed font-semibold">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-[#27272A]">
                      {/* Name Initial Letter Circle Icon */}
                      <div className="w-9 h-9 rounded-full bg-[#D7FF2F] text-[#09090B] font-black font-syne text-sm flex items-center justify-center shrink-0 border border-[#D7FF2F]/40 shadow-sm">
                        {initialLetter}
                      </div>

                      <div>
                        <h5 className="text-xs font-black text-white flex items-center gap-1">
                          {rev.authorName}
                          {rev.verifiedPurchase && <CheckCircle2 className="w-3 h-3 text-[#D7FF2F]" />}
                        </h5>
                        <span className="text-[10px] text-gray-400 font-bold">{rev.location}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Bottom Link: READ MORE REVIEWS ON GOOGLE ▶ */}
            <div className="flex justify-center lg:justify-end pt-2">
              <a 
                href="https://google.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 text-xs font-black text-white hover:text-[#D7FF2F] tracking-widest uppercase transition-colors group"
              >
                <span>READ MORE REVIEWS ON GOOGLE</span>
                <div className="w-7 h-7 rounded-full border border-white flex items-center justify-center group-hover:border-[#D7FF2F]">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#27272A] max-w-md w-full p-6 space-y-4">
            <h3 className="font-syne font-bold text-xl text-white uppercase">Write a Customer Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-bold text-white">
              <div>
                <label className="block text-gray-400 mb-1">YOUR NAME</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] p-2.5 text-white"
                  placeholder="e.g. Rohit M."
                  required
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">LOCATION (CITY)</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] p-2.5 text-white"
                  placeholder="e.g. Bengaluru"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">RATING</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full bg-[#09090B] border border-[#27272A] p-2.5 text-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5) Very Good</option>
                  <option value={3}>⭐⭐⭐ (3/5) Average</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">YOUR REVIEW</label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  className="w-full bg-[#09090B] border border-[#27272A] p-2.5 text-white"
                  placeholder="Share your experience with Pavitra Air Module One..."
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-800 text-gray-300 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D7FF2F] text-[#09090B] font-black uppercase"
                >
                  SUBMIT REVIEW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
