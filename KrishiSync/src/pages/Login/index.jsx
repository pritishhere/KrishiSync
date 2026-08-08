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
  KeyRound,
} from 'lucide-react';
import Button from '../../components/common/Button';

export default function Login() {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [devOtp, setDevOtp] = useState('');

  const phoneInputRef = useRef(null);
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigate = useNavigate();
  const { requestOtp, verifyOtp } = useAuth();

  const isValidPhone = /^[6-9]\d{9}$/.test(phone);
  const otpDigits = otp.padEnd(6).split('').slice(0, 6);
  const isValidOtp = /^\d{6}$/.test(otp);

  useEffect(() => {
    if (step === 1 && phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
  }, [step]);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => interval && clearInterval(interval);
  }, [resendTimer]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!isValidPhone || isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await requestOtp(phone);
      setIsLoading(false);
      setStep(2);
      setResendTimer(30);
      setDevOtp(res?.devOtp || '');
      setError('');
      setTimeout(() => otpInputRefs[0].current && otpInputRefs[0].current.focus(), 100);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Failed to send OTP. Please check your phone number.');
    }
  };

  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isValidOtp || isLoading) return;
    setIsLoading(true);
    setError('');
    try {
      await verifyOtp(phone, otp);
      setIsLoading(false);
      navigate('/dashboard', { replace: true });
    } catch {
      setIsLoading(false);
      setError('Incorrect or expired code. Please try again.');
      setOtp('');
      setTimeout(() => otpInputRefs[0].current && otpInputRefs[0].current.focus(), 50);
    }
  };

  const handleOtpDigitChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 6) {
      // paste full code
      setOtp(cleanValue.slice(0, 6));
      otpInputRefs[5].current && otpInputRefs[5].current.focus();
      setError('');
      return;
    }
    const digit = cleanValue.slice(-1);
    const parts = otp.split('');
    parts[index] = digit;
    setOtp(parts.join('').slice(0, 6));
    setError('');
    if (digit && index < 5 && otpInputRefs[index + 1].current) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const parts = otp.split('');
      if (!parts[index] && index > 0 && otpInputRefs[index - 1].current) {
        otpInputRefs[index - 1].current.focus();
      } else {
        const p = [...parts];
        p[index] = '';
        setOtp(p.join(''));
      }
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setError('');
    try {
      const res = await requestOtp(phone);
      setIsResending(false);
      setResendTimer(30);
      setDevOtp(res?.devOtp || '');
      setOtp('');
      otpInputRefs[0].current && otpInputRefs[0].current.focus();
    } catch (err) {
      setIsResending(false);
      setError(err.message || 'Failed to resend OTP.');
    }
  };

  const handleChangeNumber = () => {
    setStep(1);
    setOtp('');
    setError('');
    setTimeout(() => phoneInputRef.current && phoneInputRef.current.focus(), 100);
  };

  return (
    <div className="min-h-screen ks-hero-pattern bg-linear-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#d1fae5] flex flex-col justify-center items-center p-3 sm:p-6 pb-safe relative overflow-hidden">
      {/* Decorative agriculture field pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_20%_20%,#166534_2px,transparent_2px),radial-gradient(circle_at_80%_40%,#2E7D32_2px,transparent_2px),radial-gradient(circle_at_40%_70%,#166534_2px,transparent_2px),radial-gradient(circle_at_70%_90%,#2E7D32_2px,transparent_2px)] bg-size-[60px_60px]" />
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-lime-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-120 ks-card ks-glass ks-appear p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden z-10 transition-shadow duration-500">
        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-[#2E7D32] via-[#F57C00] to-[#2E7D32]" />

        <div>
          <div className="flex items-center justify-between mb-6 pt-2">
            <div className="flex items-center gap-2.5">
              <div className="bg-linear-to-br from-[#2E7D32] to-[#166534] text-white p-2.5 rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center">
                <Sprout className="h-6 w-6 stroke-[2.3]" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold font-heading text-[#1F2937] tracking-tight">
                  Krishi<span className="text-[#2E7D32]">Sync</span>
                </h1>
                <span className="text-[11px] font-bold text-[#2E7D32] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block font-heading">
                  स्मार्ट कृषि मंच
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Backend Live</span>
            </div>
          </div>

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
                      className="w-full h-12 bg-[#F9FAFB] border border-gray-300 text-[#1F2937] text-[16px] font-bold rounded-xl pl-22 pr-10 outline-none transition-all focus:bg-white focus:border-[#2E7D32] focus-visible:ring-2 focus-visible:ring-[#2E7D32]"
                    />
                    {isValidPhone && (
                      <div className="absolute right-3 text-[#10B981]">
                        <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-[#6B7280] flex justify-between items-center px-1">
                    <span>Valid 10-digit Indian mobile number</span>
                    <span className="font-bold text-[#1F2937]">{phone.length}/10</span>
                  </p>
                </div>

                {error && (
                  <div role="alert" className="p-3 bg-[#FEF2F2] border border-[#EF4444]/30 rounded-xl text-[#EF4444] text-[13px] font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" variant="primary" fullWidth disabled={!isValidPhone || isLoading} className="text-[15px] py-3 flex items-center justify-center gap-2">
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
                <h2 className="text-2xl font-black font-heading text-[#1F2937] leading-tight">Verify OTP Code</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[13px] text-[#6B7280]">
                    Sent to <strong className="text-[#1F2937] font-bold">+91 {phone}</strong>
                  </p>
                  <button type="button" onClick={handleChangeNumber} className="text-[12px] font-bold text-[#2E7D32] hover:underline flex items-center gap-0.5 font-heading">
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="p-3 bg-[#FEF2F2] border border-[#EF4444]/30 rounded-xl text-[#EF4444] text-[13px] font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-[#1F2937] text-center font-heading">
                    Enter 6-Digit Verification Code
                  </label>
                  <div className="flex justify-center items-center gap-2 my-1">
                    {otpDigits.map((_, idx) => (
                      <input
                        key={idx}
                        ref={otpInputRefs[idx]}
                        type="text"
                        inputMode="numeric"
                        autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                        maxLength="1"
                        value={otp[idx] || ''}
                        onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        disabled={isLoading}
                        aria-label={`Digit ${idx + 1} of verification code`}
                        className={`w-10 h-12 sm:w-11 sm:h-14 text-center text-xl font-extrabold rounded-xl border outline-none font-heading transition-all ${
                          error
                            ? 'border-[#EF4444] bg-[#FEF2F2] text-[#EF4444] focus-visible:ring-2 focus-visible:ring-[#EF4444]'
                            : otp[idx]
                              ? 'border-[#2E7D32] bg-emerald-50 text-[#1F2937]'
                              : 'border-gray-300 bg-[#F9FAFB] text-[#1F2937] focus:bg-white focus:border-[#2E7D32] focus-visible:ring-2 focus-visible:ring-[#2E7D32]'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2E7D32] bg-green-50 border border-green-200 px-3 py-0.5 rounded-full font-heading">
                      <KeyRound className="w-3.5 h-3.5 text-[#2E7D32]" />
                      {devOtp ? (
                        <span>
                          Dev OTP: <strong className="font-mono text-[#1F2937]">{devOtp}</strong>
                        </span>
                      ) : (
                        <span>
                          Demo Bypass: <strong className="font-mono text-[#1F2937]">123456</strong>
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <Button type="submit" variant="primary" fullWidth disabled={!isValidOtp || isLoading} className="text-[15px] py-3 flex items-center justify-center gap-2">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Login to Dashboard</span>
                  )}
                </Button>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[13px] font-semibold">
                  <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || isResending || isLoading} className="text-[#2E7D32] hover:underline disabled:text-gray-400 flex items-center gap-1 font-heading">
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    <span>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : isResending ? 'Sending...' : 'Resend OTP'}
                    </span>
                  </button>
                  <button type="button" onClick={handleChangeNumber} disabled={isLoading} className="text-[#6B7280] hover:text-[#1F2937]">
                    Change number
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-[11px] text-[#6B7280]">
          By continuing, you agree to KrishiSync's{' '}
          <span className="underline font-bold text-[#2E7D32] cursor-pointer">Terms of Service</span> &amp;{' '}
          <span className="underline font-bold text-[#2E7D32] cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
