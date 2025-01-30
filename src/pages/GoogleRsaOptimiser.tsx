import { useEffect } from 'react';
import { Navigation } from "@/components/Navigation";
import { FileUploadForm } from "@/components/rsa/FileUploadForm";
import { SuccessDialog } from "@/components/rsa/SuccessDialog";
import { useRsaOptimizer } from "@/hooks/useRsaOptimizer";

const GoogleRsaOptimiser = () => {
  const {
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
  } = useRsaOptimizer();

  useEffect(() => {
    if (showSuccessDialog) {
      const timer = setTimeout(() => {
        setShowSuccessDialog(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessDialog, setShowSuccessDialog]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">
            Google RSA Optimiser
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Upload your RSA files to optimize your campaigns.
          </p>
          {isUploading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          {showSuccessDialog && (
            <SuccessDialog 
              open={showSuccessDialog}
              onClose={() => setShowSuccessDialog(false)}
              onDownload={handleDownload}
            />
          )}
          <FileUploadForm 
            isUploading={isUploading}
            isProcessing={isProcessing}
            onSubmit={handleSubmit}
            onKeywordsFileChange={(file) => setKeywordsFile(file)}
            onAdsFileChange={(file) => setAdsFile(file)}
            onInstructionsChange={(instructions) => setAdditionalInstructions(instructions)}
            keywordsFile={keywordsFile}
            adsFile={adsFile}
            additionalInstructions={additionalInstructions}
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleRsaOptimiser;