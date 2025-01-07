import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, AlertCircle } from "lucide-react";
import { parseCSVFile } from "@/utils/csv/parser";
import { analyzeMetricRelationships } from "@/utils/csv/metricAnalysis";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnalysisResult {
  metrics: Record<string, any>;
  recommendations: string[];
}

export function CSVUpload({ onAnalysisComplete }: { onAnalysisComplete: (result: AnalysisResult) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        throw new Error("Please upload a CSV file");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Parse and analyze CSV data
      const csvData = await parseCSVFile(file);
      const analysis = analyzeMetricRelationships(csvData);

      // Create a folder for the user's files
      const folderPath = `${user.id}/${crypto.randomUUID()}`;
      const fileName = `${folderPath}/${file.name}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('csv-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the file URL
      const { data: { publicUrl } } = supabase.storage
        .from('csv-uploads')
        .getPublicUrl(fileName);

      // Convert metrics to a format compatible with Json type
      const metricsJson = JSON.parse(JSON.stringify(analysis.metrics));

      // Store analysis results with user_id
      const { error: analysisError } = await supabase
        .from('csv_analysis')
        .insert({
          user_id: user.id,
          file_name: file.name,
          metrics_analysis: metricsJson,
          recommendations: analysis.recommendations
        });

      if (analysisError) throw analysisError;

      // Update UI with results
      onAnalysisComplete({
        metrics: analysis.metrics,
        recommendations: analysis.recommendations
      });

      toast({
        title: "Analysis complete",
        description: "Your CSV file has been analyzed successfully.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 
        "There was an error processing your file. Please ensure your CSV contains valid data with the required columns: date, spend, impressions, clicks, and conversions.";
      
      setError(errorMessage);
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                   file:text-sm file:font-semibold file:bg-primary
                   file:text-white hover:file:bg-primary/90"
        />
        <Button disabled={isUploading} variant="default">
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload CSV"}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isUploading && (
        <p className="text-sm text-muted-foreground">
          Uploading and analyzing your file...
        </p>
      )}
    </div>
  );
}