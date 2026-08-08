import React from 'react';
import IconButton from './IconButton';
import { H2 } from './Typography';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#FFFFFF] w-full max-w-md rounded-t-[24px] sm:rounded-[24px] p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <H2>{title}</H2>
          <IconButton icon={X} onClick={onClose} className="-mr-2" />
        </div>
        {children}
      </div>
    </div>
  );
};
export default Modal;
