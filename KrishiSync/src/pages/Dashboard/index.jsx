import React from 'react';
import { Sun, Camera, AlertCircle, TrendingUp, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const DashboardPage = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ram Ram,</h2>
          <p className="text-lg text-green-700 font-medium">{user?.name || 'Kisan'}!</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl">
          <Sun size={24} className="fill-orange-400 text-orange-400" />
          <div>
            <span className="font-bold block text-sm">32°C</span>
            <span className="text-xs">Sunny</span>
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white border-0 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-1">Crop Health Scanner</h3>
          <p className="text-green-100 text-sm mb-4">Detect disease early and save your yield.</p>
          <Button variant="secondary" icon={Camera} onClick={() => navigate('/scanner')}>
            Scan Now
          </Button>
        </div>
        <Leaf size={100} className="absolute -bottom-4 -right-4 opacity-20 pointer-events-none" />
      </Card>

      <div>
        <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-orange-500" /> 
          Recent Alerts
        </h3>
        <Card>
          <div className="flex gap-4 items-center border-b border-gray-100 pb-3 mb-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
              <Sun size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Heatwave Warning</h4>
              <p className="text-xs text-gray-500">Irrigate crops in the evening.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-green-100 p-2 rounded-lg text-green-600">
              <TrendingUp size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">Wheat prices up</h4>
              <p className="text-xs text-gray-500">Local mandi rate increased by ₹50/q.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
