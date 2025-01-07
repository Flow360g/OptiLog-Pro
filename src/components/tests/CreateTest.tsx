import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CreateTest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Create New Test</h1>
        <Button 
          variant="outline"
          onClick={() => navigate("/tests")}
        >
          Cancel
        </Button>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-500">Test creation form coming soon...</p>
      </div>
    </div>
  );
}