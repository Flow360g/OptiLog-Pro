import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
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

  const session = useSession();
  const navigate = useNavigate();

  // Redirect if not authenticated
  if (!session) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
          Google RSA Optimiser
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <FileUploadForm
            isUploading={isUploading}
            isProcessing={isProcessing}
            onSubmit={handleSubmit}
            onKeywordsFileChange={setKeywordsFile}
            onAdsFileChange={setAdsFile}
            onInstructionsChange={setAdditionalInstructions}
            additionalInstructions={additionalInstructions}
            keywordsFile={keywordsFile}
            adsFile={adsFile}
          />
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