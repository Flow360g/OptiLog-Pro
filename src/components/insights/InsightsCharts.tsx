import { WeeklyChart } from "./WeeklyChart";
import { DistributionChart } from "./DistributionChart";
import { UserChart } from "./UserChart";
import { clientData, platformData } from "./insightsData";

export const InsightsCharts = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WeeklyChart />
      <DistributionChart title="Client Distribution" data={clientData} />
      <DistributionChart title="Platform Distribution" data={platformData} />
      <UserChart />
    </div>
  );
};