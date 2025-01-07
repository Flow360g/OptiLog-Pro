import { Navigation } from "@/components/Navigation";
import { CSVUpload } from "@/components/performance-diagnosis/CSVUpload";
import { AnalysisResults } from "@/components/performance-diagnosis/AnalysisResults";

export default function PerformanceDiagnosis() {
  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Performance Diagnosis</h1>
            <p className="text-gray-600 mb-8">
              Upload your performance data for analysis and get actionable insights.
              We'll analyze your CSV file and provide recommendations for optimization.
            </p>
            <CSVUpload />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <AnalysisResults />
          </div>
        </div>
      </main>
    </div>
  );
}