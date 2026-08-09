import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, CheckCircle2, Copy, Smartphone } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { botService } from '../../services/botService';

export const BotGuidePage = () => {
  const [copiedCmd, setCopiedCmd] = useState('');
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [commands, setCommands] = useState([]);
  const [whatsAppConfig, setWhatsAppConfig] = useState({ hotline: '+91 8000-123-456', presetMessage: 'RATE WHEAT' });

  // Fetch bot commands & WhatsApp config on mount
  useEffect(() => {
    botService.getBotCommandsList().then((data) => {
      setCommands(data);
    });
    botService.getWhatsAppConfig().then((cfg) => {
      setWhatsAppConfig(cfg);
    });
  }, []);

  const handleCopyCommand = (cmdText) => {
    navigator.clipboard?.writeText?.(cmdText);
    setCopiedCmd(cmdText);
    setTimeout(() => {
      setCopiedCmd('');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-linear-to-b from-[#f8faf6] via-[#f0f7ef] to-[#f8faf6] font-body min-h-screen">
      <PageHeader title="2G SMS & WhatsApp Voice Assistant" showBack={false} />

      <div className="flex-1 overflow-y-auto pb-12 space-y-6 p-4 sm:p-8 max-w-5xl mx-auto w-full">
        {/* Intro Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl border border-emerald-500/20">
          <span className="text-xs font-black text-emerald-800 bg-emerald-100/90 px-3.5 py-1 rounded-full border border-emerald-300 font-heading inline-block shadow-2xs">
            ✨ Low-Literacy Voice & SMS Access
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-gray-900 leading-snug">
            Farm Assistant via WhatsApp &amp; Offline SMS
          </h2>
          <p className="text-base font-medium text-gray-700 leading-relaxed">
            No smartphone app required! Send simple text messages or voice notes to our automated bot number for instant market rates and weather alerts.
          </p>
        </div>

        {/* MOCK PHONE / SMS VISUAL PREVIEW */}
        <div className="bg-[#1f2937] rounded-md p-4 text-white border border-[#4b5563] shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#4b5563] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#2d5a27] rounded-full flex items-center justify-center text-white shrink-0">
                <Smartphone size={16} />
              </div>
              <span className="text-[13px] font-extrabold font-heading text-[#e8e0d5]">
                KrishiSync Bot ({whatsAppConfig.hotline})
              </span>
            </div>
            <span className="text-[11px] font-bold text-gray-300 shrink-0">Live SMS Mock</span>
          </div>

          {/* Chat Bubble 1: Sent Command */}
          <div className="flex flex-col items-end space-y-1">
            <div className="bg-[#2d5a27] text-white px-3.5 py-2 rounded-md rounded-tr-none text-[13px] font-extrabold font-heading shadow-sm">
              {whatsAppConfig.presetMessage}
            </div>
            <span className="text-[10px] text-gray-400">12:30 PM • SMS</span>
          </div>

          {/* Chat Bubble 2: Bot Reply */}
          <div className="flex flex-col items-start space-y-1">
            <div className="bg-white text-gray-900 p-3 rounded-md rounded-tl-none text-[13px] font-medium leading-relaxed shadow-sm space-y-1">
              <p className="font-bold text-[#2d5a27] font-heading flex items-center gap-1">
                <Sparkles size={14} /> KrishiSync Market Bot:
              </p>
              <p>Wheat Rate at Azadpur Mandi: <strong>₹2,350/qtl</strong></p>
              <p className="text-[12px] text-gray-600">Transport Cost: ₹450 • Estimated Profit: ₹10,925</p>
            </div>
            <span className="text-[10px] text-gray-400">12:30 PM • Automated Reply</span>
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
              className="bg-white rounded-md border border-[#e2dcd0] shadow-sm p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="bg-[#e8e0d5] text-[#2d5a27] font-extrabold font-heading text-[15px] px-3 py-1 rounded-md border border-[#e2dcd0] flex items-center gap-1.5">
                  <code>{cmd.command}</code>
                </div>

                <button
                  onClick={() => handleCopyCommand(cmd.command)}
                  className="text-[12px] font-bold text-[#2d5a27] hover:text-[#1a3816] flex items-center gap-1 cursor-pointer bg-[#f9f8f6] px-2.5 py-1 rounded-md border border-[#e2dcd0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2d5a27]"
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

              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                {cmd.description}
              </p>

              <div className="bg-[#f9f8f6] p-2.5 rounded-md border border-[#e2dcd0] text-[12px] text-gray-900 font-mono">
                <strong className="text-[#2d5a27]">Example Response:</strong> {cmd.exampleReply}
              </div>
            </div>
          ))}
        </div>

        {/* LARGE WHATSAPP TEST BUTTON PLACEHOLDER */}
        <div className="bg-[#e8e0d5] rounded-md border border-[#e2dcd0] p-5 text-center space-y-3">
          <h4 className="text-[16px] font-bold font-heading text-[#2d5a27]">
            Test KrishiSync WhatsApp Assistant
          </h4>
          <p className="text-[13px] font-medium text-gray-600">
            Experience how easy it is for farmers to receive market updates and voice guidance over WhatsApp.
          </p>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => setShowWhatsAppModal(true)}
            className="text-[15px] py-3.5 bg-[#2d5a27] hover:bg-[#1a3816] text-white border-none flex items-center justify-center gap-2 font-heading shadow-sm"
          >
            <MessageSquare size={20} />
            Test on WhatsApp (Demo)
          </Button>
        </div>
      </div>

      {/* WHATSAPP DEMO MODAL */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md max-w-[380px] w-full p-6 text-center space-y-4 shadow-sm border border-[#e2dcd0] font-body">
            <div className="w-16 h-16 bg-[#e8e0d5] text-[#2d5a27] rounded-full flex items-center justify-center mx-auto border border-[#e2dcd0]">
              <MessageSquare size={32} />
            </div>

            <div className="space-y-1">
              <h3 className="text-[20px] font-extrabold font-heading text-gray-900">
                WhatsApp Assistant Demo
              </h3>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                In production, clicking this button opens WhatsApp chat with preset message <code>{whatsAppConfig.presetMessage}</code> directly sent to our automated AI hotline.
              </p>
            </div>

            <div className="bg-[#f9f8f6] p-3 rounded-md border border-[#e2dcd0] text-[12px] text-left space-y-1">
              <p className="font-bold text-[#2d5a27]">Hotline Number:</p>
              <code className="text-[13px] font-bold text-gray-900">{whatsAppConfig.hotline}</code>
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
