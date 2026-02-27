import { useState } from "react";
import {
  Plus,
  Download,
  FileImage,
  RotateCcw,
  Search,
  ChevronRight,
  ChevronDown,
  User,
  Building2,
  Upload,
  ArrowLeft,
} from "lucide-react";
import { buildTree } from "../utils/layoutUtils";
import { UNITS } from "../constants/units";

export default function Sidebar({
  members,
  selectedNode,
  onSelectNode,
  onAddPerson,
  onExportPDF,
  onExportPNG,
  onFitView,
  onSeedData,
  chartName,
  chartUnit,
  onUnitChange,
  onBackToDashboard,
}) {
  const [search, setSearch] = useState("");
  const [expandedNodes, setExpandedNodes] = useState(new Set(["root"]));
  const tree = buildTree(members);

  const unitInfo = UNITS.find((u) => u.value === chartUnit) || UNITS[0];

  const filteredMembers = search
    ? members.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.title.toLowerCase().includes(search.toLowerCase()) ||
          m.department?.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  function toggleExpand(id) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function TreeNode({ node, depth = 0 }) {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;

    return (
      <div>
        <div
          className={`flex items-center gap-1.5 py-1.5 px-2 rounded-lg cursor-pointer transition-all text-sm
            ${isSelected ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-gray-50 text-gray-700"}`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => onSelectNode(node.id)}
        >
          {hasChildren ? (
            <button
              className="p-0.5 hover:bg-gray-200 rounded shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-5" />
          )}
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: node.isVacant ? "#ccc" : node.color || "#4A90B8" }}
          />
          <span className={`truncate ${node.isVacant ? "italic text-gray-400" : ""}`}>
            {node.name}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        {/* Back + Title */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} className="text-gray-500" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-800 truncate">{chartName}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: unitInfo.bg, color: unitInfo.color }}
              >
                {unitInfo.label}
              </span>
              {/* Unit change dropdown */}
              <select
                value={chartUnit}
                onChange={(e) => onUnitChange(e.target.value)}
                className="text-[10px] text-gray-400 bg-transparent border-none cursor-pointer hover:text-gray-600 focus:outline-none"
              >
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onAddPerson}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={14} />
            Add Person
          </button>
          <button
            onClick={onExportPDF}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 transition-colors"
          >
            <Download size={14} />
            PDF
          </button>
          <button
            onClick={onExportPNG}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
          >
            <FileImage size={14} />
            PNG
          </button>
          <button
            onClick={onFitView}
            className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tree / Search Results */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {filteredMembers ? (
          <div className="space-y-1">
            <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Search Results ({filteredMembers.length})
            </div>
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm
                  ${selectedNode === m.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"}`}
                onClick={() => onSelectNode(m.id)}
              >
                <User size={14} className="shrink-0 text-gray-400" />
                <div className="truncate">
                  <div className={`font-medium ${m.isVacant ? "italic text-gray-400" : ""}`}>{m.name}</div>
                  <div className="text-[10px] text-gray-400">{m.title}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Organization Tree
            </div>
            {tree.map((root) => (
              <TreeNode key={root.id} node={root} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100 text-center">
        {members.length === 0 && (
          <button
            onClick={onSeedData}
            className="flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors border border-amber-200"
          >
            <Upload size={14} />
            Load Sample Org Chart
          </button>
        )}
        <div className="text-[10px] text-gray-300 mt-2">
          {members.length} member{members.length !== 1 ? "s" : ""} in organization
        </div>
      </div>
    </div>
  );
}
