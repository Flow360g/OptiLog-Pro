import { TestList } from "@/components/tests/TestList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Tests() {
  const navigate = useNavigate();

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Testing Schedule</h1>
        <Button 
          onClick={() => navigate("/tests/new")} 
          className="gradient-bg"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Test
        </Button>
      </div>
      <TestList />
    </main>
  );
}