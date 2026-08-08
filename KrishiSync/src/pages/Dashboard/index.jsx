import React from 'react';
import { Sun, Camera, AlertCircle, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Card, Button, Alert, AlertBanner, H1, H2, SmallText } from '../../components/common';

const DashboardPage = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <AlertBanner variant="warning">
        <AlertCircle size={18} /> High chance of rain tomorrow in your area.
      </AlertBanner>
      
      <div className="px-4 space-y-6 pt-2">
        <div className="flex justify-between items-center">
          <div>
            <SmallText>Good Morning,</SmallText>
            <H1>{user?.name}</H1>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1 text-[#F57C00]">
              <Sun size={24} className="fill-current" />
              <H2>32°C</H2>
            </div>
            <SmallText className="flex items-center gap-1"><MapPin size={12}/> Pune, MH</SmallText>
          </div>
        </div>

        <Card padding="p-0" className="border-2 border-[#2E7D32]/20 relative">
          <div className="p-6 bg-gradient-to-br from-[#2E7D32] to-[#1f5c24] text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[70%]">
                <h3 className="text-[20px] font-bold mb-1">Crop Health Scanner</h3>
                <p className="text-[14px] text-green-100 font-medium leading-relaxed">Instantly detect diseases and get treatment recommendations.</p>
              </div>
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Camera size={32} />
              </div>
            </div>
            <Button variant="secondary" fullWidth onClick={() => navigate('/scanner')}>
              Open Camera
            </Button>
          </div>
        </Card>

        <div>
          <H2 className="mb-3">Farm Updates</H2>
          <div className="space-y-3">
            <Alert variant="success" title="Mandi Prices Up" description="Wheat is currently trading at ₹2,275/qtl (+₹50 today)." />
            <Alert variant="danger" title="Pest Alert Nearby" description="Fall Armyworm reported in neighboring farms. Inspect crops." />
          </div>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
