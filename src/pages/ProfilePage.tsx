import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useOrderStore } from '../store/useOrderStore';
import { Package, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { getUserOrders } = useOrderStore();
  const navigate = useNavigate();

  const userOrders = getUserOrders(user?.uid || '');
  const initialLetter = user?.name 
    ? user.name.charAt(0).toUpperCase() 
    : user?.email 
    ? user.email.charAt(0).toUpperCase() 
    : 'U';

  return (
    <div className="bg-[#09090B] text-white min-h-screen py-12 font-inter">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#111111] border border-[#27272A] rounded-3xl p-6 sm:p-8 mb-8 flex flex-wrap items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            
            {/* Clean Initial Letter Badge — No Fake Person Images */}
            <div className="w-16 h-16 rounded-full bg-[#D7FF2F] text-[#09090B] font-black font-syne text-2xl flex items-center justify-center border-2 border-[#D7FF2F] shadow-lg shrink-0">
              {initialLetter}
            </div>

            <div>
              <h1 className="font-syne font-black text-2xl text-white uppercase tracking-tight">{user?.name}</h1>
              <p className="text-xs text-gray-400 font-medium">{user?.email}</p>
              <span className="text-[10px] font-mono font-bold text-[#D7FF2F] uppercase bg-[#D7FF2F]/10 border border-[#D7FF2F]/30 px-2 py-0.5 rounded mt-1 inline-block">
                {user?.role.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role !== 'customer' && (
              <Link to="/admin" className="bg-[#6C3EF4] text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#5b32d6] transition-colors">
                <ShieldCheck className="w-4 h-4 text-[#D7FF2F]" /> ADMIN CMS
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="bg-[#09090B] border border-[#27272A] text-gray-300 hover:text-red-400 hover:border-red-500/50 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> LOG OUT
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-syne font-black text-xl text-white uppercase flex items-center gap-2">
            <Package className="w-5 h-5 text-[#D7FF2F]" /> YOUR ORDER HISTORY ({userOrders.length})
          </h3>

          {userOrders.length === 0 ? (
            <div className="bg-[#111111] border border-[#27272A] rounded-2xl p-8 text-center text-xs text-gray-400 font-medium">
              You haven't placed any orders yet.
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-[#111111] border border-[#27272A] rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-[#D7FF2F]">ORDER #{order.id}</span>
                    <div className="text-xs text-gray-400 font-medium">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')} • {order.items.length} item(s)
                    </div>
                    <div className="text-xs font-bold text-white font-mono">
                      Total: ₹{order.total.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-[#09090B] border border-[#27272A] px-3 py-1 rounded-full text-xs font-bold text-[#D7FF2F]">
                      {order.status}
                    </span>
                    <Link
                      to={`/order-tracking/${order.id}`}
                      className="bg-[#D7FF2F] text-[#09090B] font-black text-xs px-4 py-2 rounded-xl uppercase hover:bg-[#C2EB1B] transition-colors"
                    >
                      TRACK ORDER
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
