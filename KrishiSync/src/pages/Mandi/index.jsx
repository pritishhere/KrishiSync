import React from 'react';
import { TrendingUp } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader';
import { EmptyState, Button } from '../../components/common';

const MandiPage = () => {
  return (
    <div className="h-full bg-[#F9FAFB] flex flex-col">
      <PageHeader title="Mandi Prices" />
      <div className="flex-1 p-4 flex items-center justify-center">
        <EmptyState 
          icon={TrendingUp}
          title="Coming Soon"
          description="Real-time market rates are being built by the backend team."
          action={<Button variant="outline">Learn More</Button>}
        />
      </div>
    </div>
  );
};

export default MandiPage;
