import { useState } from 'react';
import { API_BASE_URL } from '../services/apiConfig';

export default function PhoneOtpAuth() {
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('SEND');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  const handleSendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setStep('VERIFY');
          setMessage(`OTP dispatched to ${phoneNumber}. (Dev OTP: ${data.devOtp || '123456'})`);
        } else {
          setMessage(data.error || 'Failed to send OTP');
        }
      })
      .catch((_err) => {
        setLoading(false);
        setMessage('Network error sending OTP');
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setStep('LOGGED_IN');
          setUser(data.user);
          setMessage('Verified successfully! Session Token generated.');
        } else {
          setMessage(data.error || 'Invalid OTP');
        }
      })
      .catch((_err) => {
        setLoading(false);
        setMessage('Network error verifying OTP');
      });
  };

  return (
    <div className="w-full h-full flex flex-col justify-between space-y-3">
      <p className="text-xs text-gray-600">
        Passwordless mobile authentication via Twilio SMS OTP & 30-day JWT sessions:
      </p>

      {step === 'SEND' && (
        <form onSubmit={handleSendOtp} className="space-y-2">
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Mobile Number (+91...)"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold bg-white text-gray-900 focus:ring-2 focus:ring-[#166534] focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#166534] hover:bg-green-800 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2"
          >
            {loading ? 'Sending OTP...' : '📲 Dispatch SMS OTP'}
          </button>
        </form>
      )}

      {step === 'VERIFY' && (
        <form onSubmit={handleVerifyOtp} className="space-y-2">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP (123456)"
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold text-center bg-white text-gray-900 focus:ring-2 focus:ring-[#166534] focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2"
          >
            {loading ? 'Verifying...' : '✅ Confirm OTP & Login'}
          </button>
        </form>
      )}

      {step === 'LOGGED_IN' && user && (
        <div className="bg-indigo-50/80 p-3 rounded-xl border border-indigo-200 text-xs flex justify-between items-center">
          <div>
            <p className="font-extrabold text-indigo-900 m-0">
              🎉 Farmer: {user.name} ({user.phoneNumber})
            </p>
            <p className="text-[10px] text-indigo-700 m-0 mt-0.5 font-bold">
              🔒 Session Status: Active & Verified
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep('SEND');
              setUser(null);
              setMessage('');
            }}
            className="px-2.5 py-1 bg-white text-gray-700 rounded-lg text-[10px] font-bold border border-gray-300"
          >
            Reset
          </button>
        </div>
      )}

      {message && (
        <p className="text-[11px] font-semibold text-indigo-800 m-0">
          {message}
        </p>
      )}
    </div>
  );
}
