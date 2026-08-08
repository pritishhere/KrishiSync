import React from 'react';
import { Camera, Scan } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const ScannerPage = () => (
  <div className="p-4 flex flex-col h-full">
    <h2 className="text-xl font-bold text-gray-800 mb-4">Identify Crop Disease</h2>
    
    <div className="flex-1 bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-white p-6 relative overflow-hidden shadow-inner min-h-[300px]">
      <div className="absolute inset-4 border-2 border-white/20 rounded-xl pointer-events-none">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-xl"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-xl"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-xl"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-xl"></div>
      </div>
      
      <Camera size={48} className="mb-4 text-green-500 animate-pulse" />
      <p className="text-center font-medium">Position the affected leaf<br/>inside the frame</p>
    </div>
    
    <div className="mt-6 flex gap-4">
      <Button variant="outline" className="flex-1">Gallery</Button>
      <Button className="flex-[2]" icon={Scan}>Capture Photo</Button>
    </div>
    
    <Card className="mt-6 bg-blue-50 border-blue-100">
      <p className="text-sm text-blue-800">
        <strong>Tip:</strong> Ensure good lighting and a clear background for accurate Plant.id results.
      </p>
    </Card>
  </div>
);

export default ScannerPage;
