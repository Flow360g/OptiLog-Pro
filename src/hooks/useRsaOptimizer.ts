import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export function useRsaOptimizer() {
  const [keywordsFile, setKeywordsFile] = useState<File | null>(null);
  const [adsFile, setAdsFile] = useState<File | null>(null);
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [currentOptimizationId, setCurrentOptimizationId] = useState<string | null>(null);
  const { toast } = useToast();
  const session = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!keywordsFile || !adsFile || !session?.user) {
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
        description: error.message || "There was an error processing your files. Please try again.",
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
      const { data: optimization, error: fetchError } = await supabase
        .from('rsa_optimizations')
        .select('output_file_path')
        .eq('id', currentOptimizationId)
        .single();

      if (fetchError) throw fetchError;
      if (!optimization?.output_file_path) {
        throw new Error('Output file not found');
      }

      console.log('Attempting to download file:', optimization.output_file_path);

      // First try to download directly
      const { data, error: downloadError } = await supabase.storage
        .from('rsa-files')
        .download(optimization.output_file_path);

      if (downloadError) {
        console.error('Direct download failed, trying signed URL:', downloadError);
        // If direct download fails, try with signed URL
        const { data: signedData, error: signedError } = await supabase.storage
          .from('rsa-files')
          .createSignedUrl(optimization.output_file_path, 60);

        if (signedError) throw signedError;
        if (!signedData?.signedUrl) {
          throw new Error('Failed to generate download URL');
        }

        // Create a download link and trigger it
        const link = document.createElement('a');
        link.href = signedData.signedUrl;
        link.download = 'optimized-rsa-results.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // If direct download succeeds, use blob URL
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'optimized-rsa-results.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your results. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    keywordsFile,
    adsFile,
    additionalInstructions,
    isUploading,
    isProcessing,
    showSuccessDialog,
    setKeywordsFile,
    setAdsFile,
    setAdditionalInstructions,
    setShowSuccessDialog,
    handleSubmit,
    handleDownload,
  };
}