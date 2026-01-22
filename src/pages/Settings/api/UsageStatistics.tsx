import graph from "../../../public/icons/graph-icon.svg";
import mingcute from "../../../public/icons/mingcute_time-line.svg";
import StatCard from "./StatCard";

export default function UsageStatistics() {
  return (
    <div className="bg-gray-100 p-5 mb-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold">Usage Statistics</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          icon={graph}
          value="1,234"
          label="This Month"
        />
        <StatCard
          icon={mingcute}
          value="156ms"
          label="Avg. Response"
        />
      </div>
    </div>
  );
}
