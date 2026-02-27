import { memo } from "react";
import { Handle, Position } from "reactflow";
import { getTextColor } from "../utils/layoutUtils";
import { User, Crown, AlertCircle, Users } from "lucide-react";

function OrgNode({ data, selected }) {
  const bgColor = data.color || "#4A90B8";
  const textColor = getTextColor(bgColor);
  const isTop = !data.supervisorId;
  const isVacant = data.isVacant;
  const isCoordinator = data.isCoordinator;

  return (
    <>
      {!isTop && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-slate-400 !w-2 !h-2 !border-0"
        />
      )}

      <div
        className={`
          relative rounded-xl px-4 py-3 min-w-[200px] max-w-[240px] text-center
          transition-all duration-200 cursor-pointer
          ${selected ? "ring-2 ring-blue-400 ring-offset-2 scale-105" : "hover:scale-[1.02]"}
          ${isVacant ? "border-2 border-dashed border-gray-400" : "border border-transparent"}
        `}
        style={{
          backgroundColor: isVacant ? "#f1f5f9" : bgColor,
          boxShadow: selected
            ? "0 8px 25px rgba(0,0,0,0.15)"
            : "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {/* Role icon */}
        <div className="flex items-center justify-center gap-1.5 mb-1">
          {isTop && <Crown size={12} color={textColor} className="opacity-70" />}
          {isCoordinator && <Users size={12} color={textColor} className="opacity-70" />}
          {isVacant && <AlertCircle size={12} color="#999" className="opacity-70" />}
          <span
            className="text-[10px] font-semibold uppercase tracking-wider opacity-80"
            style={{ color: isVacant ? "#666" : textColor }}
          >
            {data.title}
          </span>
        </div>

        {/* Name */}
        <div className="flex items-center justify-center gap-1.5">
          <User size={14} color={isVacant ? "#999" : textColor} className="opacity-60 shrink-0" />
          <span
            className={`text-sm font-bold ${isVacant ? "italic" : ""}`}
            style={{ color: isVacant ? "#888" : textColor }}
          >
            {data.name}
          </span>
        </div>

        {/* Department tag */}
        {data.department && (
          <div
            className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-[9px] font-medium"
            style={{
              backgroundColor: isVacant
                ? "rgba(0,0,0,0.05)"
                : `${textColor}15`,
              color: isVacant ? "#999" : textColor,
            }}
          >
            {data.department}
          </div>
        )}

        {/* Team group badge */}
        {data.teamGroup && (
          <div className="absolute -top-2 -right-2 bg-amber-100 text-amber-800 text-[8px] px-1.5 py-0.5 rounded-full font-semibold border border-amber-200">
            Team
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-400 !w-2 !h-2 !border-0"
      />
    </>
  );
}

export default memo(OrgNode);
