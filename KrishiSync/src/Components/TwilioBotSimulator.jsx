import { useState } from 'react';
import { API_BASE_URL } from '../services/apiConfig';

export default function TwilioBotSimulator() {
  const [command, setCommand] = useState('WATER');
  const [loading, setLoading] = useState(false);
  const [cleanMessage, setCleanMessage] = useState('');
  const [time, setTime] = useState('');

  const sendCommand = (cmd) => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/twilio/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ Body: cmd, From: '+919876543210' })
    })
      .then((res) => res.text())
      .then((xmlData) => {
        const match = xmlData.match(/<Message>([\s\S]*?)<\/Message>/);
        let extractedText = match ? match[1] : xmlData;
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
    <div className="w-full h-full flex flex-col justify-between space-y-3">
      <p className="text-xs text-gray-600">
        Simulate 2G SMS & WhatsApp advisory keywords sent by farmers without smartphones:
      </p>

      <div className="flex flex-wrap gap-1.5">
        {['WATER', 'WEATHER', 'PRICE', 'DISEASE', 'HELP'].map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => {
              setCommand(cmd);
              sendCommand(cmd);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs ${
              command === cmd
                ? 'bg-[#166534] text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            Send "{cmd}"
          </button>
        ))}
      </div>

      {loading && (
        <p className="text-xs text-gray-500 italic animate-pulse">
          ⏳ Requesting 2G SMS Gateway Response...
        </p>
      )}

      {cleanMessage && !loading && (
        <div className="bg-[#efeae2] p-3 rounded-xl border border-gray-300 space-y-2 text-xs">
          {/* User Outgoing Bubble */}
          <div className="flex justify-end">
            <div className="bg-[#d9fdd3] px-3 py-1.5 rounded-l-xl rounded-b-xl text-gray-900 shadow-2xs font-medium">
              <strong>{command}</strong>
              <span className="text-[10px] text-gray-500 ml-2">{time} ✔✔</span>
            </div>
          </div>

          {/* Bot Incoming Reply Bubble */}
          <div className="flex justify-start">
            <div className="bg-white p-2.5 rounded-r-xl rounded-b-xl text-gray-900 shadow-2xs whitespace-pre-wrap leading-relaxed">
              {cleanMessage}
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {time}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
