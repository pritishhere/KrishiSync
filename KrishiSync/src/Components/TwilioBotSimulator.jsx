import { useState } from 'react';

export default function TwilioBotSimulator() {
  const [command, setCommand] = useState('WATER');
  const [loading, setLoading] = useState(false);
  const [cleanMessage, setCleanMessage] = useState('');
  const [time, setTime] = useState('');

  const sendCommand = (cmd) => {
    setLoading(true);
    fetch('http://localhost:5000/api/twilio/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ Body: cmd, From: '+919876543210' })
    })
      .then((res) => res.text())
      .then((xmlData) => {
        // Extract text between <Message>...</Message> tags
        const match = xmlData.match(/<Message>([\s\S]*?)<\/Message>/);
        let extractedText = match ? match[1] : xmlData;
        // Unescape XML entities
        extractedText = extractedText
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');

        setCleanMessage(extractedText);
        setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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
      backgroundColor: '#f0fdf4',
      borderRadius: '8px',
      border: '1px solid #bbf7d0',
      color: '#14532d'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#166534' }}>
          📱 Twilio WhatsApp & SMS Bot Chat Simulator
        </h3>
        <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#dcfce7', borderRadius: '12px', fontWeight: 'bold', color: '#15803d' }}>
          WhatsApp + 2G SMS Active
        </span>
      </div>

      <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0' }}>
        Test texting keywords to simulate what a farmer receives directly on their mobile phone:
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['WATER', 'WEATHER', 'PRICE', 'DISEASE', 'HELP'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setCommand(cmd);
              sendCommand(cmd);
            }}
            style={{
              padding: '6px 14px',
              backgroundColor: command === cmd ? '#15803d' : '#ffffff',
              color: command === cmd ? '#ffffff' : '#15803d',
              border: '1px solid #86efac',
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

      {cleanMessage && (
        <div style={{
          backgroundColor: '#efeae2',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          maxWidth: '420px'
        }}>
          {/* User Outgoing Bubble */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
            <div style={{
              backgroundColor: '#d9fdd3',
              padding: '8px 12px',
              borderRadius: '8px 0px 8px 8px',
              fontSize: '13px',
              color: '#111b21',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <strong>{command}</strong>
              <span style={{ fontSize: '10px', color: '#667781', marginLeft: '12px' }}>{time} ✔✔</span>
            </div>
          </div>

          {/* Bot Incoming Reply Bubble */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '10px 14px',
              borderRadius: '0px 8px 8px 8px',
              fontSize: '13px',
              color: '#111b21',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.4'
            }}>
              {cleanMessage}
              <div style={{ textAlign: 'right', fontSize: '10px', color: '#667781', marginTop: '4px' }}>
                {time}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
