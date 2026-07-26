import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { getMissingFirebaseKeys } from '../../services/firebase';
import { 
  registerUser, 
  loginUser, 
  signInWithGoogle,
  resendVerificationEmail, 
  refreshEmailVerificationStatus, 
  sendPasswordReset,
  changeAndVerifyEmail,
  parseFirebaseError,
  logoutUser
} from '../../services/authService';
import { X, User, Lock, Mail, ArrowRight, AlertCircle, RefreshCw, Send, Edit3, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuthStore();
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
    if (tab === 'unverified' && isOpen) {
      interval = setInterval(async () => {
        try {
          const status = await refreshEmailVerificationStatus();
          if (status.isVerified) {
            toast.success('Email verified successfully! Logging you in...');
            login(email || 'snehakrishnamurthy25@gmail.com', 'customer', name);
            onClose();
          }
        } catch (err) {
          console.warn('[Auto-poll Notice]:', err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [tab, isOpen, email, name, login, onClose]);

  if (!isOpen) return null;

  // 1. Google OAuth Sign-In
  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const res = await signInWithGoogle(rememberMe);

      if (res.success && res.emailVerified) {
        toast.success(res.message || 'Logged in with Google!');
        login(res.user?.email || 'snehakrishnamurthy25@gmail.com', 'customer', res.user?.displayName);
        onClose();
      } else {
        toast.error(res.error || 'Google authentication failed.');
      }
    } catch (err: any) {
      console.error('[Google Handler Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Email / Password Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
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
        onClose();
        return;
      }

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

      toast.success('Welcome back!');
      login(res.user?.email || email, 'customer', res.user?.displayName);
      onClose();
    } catch (err: any) {
      console.error('[Login Handler Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. User Registration
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
      console.error('[Register Handler Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Resend Verification Email
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
      console.error('[Resend Email Handler Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Check Verification Status
  const handleCheckVerifiedStatus = async () => {
    setIsSubmitting(true);
    try {
      const status = await refreshEmailVerificationStatus();

      if (status.isVerified) {
        toast.success('Email verified successfully! Logging you in...');
        login(email || 'snehakrishnamurthy25@gmail.com', 'customer', name);
        onClose();
      } else {
        toast.error('Your email address has not been verified.');
      }
    } catch (err: any) {
      console.error('[Check Status Handler Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 6. Change Email Address
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
      console.error('[Change Email Handler Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Forgot Password Reset
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
      console.error('[Password Reset Handler Error]:', err);
      toast.error(parseFirebaseError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-inter">
      <div className="bg-[#111111] border border-[#27272A] max-w-md w-full rounded-3xl p-6 sm:p-8 relative shadow-2xl text-white">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="bg-[#D7FF2F] text-[#09090B] px-3 py-1 font-syne font-black text-lg inline-block rounded">
            PAVITRA INNOVATIONS
          </div>
          <p className="text-xs text-gray-300 font-medium">
            {tab === 'admin' 
              ? 'Administrator CMS Portal' 
              : tab === 'reset' 
              ? 'Password Reset Portal' 
              : tab === 'unverified'
              ? 'Email Verification Required'
              : 'Access your modular account & order tracking'}
          </p>
        </div>

        {/* Configuration Notice when Firebase Env variables are missing */}
        {missingFirebaseKeys.length > 0 && (
          <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/30 rounded-2xl p-3 mb-5 flex items-start gap-2.5 text-xs text-amber-200 font-medium">
            <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#F59E0B] block">Firebase Setup Notice</span>
              <span>Missing Keys: <code className="bg-black/50 px-1 py-0.5 font-mono text-[10px] text-[#D7FF2F]">{missingFirebaseKeys.join(', ')}</code> in your <code className="bg-black/50 px-1 py-0.5 font-mono text-[10px]">.env</code> file.</span>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        {tab !== 'reset' && tab !== 'unverified' && (
          <div className="flex bg-[#09090B] border border-[#27272A] rounded-xl p-1 mb-6 text-xs font-bold">
            <button
              onClick={() => {
                setTab('login');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
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
              className={`flex-1 py-2 rounded-lg transition-all ${
                tab === 'register' ? 'bg-[#D7FF2F] text-[#09090B]' : 'text-gray-400 hover:text-white'
              }`}
            >
              CREATE ACCOUNT
            </button>
            <button
              onClick={() => {
                setTab('admin');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
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
              <h4 className="font-syne font-black text-lg text-white uppercase">VERIFY YOUR EMAIL ADDRESS</h4>
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
                  <span>REFRESH VERIFICATION STATUS</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    className="bg-[#09090B] border border-[#27272A] hover:border-[#D7FF2F] text-xs font-bold text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D7FF2F]" />
                    <span>RESEND VERIFICATION EMAIL</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsChangingEmail(true)}
                    className="bg-[#09090B] border border-[#27272A] hover:border-[#D7FF2F] text-xs font-bold text-white py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#D7FF2F]" />
                    <span>CHANGE EMAIL ADDRESS</span>
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
                  ← GO TO LOGIN
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. FORGOT PASSWORD SCREEN */}
        {tab === 'reset' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 text-xs font-bold">
            <div>
              <label className="block text-gray-300 mb-1">ENTER YOUR ACCOUNT EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
              ← GO TO LOGIN
            </button>
          </form>
        )}

        {/* 3. LOGIN & REGISTER FORM */}
        {(tab === 'login' || tab === 'register' || tab === 'admin') && (
          <div className="space-y-4">
            
            {/* GOOGLE SIGN IN BUTTON */}
            {tab !== 'admin' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 font-extrabold text-xs py-3 px-4 rounded-xl uppercase tracking-wider flex items-center justify-center gap-3 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>CONTINUE WITH GOOGLE</span>
                </button>

                <div className="flex items-center my-3 text-[10px] font-bold text-gray-500 uppercase">
                  <div className="flex-1 border-t border-[#27272A]" />
                  <span className="px-3">OR WITH EMAIL</span>
                  <div className="flex-1 border-t border-[#27272A]" />
                </div>
              </>
            )}

            <form onSubmit={tab === 'register' ? handleRegisterSubmit : handleLoginSubmit} className="space-y-4 text-xs font-bold">
              {tab === 'register' && (
                <div>
                  <label className="block text-gray-300 mb-1">FULL NAME</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tab === 'admin' ? 'admin@pavitrainnovations.com' : 'example@gmail.com'}
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
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                  className="flex items-center gap-2 cursor-pointer pt-1 text-gray-300 hover:text-white select-none"
                >
                  {rememberMe ? (
                    <CheckSquare className="w-4 h-4 text-[#D7FF2F]" />
                  ) : (
                    <Square className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-[11px] font-bold">Remember Me</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#D7FF2F] text-[#09090B] hover:bg-[#C2EB1B] disabled:opacity-50 font-black text-xs py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                {isSubmitting ? (
                  <span>PROCESSING...</span>
                ) : (
                  <>
                    <span>{tab === 'admin' ? 'SIGN IN TO ADMIN CMS' : tab === 'register' ? 'CREATE ACCOUNT & VERIFY EMAIL' : 'SIGN IN TO ACCOUNT'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
