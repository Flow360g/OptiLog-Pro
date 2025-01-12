import { Test } from "../types";

interface TestInformationProps {
  test: Test;
}

export function TestInformation({ test }: TestInformationProps) {
  const formatStatus = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Planning';
      case 'in_progress':
        return 'Working on it';
      case 'completed':
        return 'Live';
      case 'cancelled':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Test Name</span>
        <span className="text-gray-700">{test.name}</span>
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Platform</span>
        <span className="text-gray-700">{test.platform}</span>
      </div>
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Status</span>
        <span className="text-gray-700">{formatStatus(test.status)}</span>
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Start Date</span>
        <span className="text-gray-700">
          {test.start_date ? new Date(test.start_date).toLocaleDateString() : "Not set"}
        </span>
      </div>
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">End Date</span>
        <span className="text-gray-700">
          {test.end_date ? new Date(test.end_date).toLocaleDateString() : "Not set"}
        </span>
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">KPI</span>
        <span className="text-gray-700">{test.kpi}</span>
      </div>
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Hypothesis</span>
        <span className="text-gray-700">{test.hypothesis}</span>
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Test Type</span>
        <span className="text-gray-700">
          {`${test.test_types.test_categories.name} - ${test.test_types.name}`}
        </span>
      </div>
    </div>
  );
}