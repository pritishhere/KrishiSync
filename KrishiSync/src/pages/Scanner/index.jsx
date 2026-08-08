import React, { useState } from 'react';
import { Camera, Scan, Info, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { Button, IconButton, BodyText, Modal } from '../../components/common';
import PageHeader from '../../components/layout/PageHeader';

const ScannerPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#1F2937]">
      <PageHeader 
        title="Scan Leaf" 
        showBack={false} 
        rightAction={<IconButton icon={Info} variant="ghost" className="text-white hover:bg-gray-800" onClick={() => setModalOpen(true)}/>}
      />
      <style>{`.bg-\\[\\#FFFFFF\\] { background-color: #1F2937; border-bottom-color: #374151; } .text-\\[\\#1F2937\\] { color: white; }`}</style>
      
      <div className="flex-1 flex flex-col p-4 relative">
        <div className="flex-1 rounded-[24px] border-2 border-[#2E7D32] bg-black/50 overflow-hidden relative flex flex-col items-center justify-center">
          <div className="w-[70%] aspect-square border-2 border-[#2E7D32]/50 rounded-[24px] relative">
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#10B981] rounded-tl-[24px]"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#10B981] rounded-tr-[24px]"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#10B981] rounded-bl-[24px]"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#10B981] rounded-br-[24px]"></div>
          </div>
          <BodyText className="text-white mt-6 bg-black/60 px-4 py-2 rounded-full">Center leaf in the frame</BodyText>
        </div>

        <div className="flex gap-4 mt-6 pb-2">
          <Button variant="ghost" className="bg-[#374151] text-white hover:bg-[#4B5563] flex-1" icon={ImageIcon}>Gallery</Button>
          <Button variant="primary" className="flex-[2] text-[18px]" icon={Scan}>Capture</Button>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Scanning Tips">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-[#10B981] shrink-0 mt-0.5" />
            <BodyText>Ensure good lighting, preferably daylight.</BodyText>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="text-[#10B981] shrink-0 mt-0.5" />
            <BodyText>Focus on a single, clear leaf.</BodyText>
          </div>
          <Button fullWidth onClick={() => setModalOpen(false)} className="mt-4">Got it</Button>
        </div>
      </Modal>
    </div>
  );
};
export default ScannerPage;
