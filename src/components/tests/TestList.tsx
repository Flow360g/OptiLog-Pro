import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function TestList() {
  const { data: tests, isLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select(`
          *,
          test_type:test_types(
            name,
            category:test_categories(name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!tests?.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium">No tests yet</h3>
        <p className="text-gray-500">Create your first test to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <div 
          key={test.id}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{test.name}</h3>
              <p className="text-sm text-gray-500">
                {test.test_type?.category?.name} - {test.test_type?.name}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {test.platform}
            </div>
          </div>
          <p className="mt-2 text-sm">{test.hypothesis}</p>
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <div>
              Effort: {test.effort_level}/5
            </div>
            <div>
              Impact: {test.impact_level}/5
            </div>
            <div>
              Status: {test.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}