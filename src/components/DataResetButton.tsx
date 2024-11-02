import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { useClientStore } from '../stores/clientStore';

export default function DataResetButton() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { selectedClientId, resetClientData } = useClientStore();

  const handleReset = () => {
    if (selectedClientId) {
      resetClientData(selectedClientId);
      setShowConfirmation(false);
    }
  };

  if (!selectedClientId) return null;

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Reset Data
      </button>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Confirm Reset</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset all subscription data for this client? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}