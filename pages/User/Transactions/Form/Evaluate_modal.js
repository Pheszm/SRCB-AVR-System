// components/Forms/Evaluate_modal.js
import { useState } from 'react';

export default function EvaluateModal({ transaction, onClose, onSubmit }) {
  const [evaluations, setEvaluations] = useState(
    transaction.needed.map(n => ({
      needed_id: n.needed_id,
      equipment_id: n.equipment.equipment_id, 
      equipment_name: n.equipment.name,
      condition: 'None',
    }))
  );

  const handleChange = (needed_id, newCondition) => {
    setEvaluations(prev =>
      prev.map(item =>
        item.needed_id === needed_id ? { ...item, condition: newCondition } : item
      )
    );
  };

  const handleSubmit = () => {
    onSubmit(evaluations);
  };

  return (
    <div>
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Evaluate Returned Equipment</h2>
        {evaluations.map(item => (
          <div key={item.needed_id} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">{item.equipment_name}</label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={item.condition}
              onChange={(e) => handleChange(item.needed_id, e.target.value)}
            >
              <option value="None">None</option>
              <option value="Minor_Damage">Minor Damage</option>
              <option value="Major_Damage">Major Damage</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
        </div>
      </div>
    </div>
  );
}
