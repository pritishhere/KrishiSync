import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sprout, 
  ArrowRight, 
  RefreshCw, 
  Edit2, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  KeyRound
} from 'lucide-react';
import Button from '../../components/common/Button';

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
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setIsLoading(false);
      setError('Incorrect code. Please try again.');
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
    const cleanValue = value.replace(/\D/g, '');
    
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

    if (digit && index < 3 && otpInputRefs[index + 1].current) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  // Keydown Handler for Backspace navigation
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
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center items-center p-3 sm:p-6 pb-safe font-body">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        
        {/* Top Decorative Brand Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2E7D32]" />

        <div>
          {/* Branding Header */}
          <div className="flex items-center justify-between mb-6 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#2E7D32] text-white p-2.5 rounded-xl shadow-xs flex items-center justify-center">
                <Sprout className="h-6 w-6 stroke-[2.3]" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold font-heading text-[#1F2937] tracking-tight">
                  Krishi<span className="text-[#2E7D32]">Sync</span>
                </h1>
                <span className="text-[11px] font-bold text-[#2E7D32] bg-green-50 px-2 py-0.5 rounded-full border border-green-200 inline-block font-heading">
                  स्मार्ट कृषि मंच
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified MVP</span>
            </div>
          </div>

          {/* STATE 1: PHONE NUMBER INPUT */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <span className="text-[12px] font-bold text-[#2E7D32] bg-green-100/70 px-2 py-0.5 rounded-full border border-green-200 inline-block mb-1 font-heading">
                  Namaste 🙏
                </span>
                <h2 className="text-2xl font-black font-heading text-[#1F2937] leading-tight">
                  Welcome to KrishiSync
                </h2>
                <p className="text-[13px] font-medium text-[#6B7280] mt-1.5 leading-relaxed">
                  Enter your 10-digit mobile number to access real-time mandi prices, disease scanner, and agripool options.
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="phone-input" className="block text-[13px] font-bold text-[#1F2937] font-heading">
                    Mobile Number <span className="text-[#2E7D32]">*</span>
                  </label>

                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1 text-[#1F2937] font-bold text-[14px] pointer-events-none border-r border-gray-200 pr-2.5 font-heading">
                      <span>🇮🇳 +91</span>
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
                      aria-label="10 digit mobile phone number"
                      aria-describedby="phone-hint"
                      className="w-full h-12 bg-[#F9FAFB] border border-gray-300 text-[#1F2937] text-[16px] font-bold rounded-xl pl-22 pr-10 outline-none transition-all focus:bg-white focus:border-[#2E7D32] focus-visible:ring-2 focus-visible:ring-[#2E7D32]"
                    />

                    {isValidPhone && (
                      <div className="absolute right-3 text-[#10B981]">
                        <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
                      </div>
                    )}
                  </div>

                  <p id="phone-hint" className="text-[11px] font-medium text-[#6B7280] flex justify-between items-center px-1">
                    <span>Must be a valid 10-digit Indian mobile number</span>
                    <span className="font-bold text-[#1F2937]">{phone.length}/10</span>
                  </p>
                </div>

                {error && (
                  <div 
                    role="alert" 
                    className="p-3 bg-[#FEF2F2] border border-[#EF4444]/30 rounded-xl text-[#EF4444] text-[13px] font-bold flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Primary Action Button */}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={!isValidPhone || isLoading}
                  className="text-[15px] py-3 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                    </div>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* STATE 2: OTP VERIFICATION INPUT */}
          {step === 2 && (
            <div className="space-y-5">
              <button
                type="button"
                onClick={handleChangeNumber}
                className="text-[12px] font-bold text-[#2E7D32] hover:underline flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200 cursor-pointer font-heading"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to Phone Entry</span>
              </button>

              <div>
                <h2 className="text-2xl font-black font-heading text-[#1F2937] leading-tight">
                  Verify OTP Code
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[13px] text-[#6B7280]">
                    Sent to <strong className="text-[#1F2937] font-bold">+91 {phone}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={handleChangeNumber}
                    aria-label="Change phone number"
                    className="text-[12px] font-bold text-[#2E7D32] hover:underline flex items-center gap-0.5 cursor-pointer font-heading"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {/* INVALID OTP ERROR DISPLAY */}
              {error && (
                <div 
                  role="alert" 
                  className="p-3 bg-[#FEF2F2] border border-[#EF4444]/30 rounded-xl text-[#EF4444] text-[13px] font-bold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-[#1F2937] text-center font-heading">
                    Enter 4-Digit Verification Code
                  </label>

                  {/* 4-Digit Input Boxes Grid */}
                  <div className="flex justify-center items-center gap-2.5 sm:gap-3 my-1">
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
                        className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-extrabold rounded-xl border outline-none font-heading transition-all ${
                          error 
                            ? 'border-[#EF4444] bg-[#FEF2F2] text-[#EF4444] focus-visible:ring-2 focus-visible:ring-[#EF4444]' 
                            : digit 
                              ? 'border-[#2E7D32] bg-emerald-50 text-[#1F2937]' 
                              : 'border-gray-300 bg-[#F9FAFB] text-[#1F2937] focus:bg-white focus:border-[#2E7D32] focus-visible:ring-2 focus-visible:ring-[#2E7D32]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Demo Code Helper */}
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D32] bg-green-50 border border-green-200 px-3 py-0.5 rounded-full font-heading">
                      <KeyRound className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Demo Code: <strong className="font-mono text-[#1F2937]">1234</strong></span>
                    </span>
                  </div>
                </div>

                {/* Login Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={!isValidOtp || isLoading}
                  className="text-[15px] py-3 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Login to Dashboard</span>
                  )}
                </Button>

                {/* Resend & Change Number Options */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[13px] font-semibold">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || isResending || isLoading}
                    className="text-[#2E7D32] hover:underline disabled:text-gray-400 flex items-center gap-1 transition-colors cursor-pointer disabled:cursor-not-allowed font-heading"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
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
                    className="text-[#6B7280] hover:text-[#1F2937] transition-colors cursor-pointer"
                  >
                    Change number
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer Subtext */}
        <div className="mt-6 text-center text-[11px] text-[#6B7280]">
          By continuing, you agree to KrishiSync's{' '}
          <span className="underline font-bold text-[#2E7D32] cursor-pointer">Terms of Service</span>{' '}
          &amp;{' '}
          <span className="underline font-bold text-[#2E7D32] cursor-pointer">Privacy Policy</span>
        </div>

      </div>
    </div>
  );
}