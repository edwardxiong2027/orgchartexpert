import { useState } from "react";
import { X, Plus, User, Briefcase, Building2, Palette } from "lucide-react";
import { addOrgMember } from "../firebase/orgService";
import toast from "react-hot-toast";

const COLORS = [
  "#1B3A5C", "#2E6B8A", "#4A90B8", "#C4956A", "#5B8C5A",
  "#8B5E83", "#C4564A", "#D4A03C", "#6B7B8D", "#999999",
];

export default function AddPersonModal({ members, onClose, preselectedSupervisor }) {
  const [form, setForm] = useState({
    name: "",
    title: "",
    department: "",
    email: "",
    phone: "",
    color: "#4A90B8",
    isVacant: false,
    supervisorId: preselectedSupervisor || "",
    teamGroup: "",
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.title.trim()) {
      toast.error("Name and title are required");
      return;
    }

    setSaving(true);
    try {
      await addOrgMember({
        ...form,
        supervisorId: form.supervisorId || null,
      });
      toast.success(`Added ${form.name}`);
      onClose();
    } catch (err) {
      toast.error("Failed to add: " + err.message);
    }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Add New Person</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              <User size={12} /> Full Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., John Smith"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Title */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              <Briefcase size={12} /> Title / Role *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Software Engineer"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Reports to */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              <Building2 size={12} /> Reports To
            </label>
            <select
              value={form.supervisorId}
              onChange={(e) => setForm({ ...form, supervisorId: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">None (Top Level)</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Department
            </label>
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="e.g., Engineering"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Color */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              <Palette size={12} /> Node Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    form.color === c ? "border-gray-800 scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setForm({ ...form, color: c })}
                />
              ))}
            </div>
          </div>

          {/* Vacant toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVacant}
              onChange={(e) => setForm({ ...form, isVacant: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mark as vacant position</span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            {saving ? "Adding..." : "Add Person"}
          </button>
        </form>
      </div>
    </div>
  );
}
