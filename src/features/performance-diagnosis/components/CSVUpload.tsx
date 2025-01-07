import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface CSVUploadProps {
  onAnalysisComplete: (result: { metrics: Record<string, any>; recommendations: string[] }) => void;
}

export const CSVUpload = ({ onAnalysisComplete }: CSVUploadProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Simulate file processing and analysis
    const result = await processCSV(file);
    onAnalysisComplete(result);
  };

  const processCSV = async (file: File) => {
    // Placeholder for actual CSV processing logic
    return new Promise<{ metrics: Record<string, any>; recommendations: string[] }>((resolve) => {
      setTimeout(() => {
        resolve({
          metrics: {
            cost_per_result: { currentPeriod: 100, previousPeriod: 80, percentChange: 25 },
            conversion_rate: { currentPeriod: 5, previousPeriod: 4, percentChange: 25 },
          },
          recommendations: ["Increase budget for high-performing ads", "Test new ad creatives"],
        });
      }, 2000);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />
      <Button onClick={handleUpload} disabled={!file} className="flex items-center">
        <Upload className="mr-2" />
        Upload CSV
      </Button>
    </div>
  );
};
