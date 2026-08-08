import React from 'react';
import { Tractor } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { EmptyState, Button } from '../../components/common';

const AgriPoolPage = () => {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col">
      <PageHeader title="AgriPool" />
      <div className="flex-1 p-4 flex items-center justify-center">
        <EmptyState 
          icon={Tractor}
          title="Coming Soon"
          description="Tractor sharing and rental network coming soon."
          action={<Button variant="outline">Learn More</Button>}
        />
      </div>
    </div>
  );
};

export default AgriPoolPage;
