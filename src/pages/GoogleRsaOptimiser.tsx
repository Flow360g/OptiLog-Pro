import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelpCircle, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SuccessDialog } from "@/components/rsa/SuccessDialog";

const GoogleRsaOptimiser = () => {
  const [keywordsFile, setKeywordsFile] = useState<File | null>(null);
  const [adsFile, setAdsFile] = useState<File | null>(null);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentOptimizationId, setCurrentOptimizationId] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!session) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keywordsFile || !adsFile) {
      toast({
        title: "Missing files",
        description: "Please upload both keywords and ads files.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload keywords file
      const keywordsPath = `${session.user.id}/${Date.now()}-${keywordsFile.name}`;
      const { error: keywordsError } = await supabase.storage
        .from('rsa-files')
        .upload(keywordsPath, keywordsFile);

      if (keywordsError) throw keywordsError;

      // Upload ads file
      const adsPath = `${session.user.id}/${Date.now()}-${adsFile.name}`;
      const { error: adsError } = await supabase.storage
        .from('rsa-files')
        .upload(adsPath, adsFile);

      if (adsError) throw adsError;

      // Create optimization record
      const { data: optimization, error: dbError } = await supabase
        .from('rsa_optimizations')
        .insert({
          user_id: session.user.id,
          keywords_file_path: keywordsPath,
          ads_file_path: adsPath,
          status: 'processing',
          additional_instructions: additionalInstructions || null
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Start processing the files
      setIsProcessing(true);
      const { error: processError } = await supabase.functions
        .invoke('process-rsa-files', {
          body: { optimizationId: optimization.id }
        });

      if (processError) throw processError;

      setCurrentOptimizationId(optimization.id);
      setShowSuccessDialog(true);
      
    } catch (error) {
      console.error('Upload/processing error:', error);
      toast({
        title: "Error",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!currentOptimizationId) return;

    try {
      const { data: optimization, error } = await supabase
        .from('rsa_optimizations')
        .select('output_file_path')
        .eq('id', currentOptimizationId)
        .single();

      if (error) throw error;
      if (!optimization?.output_file_path) {
        throw new Error('Output file not found');
      }

      const { data, error: downloadError } = await supabase.storage
        .from('rsa-files')
        .download(optimization.output_file_path);

      if (downloadError) throw downloadError;

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'optimized-rsa-results.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your results. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
          Google RSA Optimiser
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords File (CSV)</Label>
              <Input
                id="keywords"
                type="file"
                accept=".csv"
                onChange={(e) => setKeywordsFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
                disabled={isUploading || isProcessing}
              />
              <p className="text-sm text-gray-500">
                Upload a CSV file containing your keywords
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ads">Ads File (CSV)</Label>
              <Input
                id="ads"
                type="file"
                accept=".csv"
                onChange={(e) => setAdsFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
                disabled={isUploading || isProcessing}
              />
              <p className="text-sm text-gray-500">
                Upload a CSV file containing your current ads
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add any specific instructions or context that might help improve the results</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Textarea
                id="instructions"
                placeholder="Enter any specific instructions or context that might help improve the results..."
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
                className="min-h-[100px]"
                disabled={isUploading || isProcessing}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isUploading || isProcessing || !keywordsFile || !adsFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Upload & Process Files"
              )}
            </Button>
          </form>
        </div>
      </main>

      <SuccessDialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default GoogleRsaOptimiser;