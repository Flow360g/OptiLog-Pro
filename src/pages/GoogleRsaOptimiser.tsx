import { Navigation } from "@/components/Navigation";

const GoogleRsaOptimiser = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 text-center">
          Google RSA Optimiser
        </h1>
        
        {/* We'll add the file upload components in the next step */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 text-center">
            Upload your keyword and ad files to generate optimized RSA variants.
          </p>
        </div>
      </main>
    </div>
  );
};

export default GoogleRsaOptimiser;