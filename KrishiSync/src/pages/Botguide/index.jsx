import React, { useState } from 'react';
import { MessageSquare, Sparkles, CheckCircle2, Copy, Smartphone } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';

export const BotGuidePage = () => {
  const [copiedCmd, setCopiedCmd] = useState('');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const commands = [
    {
      id: 'rate',
      command: 'RATE WHEAT',
      description: 'Sends real-time Mandi market rates for Wheat (or any crop) directly to your phone via SMS/WhatsApp.',
      exampleReply: 'KrishiSync Bot: Azadpur Mandi Rate: ₹2,350/qtl. Highest Net Profit: ₹10,925.',
    },
    {
      id: 'weather',
      command: 'WEATHER',
      description: 'Get automated 24-hour rainfall forecast & irrigation pump guidance.',
      exampleReply: 'KrishiSync Bot: Alert 80% chance of rain tomorrow. Do not run pump today. Saved ₹500.',
    },
  ];

  const handleCopyCommand = (cmdText) => {
    navigator.clipboard?.writeText?.(cmdText);
    setCopiedCmd(cmdText);
    setTimeout(() => {
      setCopiedCmd('');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] font-body relative">
      <PageHeader title="Bot Guide & SMS Assistant" showBack={false} />

      <div className="flex-1 overflow-y-auto pb-8 space-y-5 p-4">
        {/* Intro Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-2">
          <span className="text-[12px] font-bold text-[#2E7D32] bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200 font-heading inline-block">
            Low-Literacy AI Access
          </span>
          <h2 className="text-[22px] font-extrabold font-heading text-[#1F2937] leading-snug">
            Farm Assistant via WhatsApp &amp; SMS
          </h2>
          <p className="text-[14px] font-medium text-[#6B7280] leading-relaxed">
            No smartphone app required! Send simple text messages or voice notes to our automated bot number for instant market rates and weather alerts.
          </p>
        </div>

        {/* MOCK PHONE / SMS VISUAL PREVIEW */}
        <div className="bg-[#0F2D1E] rounded-2xl p-4 text-white border-2 border-emerald-950 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#2E7D32] rounded-full flex items-center justify-center text-white shrink-0">
                <Smartphone size={16} />
              </div>
              <span className="text-[13px] font-extrabold font-heading text-[#D8FF36]">
                KrishiSync Bot (+91 8000-123-456)
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-200 shrink-0">Live SMS Mock</span>
          </div>

          {/* Chat Bubble 1: Sent Command */}
          <div className="flex flex-col items-end space-y-1">
            <div className="bg-[#2E7D32] text-white px-3.5 py-2 rounded-2xl rounded-tr-none text-[13px] font-extrabold font-heading shadow-xs">
              RATE WHEAT
            </div>
            <span className="text-[10px] text-emerald-200/80">12:30 PM • SMS</span>
          </div>

          {/* Chat Bubble 2: Bot Reply */}
          <div className="flex flex-col items-start space-y-1">
            <div className="bg-white text-[#1F2937] p-3 rounded-2xl rounded-tl-none text-[13px] font-medium leading-relaxed shadow-xs space-y-1">
              <p className="font-bold text-[#2E7D32] font-heading flex items-center gap-1">
                <Sparkles size={14} /> KrishiSync Market Bot:
              </p>
              <p>🌾 Wheat Rate at Azadpur Mandi: <strong>₹2,350/qtl</strong></p>
              <p className="text-[12px] text-[#6B7280]">Transport Cost: ₹450 • Estimated Profit: ₹10,925</p>
            </div>
            <span className="text-[10px] text-emerald-200/80">12:30 PM • Automated Reply</span>
          </div>
        </div>

        {/* COMMAND INSTRUCTIONS & GUIDES */}
        <div className="space-y-3">
          <h3 className="text-[17px] font-bold font-heading text-[#1F2937] px-1">
            Supported Commands &amp; Formats
          </h3>

          {commands.map((cmd) => (
            <div
              key={cmd.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="bg-emerald-50 text-[#2E7D32] font-extrabold font-heading text-[15px] px-3 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <code>{cmd.command}</code>
                </div>

                <button
                  onClick={() => handleCopyCommand(cmd.command)}
                  className="text-[12px] font-bold text-[#2E7D32] hover:text-green-800 flex items-center gap-1 cursor-pointer bg-green-50 px-2.5 py-1 rounded-lg border border-green-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2E7D32]"
                  aria-label={`Copy command ${cmd.command}`}
                >
                  {copiedCmd === cmd.command ? (
                    <>
                      <CheckCircle2 size={14} className="text-[#10B981]" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Text
                    </>
                  )}
                </button>
              </div>

              <p className="text-[13px] font-medium text-[#6B7280] leading-relaxed">
                {cmd.description}
              </p>

              <div className="bg-[#F9FAFB] p-2.5 rounded-xl border border-gray-200 text-[12px] text-[#1F2937] font-mono">
                <strong className="text-[#2E7D32]">Example Response:</strong> {cmd.exampleReply}
              </div>
            </div>
          ))}
        </div>

        {/* LARGE WHATSAPP TEST BUTTON PLACEHOLDER */}
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 text-center space-y-3">
          <h4 className="text-[16px] font-bold font-heading text-[#2E7D32]">
            Test KrishiSync WhatsApp Assistant
          </h4>
          <p className="text-[13px] font-medium text-[#6B7280]">
            Experience how easy it is for farmers to receive market updates and voice guidance over WhatsApp.
          </p>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowWhatsAppModal(true)}
            className="text-[15px] py-3.5 bg-[#10B981] hover:bg-[#0e9f6e] text-white border-none flex items-center justify-center gap-2 font-heading shadow-sm"
          >
            <MessageSquare size={20} />
            Test on WhatsApp (Demo)
          </Button>
        </div>
      </div>

      {/* WHATSAPP DEMO MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-[380px] w-full p-6 text-center space-y-4 shadow-2xl border border-gray-200 font-body">
            <div className="w-16 h-16 bg-emerald-100 text-[#10B981] rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <MessageSquare size={32} />
            </div>

            <div className="space-y-1">
              <h3 className="text-[20px] font-extrabold font-heading text-[#1F2937]">
                WhatsApp Assistant Demo
              </h3>
              <p className="text-[13px] font-medium text-[#6B7280] leading-relaxed">
                In production, clicking this button opens WhatsApp chat with preset message <code>RATE WHEAT</code> directly sent to our automated AI hotline.
              </p>
            </div>

            <div className="bg-[#F9FAFB] p-3 rounded-xl border border-gray-200 text-[12px] text-left space-y-1">
              <p className="font-bold text-[#2E7D32]">Hotline Number:</p>
              <code className="text-[13px] font-bold text-[#1F2937]">+91 8000-123-456</code>
            </div>

            <Button
              variant="primary"
              fullWidth
              onClick={() => setShowWhatsAppModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotGuidePage;
