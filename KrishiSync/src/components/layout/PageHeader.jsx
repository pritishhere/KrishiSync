import React from 'react';
import { H1 } from '../common/Typography';
import IconButton from '../common/IconButton';
import { ArrowLeft } from 'lucide-react';

const PageHeader = ({ title, showBack = false, onBack, rightAction }) => (
  <div className="flex items-center justify-between px-4 py-4 bg-[#FFFFFF] border-b border-gray-100 sticky top-0 z-10">
    <div className="flex items-center gap-2">
      {showBack && <IconButton icon={ArrowLeft} onClick={onBack} className="-ml-2" />}
      <H1>{title}</H1>
    </div>
    {rightAction && <div>{rightAction}</div>}
  </div>
);
export default PageHeader;
