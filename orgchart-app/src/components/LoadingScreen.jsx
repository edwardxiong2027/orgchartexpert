import { Building2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="text-center animate-fade-in">
        <div className="relative inline-block mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center pulse-glow">
            <Building2 size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">OrgChart Expert</h1>
        <p className="text-gray-400 text-sm">Loading your organization...</p>
        <div className="mt-4 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
