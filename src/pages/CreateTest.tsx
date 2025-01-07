import { Navigation } from "@/components/Navigation";
import { TestForm } from "@/components/TestForm";

export default function CreateTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center text-gray-900">
            Create Test
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Fill in the form below to create a new test
          </p>
          <TestForm />
        </div>
      </div>
    </div>
  );
}