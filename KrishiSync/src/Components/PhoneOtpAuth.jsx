import { useState } from 'react';

export default function PhoneOtpAuth() {
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('SEND'); // SEND | VERIFY | LOGGED_IN
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    fetch('http://localhost:5000/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          setStep('VERIFY');
          setMessage(`OTP dispatched via Twilio SMS to ${phoneNumber}. (Dev OTP: ${data.devOtp || '123456'})`);
        } else {
          setMessage(data.error || 'Failed to send OTP');
        }
      })
      .catch((err) => {
        setLoading(false);
        setMessage('Network error sending OTP');
      });
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    fetch('http://localhost:5000/api/auth/verify-otp', {
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
          setToken(data.token);
          setMessage('Verified successfully! JWT Session Token generated.');
        } else {
          setMessage(data.error || 'Invalid OTP');
        }
      })
      .catch((err) => {
        setLoading(false);
        setMessage('Network error verifying OTP');
      });
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#eff6ff',
      borderRadius: '8px',
      border: '1px solid #bfdbfe',
      color: '#1e3a8a'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#1d4ed8' }}>
        📱 Farmer Mobile OTP Authentication (Twilio SMS + JWT)
      </h3>

      {step === 'SEND' && (
        <form onSubmit={handleSendOtp} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter Mobile Number (+91...)"
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #93c5fd', flex: 1 }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Sending...' : '📲 Send OTP SMS'}
          </button>
        </form>
      )}

      {step === 'VERIFY' && (
        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP (e.g. 123456)"
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #93c5fd', flex: 1 }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#16a34a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Verifying...' : '✅ Verify OTP'}
          </button>
        </form>
      )}

      {step === 'LOGGED_IN' && user && (
        <div style={{ backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '6px', border: '1px solid #93c5fd' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#15803d', fontSize: '14px' }}>
            🎉 Authenticated Farmer: {user.name} ({user.phoneNumber})
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
            JWT Session Token: <code style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{token.substring(0, 30)}...</code>
          </p>
        </div>
      )}

      {message && (
        <p style={{ marginTop: '8px', marginBottom: 0, fontSize: '12px', fontWeight: '500', color: '#1e40af' }}>
          {message}
        </p>
      )}
    </div>
  );
}
