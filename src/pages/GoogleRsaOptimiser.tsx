import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from '@supabase/auth-helpers-react';
import { FileUploadForm } from "@/components/rsa/FileUploadForm";
import { SuccessDialog } from "@/components/rsa/SuccessDialog";
import { useRsaOptimizer } from "@/hooks/useRsaOptimizer";
import { useUserClients } from "@/hooks/useUserClients";

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

  const navigate = useNavigate();
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const { data: userClients = [], isLoading: isClientsLoading } = useUserClients();

  // Check session and redirect if not logged in
  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/login");
      return;
    }
  }, [session, isSessionLoading, navigate]);

  // Only show loading state while checking session
  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
        <Navigation />
        <div className="flex justify-center items-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If no session, redirect to login
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
        
        {isClientsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading client data...</p>
          </div>
        ) : userClients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No clients assigned. Please update your settings.</p>
          </div>
        ) : (
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
        )}
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