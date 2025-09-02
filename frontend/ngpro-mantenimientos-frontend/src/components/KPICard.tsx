import React from 'react';

interface KPICardProps {
  label: string;
  value: number;
  color?: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, color = 'bg-gray-600' }) => (
  <div className={`rounded shadow p-4 text-white w-40 flex flex-col items-center ${color}`}>
    <span className="text-lg font-semibold">{label}</span>
    <span className="text-3xl font-bold mt-2">{value}</span>
  </div>
);

export default KPICard;
