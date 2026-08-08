import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length > 5) {
      login(phone);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-green-600 text-white p-6 justify-center relative">
      <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
        <Leaf size={120} />
      </div>
      
      <div className="z-10 bg-white text-gray-900 p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Leaf className="text-green-600" size={32} fill="currentColor" />
          <h1 className="text-3xl font-black text-green-800">KrishiSync</h1>
        </div>
        <p className="text-gray-500 mb-8 font-medium">Empowering every farmer, everywhere.</p>
        
        <form onSubmit={handleLogin}>
          <Input 
            label="Phone Number" 
            placeholder="Enter mobile number" 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button fullWidth onClick={handleLogin} className="mt-4 text-lg py-4">
            Get OTP
          </Button>
        </form>
        
        <div className="mt-6 flex justify-center gap-4 text-sm text-gray-400">
          <span>English</span> | <span className="text-green-600 font-bold">हिंदी</span> | <span>मराठी</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
