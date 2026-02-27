import { useState, useEffect } from "react";
import {
  X,
  Save,
  Trash2,
  ArrowRightLeft,
  User,
  Briefcase,
  Building2,
  Mail,
  Phone,
  Palette,
  Users,
  AlertTriangle,
} from "lucide-react";
import { updateOrgMember, deleteOrgMember, changeSupervisor } from "../firebase/orgService";
import { wouldCreateCycle } from "../utils/layoutUtils";
import toast from "react-hot-toast";

const COLORS = [
  "#1B3A5C", "#2E6B8A", "#4A90B8", "#C4956A", "#5B8C5A",
  "#8B5E83", "#C4564A", "#D4A03C", "#6B7B8D", "#999999",
];

export default function EditPanel({ member, members, userId, chartId, onClose }) {
  const [form, setForm] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || "",
        title: member.title || "",
        department: member.department || "",
        email: member.email || "",
        phone: member.phone || "",
        color: member.color || "#4A90B8",
        isVacant: member.isVacant || false,
        isCoordinator: member.isCoordinator || false,
        teamGroup: member.teamGroup || "",
        supervisorId: member.supervisorId || "",
      });
      setShowDeleteConfirm(false);
    }
  }, [member]);

  if (!member) return null;

  const subordinates = members.filter((m) => m.supervisorId === member.id);
  const supervisor = members.find((m) => m.id === member.supervisorId);

  async function handleSave() {
    setSaving(true);
    try {
      const { supervisorId, ...rest } = form;

      // Handle supervisor change
      if (supervisorId !== (member.supervisorId || "")) {
        const newSupId = supervisorId || null;
        if (newSupId && wouldCreateCycle(members, member.id, newSupId)) {
          toast.error("Cannot move: would create a circular reporting chain!");
          setSaving(false);
          return;
        }
        await changeSupervisor(userId, chartId, member.id, newSupId);
      }

      await updateOrgMember(userId, chartId, member.id, rest);
      toast.success(`Updated ${form.name}`);
    } catch (err) {
      toast.error("Failed to save: " + err.message);
    }
    setSaving(false);
  }

  async function handleDelete() {
    try {
      await deleteOrgMember(userId, chartId, member.id, members);
      toast.success(`Removed ${member.name}`);
      onClose();
    } catch (err) {
      toast.error("Failed to delete: " + err.message);
    }
  }

  const possibleSupervisors = members.filter(
    (m) => m.id !== member.id && !wouldCreateCycle(members, member.id, m.id)
  );

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-sm">Edit Person</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Name */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            <User size={12} /> Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Title */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            <Briefcase size={12} /> Title / Role
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Supervisor */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            <ArrowRightLeft size={12} /> Reports To
          </label>
          <select
            value={form.supervisorId}
            onChange={(e) => setForm({ ...form, supervisorId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">None (Top Level)</option>
            {possibleSupervisors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} - {m.title}
              </option>
            ))}
          </select>
          {supervisor && (
            <div className="mt-1.5 text-xs text-gray-400">
              Currently: {supervisor.name}
            </div>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            <Building2 size={12} /> Department
          </label>
          <input
            type="text"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              <Mail size={11} /> Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              <Phone size={11} /> Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Team Group */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            <Users size={12} /> Team Group
          </label>
          <input
            type="text"
            value={form.teamGroup}
            onChange={(e) => setForm({ ...form, teamGroup: e.target.value })}
            placeholder="e.g., Research & Instruction Team"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  form.color === c ? "border-gray-800 scale-110" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setForm({ ...form, color: c })}
              />
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVacant}
              onChange={(e) => setForm({ ...form, isVacant: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Mark as vacant position</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isCoordinator}
              onChange={(e) => setForm({ ...form, isCoordinator: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Coordinator role</span>
          </label>
        </div>

        {/* Subordinates info */}
        {subordinates.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs font-semibold text-blue-700 mb-1">
              Direct Reports ({subordinates.length})
            </div>
            <div className="space-y-0.5">
              {subordinates.map((s) => (
                <div key={s.id} className="text-xs text-blue-600">
                  {s.name} - {s.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {showDeleteConfirm ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-red-700 text-xs font-semibold mb-2">
              <AlertTriangle size={14} />
              {subordinates.length > 0
                ? `This will reassign ${subordinates.length} report(s) to ${supervisor?.name || "top level"}`
                : "Are you sure?"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 size={14} />
            Remove Person
          </button>
        )}
      </div>
    </div>
  );
}
