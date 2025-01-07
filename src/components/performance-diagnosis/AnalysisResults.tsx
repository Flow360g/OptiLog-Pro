import { Card } from "@/components/ui/card";

export function AnalysisResults() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Your analysis results will appear here after uploading a CSV file.
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recommendations</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Actionable insights based on your data will be shown here.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}