import { useState, useRef, useCallback } from "react";
import { ReactFlowProvider, useReactFlow } from "reactflow";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

import { useOrgData } from "./hooks/useOrgData";
import { seedOrgData } from "./firebase/orgService";
import { exportToPDF, exportToPNG } from "./utils/pdfExport";

import Sidebar from "./components/Sidebar";
import OrgChart from "./components/OrgChart";
import EditPanel from "./components/EditPanel";
import AddPersonModal from "./components/AddPersonModal";
import LoadingScreen from "./components/LoadingScreen";

function AppContent() {
  const { members, loading, error } = useOrgData();
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const flowRef = useRef(null);
  const { fitView } = useReactFlow();

  const selectedMember = members.find((m) => m.id === selectedNode);

  const handleSelectNode = useCallback((nodeId) => {
    setSelectedNode(nodeId);
  }, []);

  const handleExportPDF = useCallback(async () => {
    try {
      toast.loading("Generating PDF...", { id: "pdf" });
      await exportToPDF("orgchart-canvas", "OrgChart.pdf");
      toast.success("PDF exported!", { id: "pdf" });
    } catch (err) {
      toast.error("PDF export failed: " + err.message, { id: "pdf" });
    }
  }, []);

  const handleExportPNG = useCallback(async () => {
    try {
      toast.loading("Generating PNG...", { id: "png" });
      await exportToPNG("orgchart-canvas", "OrgChart.png");
      toast.success("PNG exported!", { id: "png" });
    } catch (err) {
      toast.error("PNG export failed: " + err.message, { id: "png" });
    }
  }, []);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  const handleSeedData = useCallback(async () => {
    try {
      const seeded = await seedOrgData();
      if (seeded) {
        toast.success("Sample org chart loaded!");
      } else {
        toast.error("Data already exists");
      }
    } catch (err) {
      toast.error("Failed to load sample data: " + err.message);
    }
  }, []);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Connection Error</h2>
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Sidebar */}
      <Sidebar
        members={members}
        selectedNode={selectedNode}
        onSelectNode={handleSelectNode}
        onAddPerson={() => setShowAddModal(true)}
        onExportPDF={handleExportPDF}
        onExportPNG={handleExportPNG}
        onFitView={handleFitView}
        onSeedData={handleSeedData}
      />

      {/* Main Chart Area */}
      <div className="flex-1 relative">
        <OrgChart
          members={members}
          selectedNode={selectedNode}
          onSelectNode={handleSelectNode}
          flowRef={flowRef}
        />

        {/* Stats bar */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm border border-gray-100 flex items-center gap-4 text-xs text-gray-500 no-print">
          <span><strong className="text-gray-700">{members.length}</strong> people</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><strong className="text-gray-700">{members.filter(m => !m.supervisorId).length}</strong> top level</span>
          <span className="w-px h-3 bg-gray-200" />
          <span><strong className="text-gray-700">{members.filter(m => m.isVacant).length}</strong> vacant</span>
        </div>
      </div>

      {/* Right Edit Panel */}
      {selectedMember && (
        <EditPanel
          member={selectedMember}
          members={members}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Add Person Modal */}
      {showAddModal && (
        <AddPersonModal
          members={members}
          onClose={() => setShowAddModal(false)}
          preselectedSupervisor={selectedNode}
        />
      )}

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontSize: "14px",
            padding: "12px 16px",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}
