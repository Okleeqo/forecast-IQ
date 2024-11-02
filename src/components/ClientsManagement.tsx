import React, { useState } from 'react';
import { useClientStore } from '../stores/clientStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { Building, Plus, Pencil, Trash2 } from 'lucide-react';
import { SubscriptionForm } from './SubscriptionForm';

interface NewClientFormData {
  name: string;
  industry: string;
}

export default function ClientsManagement() {
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientData, setNewClientData] = useState<NewClientFormData>({
    name: '',
    industry: ''
  });

  const { 
    clients, 
    selectedClientId, 
    selectClient, 
    deleteClient,
    addClient 
  } = useClientStore();
  const { 
    data: subscriptionData,
    clearData 
  } = useSubscriptionStore();

  const handleDeleteClient = (clientId: string) => {
    clearData(clientId);
    deleteClient(clientId);
    setShowDeleteConfirm(null);
    if (selectedClientId === clientId) {
      selectClient('');
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(newClientData.name, newClientData.industry);
    setNewClientData({ name: '', industry: '' });
    setShowNewClientForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your clients and their subscription data
          </p>
        </div>
        <button
          onClick={() => setShowNewClientForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => {
          const hasData = Boolean(subscriptionData[client.id]);
          const isSelected = client.id === selectedClientId;

          return (
            <div
              key={client.id}
              className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-colors cursor-pointer ${
                isSelected ? 'border-blue-500' : 'border-transparent hover:border-gray-200'
              }`}
              onClick={() => selectClient(client.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Building className="w-5 h-5 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{client.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      selectClient(client.id);
                      setShowSubscriptionForm(true);
                    }}
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(client.id);
                    }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500 mb-4">Industry: {client.industry}</p>

              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  hasData 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {hasData ? 'Data Available' : 'No Data'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectClient(client.id);
                    setShowSubscriptionForm(true);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {hasData ? 'Update Data' : 'Add Data'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showSubscriptionForm && selectedClientId && (
        <SubscriptionForm 
          onClose={() => setShowSubscriptionForm(false)} 
          clientId={selectedClientId}
          initialData={subscriptionData[selectedClientId]}
        />
      )}

      {/* New Client Form Modal */}
      {showNewClientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Client</h3>
            <form onSubmit={handleAddClient} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={newClientData.name}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={newClientData.industry}
                  onChange={(e) => setNewClientData(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewClientForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Client</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this client? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteClient(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}