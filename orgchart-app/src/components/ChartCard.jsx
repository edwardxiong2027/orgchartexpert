import { useState } from "react";
import { Network, Users, Trash2, ArrowRight, Calendar } from "lucide-react";
import { UNITS } from "../constants/units";

export default function ChartCard({ chart, onOpen, onDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const unitInfo = UNITS.find((u) => u.value === chart.unit) || UNITS[0];

  const updatedDate = chart.updatedAt
    ? new Date(chart.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Color bar */}
      <div className="h-1.5" style={{ backgroundColor: unitInfo.color }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: unitInfo.bg }}
            >
              <Network size={18} style={{ color: unitInfo.color }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm leading-tight">{chart.name}</h3>
              <span
                className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: unitInfo.bg, color: unitInfo.color }}
              >
                {unitInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{chart.memberCount || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>{updatedDate}</span>
          </div>
        </div>

        {/* Actions */}
        {showDeleteConfirm ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-xs text-red-600 font-medium mb-2">Delete this chart and all its data?</p>
            <div className="flex gap-2">
              <button
                onClick={() => onDelete(chart.id)}
                className="flex-1 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => onOpen(chart)}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Open
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
