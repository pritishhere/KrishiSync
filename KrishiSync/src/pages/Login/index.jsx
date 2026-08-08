import React, { useState } from 'react';
import { Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Button, Input, Badge, H1, H2, BodyText } from '../../components/common';

const LoginPage = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length > 9) {
      login(phone);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] p-6 justify-center relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2E7D32]/5 rounded-full blur-3xl"></div>
      
      <div className="z-10 w-full max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#2E7D32] p-3 rounded-[16px] shadow-sm">
            <Leaf className="text-white" size={40} />
          </div>
          <H1 className="text-[32px] text-[#2E7D32]">KrishiSync</H1>
        </div>
        
        <H2 className="mb-2">Welcome Back / नमस्ते / স্বাগতম</H2>
        <BodyText className="text-[#6B7280] mb-8">Enter your mobile number to access your farm dashboard.</BodyText>
        
        <form onSubmit={handleLogin}>
          <Input 
            label="Mobile Number" 
            placeholder="Enter 10-digit number" 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button fullWidth onClick={handleLogin} className="mt-2">
            Continue securely
          </Button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-4">
          <Badge variant="primary">English</Badge>
          <Badge variant="default">हिन्दी</Badge>
          <Badge variant="default">বাংলা</Badge>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;