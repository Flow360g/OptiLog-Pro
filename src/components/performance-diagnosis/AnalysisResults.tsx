import { Card } from "@/components/ui/card";

interface AnalysisResultsProps {
  metrics?: Record<string, any>;
  recommendations?: string[];
}

export function AnalysisResults({ metrics, recommendations }: AnalysisResultsProps) {
  if (!metrics && !recommendations) {
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

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
          <div className="space-y-3">
            {metrics && Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </span>
                <span className="text-sm text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Recommendations</h3>
          <div className="space-y-2">
            {recommendations && recommendations.map((recommendation, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-primary">•</span>
                <p className="text-sm text-gray-600">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}