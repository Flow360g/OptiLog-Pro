import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { parseCSVFile } from "@/utils/csv/parser";
import { analyzeMetricRelationships } from "@/utils/csv/metricAnalysis";

interface AnalysisResult {
  metrics: Record<string, any>;
  recommendations: string[];
}

export function CSVUpload({ onAnalysisComplete }: { onAnalysisComplete: (result: AnalysisResult) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
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

      // Format metrics for display
      const formattedMetrics = Object.entries(analysis.metrics).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: `${value.percentChange.toFixed(2)}% (${value.currentPeriod.toFixed(2)} vs ${value.previousPeriod.toFixed(2)})`
      }), {});

      // Store analysis results with user_id
      const { error: analysisError } = await supabase
        .from('csv_analysis')
        .insert({
          user_id: user.id,
          file_name: file.name,
          metrics_analysis: formattedMetrics,
          recommendations: analysis.recommendations
        });

      if (analysisError) throw analysisError;

      // Update UI with results
      onAnalysisComplete({
        metrics: formattedMetrics,
        recommendations: analysis.recommendations
      });

      toast({
        title: "Analysis complete",
        description: "Your CSV file has been analyzed successfully.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error processing your file. Please try again.",
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
      {isUploading && (
        <p className="text-sm text-muted-foreground">
          Uploading and analyzing your file...
        </p>
      )}
    </div>
  );
}