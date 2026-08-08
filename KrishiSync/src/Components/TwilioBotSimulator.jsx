import { useState } from 'react';

export default function TwilioBotSimulator() {
  const [command, setCommand] = useState('WATER');
  const [loading, setLoading] = useState(false);
  const [twimlXml, setTwimlXml] = useState('');

  const sendCommand = (cmd) => {
    setLoading(true);
    fetch('http://localhost:5000/api/twilio/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ Body: cmd, From: '+919876543210' })
    })
      .then((res) => res.text())
      .then((data) => {
        setTwimlXml(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Twilio webhook error:', err);
        setLoading(false);
      });
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#faf5ff',
      borderRadius: '8px',
      border: '1px solid #e9d5ff',
      color: '#581c87'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 12px 0', color: '#6b21a8' }}>
        💬 Twilio WhatsApp & SMS Bot Webhook Simulator
      </h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {['WATER', 'WEATHER', 'PRICE', 'DISEASE', 'HELP'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setCommand(cmd);
              sendCommand(cmd);
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: command === cmd ? '#7e22ce' : '#ffffff',
              color: command === cmd ? '#ffffff' : '#6b21a8',
              border: '1px solid #c084fc',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Send "{cmd}"
          </button>
        ))}
      </div>

      {twimlXml && (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #d8b4fe',
          fontSize: '12px'
        }}>
          <strong style={{ color: '#6b21a8' }}>TwiML Response (Sent to WhatsApp / Feature Phone):</strong>
          <pre style={{
            margin: '6px 0 0 0',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            backgroundColor: '#f3e8ff',
            padding: '10px',
            borderRadius: '4px',
            color: '#3b0764'
          }}>
            {twimlXml}
          </pre>
        </div>
      )}
    </div>
  );
}
