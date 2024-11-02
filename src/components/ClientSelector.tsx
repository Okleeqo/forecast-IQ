import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useClientStore } from '../stores/clientStore';

export default function ClientSelector() {
  const {
    clients,
    selectedClientId,
    selectClient
  } = useClientStore();

  return (
    <div className="relative">
      <select
        value={selectedClientId || ''}
        onChange={(e) => selectClient(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
      >
        <option value="">Select Client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
    </div>
  );
}