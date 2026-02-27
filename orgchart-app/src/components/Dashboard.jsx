import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth";
import { deleteChart } from "../firebase/chartService";
import { useDashboardData } from "../hooks/useDashboardData";
import ChartCard from "./ChartCard";
import CreateChartModal from "./CreateChartModal";
import {
  Building2,
  Plus,
  LogOut,
  Network,
  Search,
} from "lucide-react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function Dashboard({ userId, userName, onOpenChart }) {
  const { charts, loading } = useDashboardData(userId);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCharts = search
    ? charts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.unit.toLowerCase().includes(search.toLowerCase())
      )
    : charts;

  async function handleDelete(chartId) {
    try {
      await deleteChart(userId, chartId);
      toast.success("Chart deleted");
    } catch (err) {
      toast.error("Failed to delete: " + err.message);
    }
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
    } catch (err) {
      toast.error("Sign out failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">OrgChart Expert</h1>
              <p className="text-xs text-gray-400">Welcome, {userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              New Chart
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        {charts.length > 0 && (
          <div className="relative max-w-md mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search charts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <p className="text-gray-400 text-sm">Loading your charts...</p>
            </div>
          </div>
        ) : charts.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
              <Network size={48} className="text-blue-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No org charts yet</h2>
            <p className="text-gray-400 text-sm mb-6 text-center max-w-sm">
              Create your first organizational chart to get started. You can choose from LLC, ASC, or Career units.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              <Plus size={18} />
              Create Your First Chart
            </button>
          </div>
        ) : (
          /* Chart grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCharts.map((chart) => (
              <ChartCard
                key={chart.id}
                chart={chart}
                onOpen={onOpenChart}
                onDelete={handleDelete}
              />
            ))}

            {/* Add card */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="min-h-[180px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all group"
            >
              <div className="w-12 h-12 border-2 border-current rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} />
              </div>
              <span className="text-sm font-medium">New Chart</span>
            </button>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateChartModal
          userId={userId}
          onClose={() => setShowCreateModal(false)}
          onCreated={(chart) => {
            setShowCreateModal(false);
            onOpenChart(chart);
          }}
        />
      )}

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { borderRadius: "12px", fontSize: "14px", padding: "12px 16px" },
        }}
      />
    </div>
  );
}
