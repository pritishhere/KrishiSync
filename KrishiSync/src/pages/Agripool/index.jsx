import React from 'react';
import { Tractor } from 'lucide-react';
import PlaceholderPage from '../../components/common/PlaceholderPage';

const AgriPoolPage = () => (
  <PlaceholderPage 
    title="AgriPool" 
    description="Rent and share farming equipment locally." 
    icon={Tractor} 
    colorClass="bg-amber-100 text-amber-600" 
  />
);

export default AgriPoolPage;
