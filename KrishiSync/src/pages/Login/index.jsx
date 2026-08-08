import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, 
  Phone, 
  KeyRound, 
  ArrowRight, 
  RefreshCw, 
  Edit2, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export default function Login() {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const phoneInputRef = useRef(null);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();
  const { requestOtp, verifyOtp } = useAuth();

  // Validate Indian 10-digit mobile number starting with 6, 7, 8, or 9
  const isValidPhone = /^[6-9]\d{9}$/.test(phone);
  
  // Validate complete 4-digit OTP
  const currentOtp = otpDigits.join('');
  const isValidOtp = /^\d{4}$/.test(currentOtp);

  // Focus phone input on initial mount
  useEffect(() => {
    if (step === 1 && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, [step]);

  // Handle countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Step 1: Submit Phone Number
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPhone || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      await requestOtp(phone);
      setIsLoading(false);
      setStep(2);
      setResendTimer(30);
      setError('');
      // Focus first OTP box on step transition
      setTimeout(() => {
        if (otpInputRefs[0].current) {
          otpInputRefs[0].current.focus();
        }
      }, 100);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to send OTP. Please check your phone number.');
    }
  };

  // Step 2: Submit OTP Verification
  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isValidOtp || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      await verifyOtp(phone, currentOtp);
      setIsLoading(false);
      // Navigate to dashboard upon successful authentication
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setIsLoading(false);
      // STATE 4 — INVALID OTP requirement: "Incorrect code. Please try again."
      setError('Incorrect code. Please try again.');
      // Highlight & focus first digit slot for quick retry
      setOtpDigits(['', '', '', '']);
      setTimeout(() => {
        if (otpInputRefs[0].current) {
          otpInputRefs[0].current.focus();
        }
      }, 50);
    }
  };

  // OTP Digit Box Change Handler
  const handleOtpDigitChange = (index, value) => {
    // Only accept numeric inputs
    const cleanValue = value.replace(/\D/g, '');
    
    // Handle paste of 4 digits
    if (cleanValue.length >= 4) {
      const pastedDigits = cleanValue.slice(0, 4).split('');
      setOtpDigits(pastedDigits);
      if (otpInputRefs[3].current) {
        otpInputRefs[3].current.focus();
      }
      setError('');
      return;
    }

    const digit = cleanValue.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setError('');

    // Auto advance focus to next digit box
    if (digit && index < 3 && otpInputRefs[index + 1].current) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  // Keydown Handler for Backspace navigation across digit boxes
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0 && otpInputRefs[index - 1].current) {
        otpInputRefs[index - 1].current.focus();
      }
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError('');

    try {
      await requestOtp(phone);
      setIsResending(false);
      setResendTimer(30);
      setOtpDigits(['', '', '', '']);
      if (otpInputRefs[0].current) {
        otpInputRefs[0].current.focus();
      }
    } catch (err) {
      setIsResending(false);
      setError(err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  // Change Number Option
  const handleChangeNumber = () => {
    setStep(1);
    setOtpDigits(['', '', '', '']);
    setError('');
    setTimeout(() => {
      if (phoneInputRef.current) {
        phoneInputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col justify-center items-center p-4 sm:p-6 pb-safe font-sans">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl border border-[#DCFCE7] p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300">
        
        {/* Top Decorative Header Banner */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-400" />

        <div>
          {/* Branding Header */}
          <div className="flex items-center justify-between mb-8 pt-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center">
                <Sprout className="h-7 w-7 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5">
                  KrishiSync
                </h1>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 inline-block">
                  स्मार्ट कृषि मंच
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure MVP</span>
            </div>
          </div>

          {/* STATE 1: PHONE NUMBER INPUT */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
              {/* Welcoming Heading & Multilingual Warmth */}
              <div className="mb-6">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  Namaste • नमस्ते • স্বাগতম
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  Welcome to KrishiSync
                </h2>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Enter your 10-digit mobile number to access real-time mandi prices, disease scanner, and agripool options.
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="phone-input" className="block text-sm font-bold text-gray-800">
                    Mobile Number <span className="text-emerald-600">*</span>
                  </label>

                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1.5 text-gray-600 font-semibold text-base pointer-events-none border-r border-gray-200 pr-3">
                      <span className="text-lg">🇮🇳</span>
                      <span>+91</span>
                    </div>

                    <input
                      ref={phoneInputRef}
                      id="phone-input"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength="10"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '');
                        if (digits.length <= 10) setPhone(digits);
                        setError('');
                      }}
                      disabled={isLoading}
                      aria-label="Mobile phone number"
                      aria-describedby="phone-hint"
                      className="w-full h-14 bg-gray-50 border-2 border-gray-200 text-gray-900 text-lg font-bold rounded-2xl pl-24 pr-11 outline-none transition-all duration-200 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 placeholder:text-gray-400 placeholder:font-normal"
                    />

                    {isValidPhone && (
                      <div className="absolute right-3.5 text-emerald-600">
                        <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                      </div>
                    )}
                  </div>

                  <p id="phone-hint" className="text-xs text-gray-500 flex justify-between items-center px-1">
                    <span>Must be a valid 10-digit Indian number</span>
                    <span className="font-semibold text-gray-600">{phone.length}/10</span>
                  </p>
                </div>

                {error && (
                  <div 
                    role="alert" 
                    className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-medium flex items-center gap-2.5"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Large Touch Action Button */}
                <button
                  type="submit"
                  disabled={!isValidPhone || isLoading}
                  aria-label="Send OTP Verification Code"
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none disabled:active:scale-100 min-h-[52px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STATE 2: OTP VERIFICATION INPUT */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                type="button"
                onClick={handleChangeNumber}
                className="mb-4 text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Phone Entry</span>
              </button>

              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  Verify OTP Code
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-sm text-gray-600">
                    Sent to <span className="font-bold text-gray-900">+91 {phone}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    aria-label="Change phone number"
                    className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-0.5 ml-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>
              </div>

              {/* STATE 4 — INVALID OTP ERROR DISPLAY */}
              {error && (
                <div 
                  role="alert" 
                  className="mb-5 p-3.5 bg-red-50 border-2 border-red-300 rounded-2xl text-red-700 text-sm font-semibold flex items-center gap-2.5 animate-shake"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-gray-800 text-center">
                    Enter 4-Digit Verification Code
                  </label>

                  {/* 4-Digit Input Boxes Grid */}
                  <div className="flex justify-center items-center gap-3 sm:gap-4 my-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        id={`otp-input-${idx}`}
                        type="text"
                        inputMode="numeric"
                        autoComplete={idx === 0 ? "one-time-code" : "off"}
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        disabled={isLoading}
                        aria-label={`Digit ${idx + 1} of verification code`}
                        aria-invalid={Boolean(error)}
                        className={`w-14 h-16 sm:w-16 sm:h-18 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all duration-200 shadow-sm ${
                          error 
                            ? 'border-red-400 bg-red-50 text-red-900 focus:ring-4 focus:ring-red-400/20' 
                            : digit 
                              ? 'border-emerald-600 bg-emerald-50/50 text-gray-900' 
                              : 'border-gray-200 bg-gray-50 text-gray-900 focus:bg-white focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Demo Helper Badge */}
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-3 py-1 rounded-full">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Demo Code: <strong className="font-mono text-emerald-950">1234</strong></span>
                    </span>
                  </div>
                </div>

                {/* Login Submit Button */}
                <button
                  type="submit"
                  disabled={!isValidOtp || isLoading}
                  aria-label="Verify OTP and Login"
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none disabled:active:scale-100 min-h-[52px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Login to Dashboard</span>
                  )}
                </button>

                {/* Resend & Change Number Options */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-sm">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isResending || isLoading}
                    className="font-semibold text-emerald-700 hover:text-emerald-800 disabled:text-gray-400 flex items-center gap-1.5 transition-colors disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                    <span>
                      {resendTimer > 0 
                        ? `Resend OTP in ${resendTimer}s` 
                        : isResending 
                          ? 'Sending...' 
                          : 'Resend OTP'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    disabled={isLoading}
                    className="font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Change number
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer Subtext */}
        <div className="mt-8 text-center text-xs text-gray-500">
          By continuing, you agree to KrishiSync's{' '}
          <span className="underline font-medium text-emerald-700 cursor-pointer">Terms of Service</span>{' '}
          &{' '}
          <span className="underline font-medium text-emerald-700 cursor-pointer">Privacy Policy</span>
        </div>

      </div>
    </div>
  );
}