import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { getMissingFirebaseKeys } from '../services/firebase';
import { 
  registerUser, 
  loginUser, 
  resendVerificationEmail, 
  refreshEmailVerificationStatus, 
  sendPasswordReset,
  changeAndVerifyEmail,
  parseFirebaseError,
  logoutUser
} from '../services/authService';
import { Mail, Lock, User, ArrowRight, AlertCircle, RefreshCw, Send, Edit3, CheckSquare, Square } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'login' | 'register' | 'admin' | 'reset' | 'unverified'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const missingFirebaseKeys = getMissingFirebaseKeys();

  // Auto-polling when on unverified tab
  useEffect(() => {
    let interval: any;
    if (tab === 'unverified') {
      interval = setInterval(async () => {
        try {
          const status = await refreshEmailVerificationStatus();
          if (status.isVerified) {
            toast.success('Email verified successfully! Logging you in...');
            login(email || 'snehakrishnamurthy25@gmail.com', 'customer', name);
            navigate('/profile');
          }
        } catch (err) {
          console.warn('[Auto-poll Notice]:', err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [tab, email, name, login, navigate]);

  // Handle Sign In (Customer/Admin)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!password) {
      toast.error('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (tab === 'admin') {
        const res = await loginUser(email, password, false);
        if (!res.success) {
          if (res.emailVerified === false) {
            setTab('unverified');
            toast.error('Your administrator email address has not been verified.');
          } else {
            toast.error(res.error || res.message || 'Admin login failed. Check your credentials.');
          }
          return;
        }

        // Verify admin privilege
        const isAdmin = res.user?.email?.includes('admin') || res.user?.email === 'admin@pavitrainnovations.com';
        if (!isAdmin) {
          toast.error('Access denied. You do not have administrator privileges.');
          await logoutUser();
          return;
        }

        login(res.user?.email || email, 'admin', res.user?.displayName);
        toast.success('Signed in as Administrator');
        navigate('/admin');
        return;
      }

      // Customer Sign In
      const res = await loginUser(email, password, rememberMe);

      if (!res.success) {
        if (res.emailVerified === false) {
          setTab('unverified');
          toast.error('Your email address has not been verified.');
        } else {
          toast.error(res.error || res.message || 'Login failed. Check your credentials.');
        }
        return;
      }

      toast.success(`Welcome back, ${res.user?.displayName || 'Customer'}!`);
      login(res.user?.email || email, 'customer', res.user?.displayName);
      navigate('/profile');
    } catch (err: any) {
      console.error('[LoginPage Login Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle User Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.trim().length < 2) {
      toast.error('Please enter your full name.');
      return;
    }
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await registerUser(email, password, name);

      if (res.success) {
        toast.success('Your account has been created successfully. A verification email has been sent to your email address. Please verify your email before logging in.');
        setTab('unverified');
      } else {
        toast.error(res.error || 'Unable to send verification email.');
      }
    } catch (err: any) {
      console.error('[LoginPage Register Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend Verification Email
  const handleResendEmail = async () => {
    setIsSubmitting(true);
    try {
      const res = await resendVerificationEmail();
      if (res.success) {
        toast.success(res.message || `Verification email resent to ${email}`);
      } else {
        toast.error(res.error || res.message || 'Could not resend verification email.');
      }
    } catch (err: any) {
      console.error('[LoginPage Resend Email Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check Verification Status
  const handleCheckVerifiedStatus = async () => {
    setIsSubmitting(true);
    try {
      const status = await refreshEmailVerificationStatus();

      if (status.isVerified) {
        toast.success('Email verified successfully! Logging you in...');
        login(email || 'snehakrishnamurthy25@gmail.com', 'customer', name);
        navigate('/profile');
      } else {
        toast.error('Your email address has not been verified.');
      }
    } catch (err: any) {
      console.error('[LoginPage Check Status Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Change Email Address
  const handleChangeEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmailInput || !newEmailInput.includes('@')) {
      toast.error('Please enter a valid new email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changeAndVerifyEmail(newEmailInput);
      if (res.success) {
        setEmail(newEmailInput);
        setIsChangingEmail(false);
        toast.success(res.message || 'Verification link sent to new email address.');
      } else {
        toast.error(res.error || 'Failed to update email address.');
      }
    } catch (err: any) {
      console.error('[LoginPage Change Email Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Firebase Password Reset
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendPasswordReset(email);

      if (res.success) {
        toast.success(res.message || 'Password reset email sent.');
        setTab('login');
      } else {
        toast.error(res.error || res.message || 'Failed to send password reset email.');
      }
    } catch (err: any) {
      console.error('[LoginPage Password Reset Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickCustomer = () => {
    setEmail('snehakrishnamurthy25@gmail.com');
    setPassword('pavitra123');
    setTab('login');
    toast.success('Fields filled for Customer');
  };

  const handleQuickAdmin = () => {
    setEmail('admin@pavitrainnovations.com');
    setPassword('admin123');
    setTab('admin');
    toast.success('Fields filled for Admin CMS');
  };

  return (
    <div className="bg-[#09090B] text-white min-h-screen py-16 flex items-center justify-center font-inter px-4">
      <div className="bg-[#111111] border border-[#27272A] max-w-md w-full rounded-3xl p-8 space-y-6 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="bg-[#D7FF2F] text-[#09090B] px-4 py-1.5 font-syne font-black text-xl inline-block rounded uppercase tracking-wider">
            PAVITRA INNOVATIONS
          </div>
          <h1 className="font-syne font-black text-2xl text-white uppercase">
            {tab === 'admin' 
              ? 'ADMINISTRATOR CMS PORTAL' 
              : tab === 'reset' 
              ? 'PASSWORD RESET' 
              : tab === 'unverified'
              ? 'VERIFICATION REQUIRED'
              : tab === 'register'
              ? 'CREATE ACCOUNT'
              : 'CUSTOMER LOGIN'}
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            {tab === 'admin' 
              ? 'Access administrative control panels and product CMS commands.'
              : tab === 'unverified'
              ? 'Verify your identity before using our modular smart purifier services.'
              : 'Sign in to track orders, manage modular configurations, and update profiles.'}
          </p>
        </div>

        {/* Configuration Notice when Firebase Env variables are missing */}
        {missingFirebaseKeys.length > 0 && (
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-200 font-medium">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#F59E0B] block">Firebase Setup Notice</span>
              <span>Missing Keys: <code className="bg-black/50 px-1 py-0.5 font-mono text-[10px] text-[#D7FF2F]">{missingFirebaseKeys.join(', ')}</code></span>
            </div>
          </div>
        )}

        {/* Tab Selector */}
        {tab !== 'reset' && tab !== 'unverified' && (
          <div className="flex bg-[#09090B] border border-[#27272A] rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => {
                setTab('login');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                tab === 'login' ? 'bg-[#D7FF2F] text-[#09090B]' : 'text-gray-400 hover:text-white'
              }`}
            >
              SIGN IN
            </button>
            <button
              onClick={() => {
                setTab('register');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setName('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                tab === 'register' ? 'bg-[#D7FF2F] text-[#09090B]' : 'text-gray-400 hover:text-white'
              }`}
            >
              REGISTER
            </button>
            <button
              onClick={() => {
                setTab('admin');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2.5 rounded-lg transition-all ${
                tab === 'admin' ? 'bg-[#6C3EF4] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              ADMIN CMS
            </button>
          </div>
        )}

        {/* 1. UNVERIFIED EMAIL SCREEN */}
        {tab === 'unverified' && (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 bg-[#D7FF2F]/10 border border-[#D7FF2F]/40 rounded-full flex items-center justify-center mx-auto text-[#D7FF2F]">
              <Mail className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h4 className="font-syne font-black text-sm text-white uppercase">VERIFY YOUR EMAIL ADDRESS</h4>
              <p className="text-xs text-gray-300 font-medium leading-relaxed">
                Your account has been created successfully.<br />
                A verification email has been sent to <span className="font-mono text-[#D7FF2F] font-bold">{email || 'example@gmail.com'}</span>.<br />
                Please verify your email before logging in.
              </p>
            </div>

            {isChangingEmail ? (
              <form onSubmit={handleChangeEmailSubmit} className="space-y-3 pt-2 text-left">
                <label className="block text-xs font-bold text-gray-300">ENTER NEW EMAIL ADDRESS</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newEmailInput}
                    onChange={(e) => setNewEmailInput(e.target.value)}
                    placeholder="example@gmail.com"
                    className="flex-1 bg-[#09090B] border border-[#27272A] rounded-xl p-2.5 text-xs text-white focus:border-[#D7FF2F]"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-[#D7FF2F] text-[#09090B] font-black text-xs px-3 rounded-xl uppercase"
                  >
                    UPDATE
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChangingEmail(false)}
                  className="text-[11px] text-gray-400 hover:text-white font-bold"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleCheckVerifiedStatus}
                  disabled={isSubmitting}
                  className="w-full bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>REFRESH STATUS</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    className="bg-[#09090B] border border-[#27272A] hover:border-[#D7FF2F] text-xs font-bold text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D7FF2F]" />
                    <span>RESEND EMAIL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsChangingEmail(true)}
                    className="bg-[#09090B] border border-[#27272A] hover:border-[#D7FF2F] text-xs font-bold text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#D7FF2F]" />
                    <span>CHANGE EMAIL</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    setTab('login');
                  }}
                  className="text-xs text-gray-400 hover:text-white font-bold pt-2 block mx-auto"
                >
                  ← BACK TO SIGN IN
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. PASSWORD RESET SCREEN */}
        {tab === 'reset' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-gray-300 mb-1">ENTER YOUR ACCOUNT EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D7FF2F]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <span>{isSubmitting ? 'SENDING...' : 'SEND RESET EMAIL'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setTab('login')}
              className="w-full text-center text-xs text-gray-400 hover:text-white font-bold pt-2 block"
            >
              ← BACK TO SIGN IN
            </button>
          </form>
        )}

        {/* 3. LOGIN & REGISTER FORM */}
        {(tab === 'login' || tab === 'register' || tab === 'admin') && (
          <form onSubmit={tab === 'register' ? handleRegisterSubmit : handleSubmit} className="space-y-4 text-xs font-bold">
            {tab === 'register' && (
              <div>
                <label className="block text-gray-300 mb-1">YOUR NAME</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D7FF2F]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-1">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D7FF2F]"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-gray-300">PASSWORD</label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => setTab('reset')}
                    className="text-[10px] text-[#D7FF2F] hover:underline font-bold"
                  >
                    FORGOT PASSWORD?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D7FF2F]"
                  required
                />
              </div>
            </div>

            {tab === 'register' && (
              <div>
                <label className="block text-gray-300 mb-1">CONFIRM PASSWORD</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#09090B] border border-[#27272A] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[#D7FF2F]"
                    required
                  />
                </div>
              </div>
            )}

            {/* REMEMBER ME CHECKBOX FOR LOGIN */}
            {tab === 'login' && (
              <div 
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 cursor-pointer pt-1 text-gray-300 hover:text-white select-none text-[11px]"
              >
                {rememberMe ? (
                  <CheckSquare className="w-4 h-4 text-[#D7FF2F]" />
                ) : (
                  <Square className="w-4 h-4 text-gray-500" />
                )}
                <span>Remember Me</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] font-black text-xs py-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <span>{isSubmitting ? 'PROCESSING...' : tab === 'admin' ? 'SIGN IN TO ADMIN CMS' : tab === 'register' ? 'CREATE ACCOUNT & VERIFY EMAIL' : 'SIGN IN TO ACCOUNT'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Instant Access Options */}
        <div className="pt-4 border-t border-[#27272A] space-y-3 text-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase block">ONE-CLICK QUICK LOGIN</span>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleQuickCustomer}
              className="flex-1 bg-[#09090B] border border-[#27272A] hover:border-[#D7FF2F] text-[11px] font-extrabold text-white py-2.5 px-3 rounded-xl transition-colors"
            >
              Customer (snehakrishnamurthy25@gmail.com)
            </button>
            <button
              onClick={handleQuickAdmin}
              className="flex-1 bg-[#6C3EF4]/20 border border-[#6C3EF4] text-[11px] font-extrabold text-[#D7FF2F] py-2.5 px-3 rounded-xl transition-colors"
            >
              Demo Admin CMS
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <Link to="/" className="text-xs font-bold text-gray-400 hover:text-white transition-colors">
            ← Return to Pavitra Store
          </Link>
        </div>

      </div>
    </div>
  );
};
