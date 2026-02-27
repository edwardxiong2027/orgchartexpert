import { useState } from "react";
import { X, Plus, FileText } from "lucide-react";
import { createChart } from "../firebase/chartService";
import { UNITS } from "../constants/units";
import toast from "react-hot-toast";

export default function CreateChartModal({ userId, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a chart name");
      return;
    }
    if (!unit) {
      toast.error("Please select a unit");
      return;
    }

    setSaving(true);
    try {
      const chartId = await createChart(userId, { name: name.trim(), unit });
      toast.success(`Created "${name.trim()}"`);
      onCreated({ id: chartId, name: name.trim(), unit });
    } catch (err) {
      toast.error("Failed to create chart: " + err.message);
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            <h2 className="text-lg font-bold text-gray-800">New Org Chart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Chart Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Chart Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Library Main Org Chart"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Unit Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Unit *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {UNITS.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => setUnit(u.value)}
                  className={`relative px-4 py-3 rounded-xl border-2 transition-all font-semibold text-sm
                    ${unit === u.value
                      ? "border-current scale-[1.02] shadow-md"
                      : "border-gray-200 hover:border-gray-300"}`}
                  style={{
                    backgroundColor: unit === u.value ? u.bg : "white",
                    color: unit === u.value ? u.color : "#6B7280",
                  }}
                >
                  {u.label}
                  {unit === u.value && (
                    <div
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px]"
                      style={{ backgroundColor: u.color }}
                    >
                      &#10003;
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            {saving ? "Creating..." : "Create Chart"}
          </button>
        </form>
      </div>
    </div>
  );
}
