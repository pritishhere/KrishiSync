import React from 'react';
import { MessageCircle } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { EmptyState, Button } from '../../components/common';

const BotGuidePage = () => {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col">
      <PageHeader title="Krishi Bot" />
      <div className="flex-1 p-4 flex items-center justify-center">
        <EmptyState 
          icon={MessageCircle}
          title="Coming Soon"
          description="Voice-based AI assistant for all farming queries."
          action={<Button variant="outline">Learn More</Button>}
        />
      </div>
    </div>
  );
};

export default BotGuidePage;
