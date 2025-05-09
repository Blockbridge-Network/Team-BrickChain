import { LayoutGrid, Map } from "lucide-react";

interface ViewToggleProps {
  currentView: "grid" | "map";
  onViewChange: (view: "grid" | "map") => void;
}

export const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex bg-gray-900/50 rounded-lg p-1">
      <button
        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
          currentView === "grid"
            ? "bg-indigo-600 text-white"
            : "text-gray-400 hover:text-white"
        }`}
        onClick={() => onViewChange("grid")}
      >
        <LayoutGrid size={18} />
        <span>Grid</span>
      </button>
      <button
        className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
          currentView === "map"
            ? "bg-indigo-600 text-white"
            : "text-gray-400 hover:text-white"
        }`}
        onClick={() => onViewChange("map")}
      >
        <Map size={18} />
        <span>Map</span>
      </button>
    </div>
  );
};
