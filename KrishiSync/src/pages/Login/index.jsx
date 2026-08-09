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
    <div className="min-h-screen bg-linear-to-br from-[#0c2912] via-[#1b4318] to-[#081b0c] flex flex-col justify-center items-center p-4 sm:p-8 relative overflow-hidden text-white">
      {/* Background Animated Glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md glass-panel-dark p-6 sm:p-10 flex flex-col justify-between relative z-10 shadow-2xl rounded-3xl border border-emerald-400/30">

        <div>
          <div className="flex items-center justify-between mb-8 pt-2">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-emerald-500 to-teal-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center border border-emerald-400/30">
                <Sprout className="h-7 w-7 stroke-[2.3] animate-sway" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Krishi<span className="text-emerald-400">Sync</span>
                </h1>
                <span className="text-[11px] font-black text-emerald-300 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/40 inline-block font-heading">
                  स्मार्ट कृषि मंच 🌾
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-500/40 shadow-inner">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure Session</span>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <span className="text-[12px] font-extrabold text-amber-300 bg-amber-950/70 px-3 py-1 rounded-full border border-amber-500/40 inline-block mb-2 font-heading">
                  Namaste 🌾
                </span>
                <h2 className="text-3xl font-black font-heading text-white leading-tight">
                  Welcome to KrishiSync
                </h2>
                <p className="text-sm font-medium text-emerald-100/90 mt-2 leading-relaxed">
                  Enter your 10-digit mobile number to access real-time mandi prices, disease scanner, and agripool options.
                </p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="phone-input" className="block text-xs font-black text-emerald-200 uppercase tracking-wider font-heading">
                    Mobile Number <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 flex items-center gap-1 text-emerald-300 font-extrabold text-sm pointer-events-none border-r border-emerald-500/40 pr-3 font-heading">
                      <span>IND +91</span>
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
                      className="w-full h-12 bg-white/10 border border-emerald-400/40 text-white placeholder-emerald-300/50 text-base font-extrabold rounded-xl pl-24 pr-10 outline-none transition-all focus:bg-white/20 focus:border-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-400 shadow-inner"
                    />
                    {isValidPhone && (
                      <div className="absolute right-3 text-emerald-400">
                        <CheckCircle2 className="w-5 h-5 stroke-[2.3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-emerald-200/80 flex justify-between items-center px-1">
                    <span>Valid 10-digit Indian mobile number</span>
                    <span className="font-bold text-white">{phone.length}/10</span>
                  </p>
                </div>

                {error && (
                  <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-[13px] font-bold flex items-center gap-2 shadow-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
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
                className="text-[12px] font-bold text-[#2d5a27] hover:underline flex items-center gap-1 bg-[#e8e0d5] px-2.5 py-1 rounded-md border border-[#e2dcd0] cursor-pointer font-heading"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to Phone Entry</span>
              </button>

              <div>
                <h2 className="text-2xl font-black font-heading text-gray-900 leading-tight">Verify OTP Code</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[13px] text-gray-600">
                    Sent to <strong className="text-gray-900 font-bold">+91 {phone}</strong>
                  </p>
                  <button type="button" onClick={handleChangeNumber} className="text-[12px] font-bold text-[#2d5a27] hover:underline flex items-center gap-0.5 font-heading">
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-[13px] font-bold flex items-center gap-2 shadow-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[13px] font-bold text-gray-900 text-center font-heading">
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
                        className={`w-10 h-12 sm:w-11 sm:h-14 text-center text-xl font-extrabold rounded-md border outline-none font-heading transition-all shadow-sm ${
                          error
                            ? 'border-red-500 bg-red-50 text-red-600 focus-visible:ring-2 focus-visible:ring-red-500'
                            : otp[idx]
                              ? 'border-[#2d5a27] bg-[#e8e0d5] text-gray-900'
                              : 'border-[#e2dcd0] bg-[#f9f8f6] text-gray-900 focus:bg-white focus:border-[#2d5a27] focus-visible:ring-2 focus-visible:ring-[#2d5a27]'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#2d5a27] bg-[#e8e0d5] border border-[#e2dcd0] px-3 py-0.5 rounded-md font-heading">
                      <KeyRound className="w-3.5 h-3.5 text-[#2d5a27]" />
                      {devOtp ? (
                        <span>
                          Dev OTP: <strong className="font-mono text-gray-900">{devOtp}</strong>
                        </span>
                      ) : (
                        <span>
                          Demo Bypass: <strong className="font-mono text-gray-900">123456</strong>
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

                <div className="flex items-center justify-between pt-2 border-t border-[#e2dcd0] text-[13px] font-semibold">
                  <button type="button" onClick={handleResendOtp} disabled={resendTimer > 0 || isResending || isLoading} className="text-[#2d5a27] hover:underline disabled:text-gray-400 flex items-center gap-1 font-heading">
                    <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                    <span>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : isResending ? 'Sending...' : 'Resend OTP'}
                    </span>
                  </button>
                  <button type="button" onClick={handleChangeNumber} disabled={isLoading} className="text-gray-500 hover:text-gray-900">
                    Change number
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-[11px] text-gray-500">
          By continuing, you agree to KrishiSync's{' '}
          <span className="underline font-bold text-[#2d5a27] cursor-pointer">Terms of Service</span> &amp;{' '}
          <span className="underline font-bold text-[#2d5a27] cursor-pointer">Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}
