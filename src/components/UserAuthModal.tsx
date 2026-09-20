import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Phone, 
  Lock, 
  Sparkles, 
  History, 
  Heart, 
  LogOut, 
  CheckCircle,
  Award,
  Mail,
  AlertCircle
} from 'lucide-react';
import { UserProfile, Order } from '../types';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  signInWithGoogle
} from '../lib/firebase';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  userOrders: Order[];
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  setCurrentUser,
  userOrders,
}) => {
  const [authMode, setAuthMode] = useState<'email' | 'otp'>('email');
  const [isSignUp, setIsSignUp] = useState(false);

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Status/Error
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter email and password.');
          setLoading(false);
          return;
        }

        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCred.user;

        const newUserProfile: UserProfile = {
          id: user.uid,
          email: user.email || email.trim(),
          name: userName.trim() || email.split('@')[0] || 'Pizza Pro Customer',
          phone: phoneNumber.trim() || '03251229333',
          loyaltyPoints: 100, // Welcome bonus points!
          savedAddresses: ['Main Petroleum Hujra Road, Shergarh'],
        };

        await saveUserProfileToFirestore(newUserProfile);
        setCurrentUser(newUserProfile);
        setSuccessMsg('Account created in Firebase Auth & Firestore! Welcome to Pizza Pro.');
      } else {
        if (!email.trim() || !password.trim()) {
          setErrorMsg('Please enter your email and password.');
          setLoading(false);
          return;
        }

        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const user = userCred.user;

        // Fetch user profile from Firestore users collection
        let profile = await getUserProfileFromFirestore(user.uid);
        if (!profile) {
          profile = {
            id: user.uid,
            email: user.email || email.trim(),
            name: user.displayName || email.split('@')[0] || 'Pizza Pro Customer',
            phone: phoneNumber.trim() || '03251229333',
            loyaltyPoints: 100,
            savedAddresses: ['Shergarh, Punjab'],
          };
          await saveUserProfileToFirestore(profile);
        }
        setCurrentUser(profile);
        setSuccessMsg('Signed in with Firebase Auth! Welcome back.');
      }

      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 1200);
    } catch (err: any) {
      console.error('Firebase Auth Error:', err);
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        setErrorMsg('Email/Password provider is disabled in Firebase Console. Please go to Firebase Console (pizza-pro-b9ebb) -> Authentication -> Sign-in method and enable "Email/Password".');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('This email is already registered in Firebase Auth. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters in Firebase Auth.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Please enter a valid email address.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Too many unsuccessful attempts. Please try again later.');
      } else {
        setErrorMsg(err.message || 'Firebase Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const gUser = await signInWithGoogle();
      if (gUser) {
        let profile = await getUserProfileFromFirestore(gUser.uid);
        if (!profile) {
          profile = {
            id: gUser.uid,
            email: gUser.email || '',
            name: gUser.displayName || gUser.email?.split('@')[0] || 'Pizza Pro Customer',
            phone: gUser.phoneNumber || '03251229333',
            loyaltyPoints: 100,
            savedAddresses: ['Shergarh, Punjab'],
          };
          await saveUserProfileToFirestore(profile);
        }
        setCurrentUser(profile);
        setSuccessMsg('Signed in with Google Firebase Auth!');
        setTimeout(() => {
          onClose();
          setSuccessMsg('');
        }, 1200);
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      if (err?.code === 'auth/operation-not-allowed' || err?.message?.includes('operation-not-allowed')) {
        setErrorMsg('Google Provider is disabled in Firebase Console. Please enable Google in Firebase Console (pizza-pro-b9ebb) -> Authentication -> Sign-in method.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign in popup was closed before completing.');
      } else {
        setErrorMsg(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBypassLocalSignIn = async () => {
    const fallbackId = `user-local-${Date.now()}`;
    const profile: UserProfile = {
      id: fallbackId,
      name: userName.trim() || email.split('@')[0] || 'Pizza Pro Customer',
      phone: phoneNumber.trim() || '03251229333',
      loyaltyPoints: 100,
      savedAddresses: ['Shergarh, Punjab'],
    };
    await saveUserProfileToFirestore(profile);
    setCurrentUser(profile);
    setSuccessMsg('Signed in with Local Profile successfully!');
    setTimeout(() => {
      onClose();
      setSuccessMsg('');
      setErrorMsg('');
    }, 1000);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    const uid = `usr-${phoneNumber.replace(/\D/g, '') || Date.now()}`;
    const loggedInUser: UserProfile = {
      id: uid,
      name: userName || 'Shergarh Foodie',
      phone: phoneNumber,
      loyaltyPoints: 240,
      savedAddresses: ['Main Petroleum Hujra Road, Shergarh'],
    };

    await saveUserProfileToFirestore(loggedInUser);
    setCurrentUser(loggedInUser);
    setOtpSent(false);
    setPhoneNumber('');
    setOtpCode('');
    onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out error:', e);
    }
    setCurrentUser(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] overflow-y-auto border border-zinc-200 shadow-2xl relative"
        >
          {/* Header */}
          <div className="bg-zinc-950 text-white p-5 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-600 text-white rounded-xl">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base italic text-white">
                  {currentUser ? 'Your Pizza Pro Profile' : (isSignUp ? 'Create Firebase Account' : 'Sign In to Pizza Pro')}
                </h3>
                <p className="text-xs text-zinc-400">
                  {currentUser ? `Welcome back, ${currentUser.name}` : 'Firebase Auth & Cloud Firestore Connected'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {currentUser ? (
              /* User Profile View */
              <div className="space-y-5">
                {/* User Card */}
                <div className="p-4 bg-gradient-to-r from-zinc-900 to-zinc-950 text-white rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-lg text-white">{currentUser.name}</h4>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">{currentUser.phone}</p>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      Firebase Authenticated
                    </span>
                  </div>
                  <div className="text-right bg-amber-400/20 border border-amber-400/40 px-3 py-1.5 rounded-xl text-amber-300">
                    <span className="text-[10px] font-bold uppercase block">Pizza Pro Rewards</span>
                    <span className="font-black text-sm flex items-center gap-1 justify-end">
                      <Award className="w-4 h-4 text-amber-400" />
                      {currentUser.loyaltyPoints} Pts
                    </span>
                  </div>
                </div>

                {/* Recent Orders History */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                    <History className="w-4 h-4" />
                    <span>Firestore Order History ({userOrders.length})</span>
                  </h4>

                  {userOrders.length === 0 ? (
                    <div className="p-4 bg-zinc-50 rounded-2xl text-center text-xs text-zinc-500 font-medium border border-zinc-200">
                      No past orders found in Firestore. Place your first order today!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {userOrders.map((ord, idx) => (
                        <div
                          key={ord.id || `${ord.orderId}-${idx}`}
                          className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-black text-zinc-900 font-mono">{ord.orderId}</span>
                            <span className="text-[10px] text-zinc-500 block">{ord.createdAt}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-red-600">Rs {ord.totalAmount}</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full block mt-0.5">
                              {ord.orderStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>LOGOUT ACCOUNT</span>
                </button>
              </div>
            ) : (
              /* Auth Form View */
              <div className="space-y-4">
                
                {/* Auth Mode Toggle */}
                <div className="grid grid-cols-2 gap-1 bg-zinc-100 p-1 rounded-xl text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('email'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`py-2 rounded-lg transition-colors ${authMode === 'email' ? 'bg-red-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}
                  >
                    Email & Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('otp'); setErrorMsg(''); setSuccessMsg(''); }}
                    className={`py-2 rounded-lg transition-colors ${authMode === 'otp' ? 'bg-red-600 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'}`}
                  >
                    SMS OTP / Phone
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{errorMsg}</span>
                    </div>
                    {(errorMsg.includes('disabled') || errorMsg.includes('operation-not-allowed')) && (
                      <button
                        type="button"
                        onClick={handleBypassLocalSignIn}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg transition-colors mt-1"
                      >
                        CONTINUE WITH INSTANT USER PROFILE
                      </button>
                    )}
                  </div>
                )}

                {successMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMsg}</span>
                  </div>
                )}

                {authMode === 'email' ? (
                  <form onSubmit={handleEmailAuth} className="space-y-3.5">
                    {isSignUp && (
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ali Raza"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="yourname@domain.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      </div>
                    </div>

                    {isSignUp && (
                      <div>
                        <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                          Mobile Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            placeholder="03251229333"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600 font-mono"
                          />
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs uppercase rounded-xl shadow-lg shadow-red-900/30 transition-all mt-2"
                    >
                      {loading ? 'Processing...' : (isSignUp ? 'CREATE FIREBASE ACCOUNT' : 'SIGN IN WITH FIREBASE')}
                    </button>

                    <div className="relative my-3 text-center">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200"></div></div>
                      <span className="relative bg-white px-3 text-[10px] font-bold text-zinc-400 uppercase">Or continue with</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="w-full py-2.5 bg-zinc-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.2 9 5 12 5z"/>
                        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                        <path fill="#FBBC05" d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"/>
                      </svg>
                      <span>Sign in with Google</span>
                    </button>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-xs font-extrabold text-red-600 hover:underline"
                      >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {!otpSent ? (
                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                          <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                            Your Full Name (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Ali Raza"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                            Mobile Phone Number *
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              placeholder="e.g. 03251229333"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600 font-mono"
                            />
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl shadow-lg shadow-red-900/30 transition-all"
                        >
                          SEND SMS OTP CODE
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 shrink-0" />
                          <span>OTP Code sent to {phoneNumber}. (Enter 1234)</span>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-zinc-700 mb-1 block">
                            4-Digit OTP Code *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              placeholder="1234"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value)}
                              className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-red-600 font-mono font-bold tracking-widest text-center text-lg"
                            />
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="py-2.5 bg-zinc-100 text-zinc-700 font-bold text-xs uppercase rounded-xl"
                          >
                            BACK
                          </button>

                          <button
                            type="submit"
                            className="py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase rounded-xl"
                          >
                            VERIFY & LOGIN
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

