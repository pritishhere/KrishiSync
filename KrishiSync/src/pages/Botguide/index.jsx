import React from 'react';
import { MessageCircle } from 'lucide-react';
import PlaceholderPage from '../../components/common/PlaceholderPage';

const BotGuidePage = () => (
  <PlaceholderPage 
    title="Krishi Bot" 
    description="AI assistant for voice and text queries." 
    icon={MessageCircle} 
    colorClass="bg-purple-100 text-purple-600" 
  />
);

export default BotGuidePage;
