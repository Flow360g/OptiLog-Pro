import { Navigation } from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function TestingSchedule() {
  const { toast } = useToast();

  const { data: tests, isLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tests')
        .select(`
          *,
          test_types (
            name,
            test_categories (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching tests",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">
            Testing Schedule
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            View and manage your tests
          </p>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tests?.map((test) => (
                <Card key={test.id} className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                    <p className="text-sm text-gray-500">
                      {test.test_types?.test_categories?.name} - {test.test_types?.name}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Client:</span> {test.client}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Platform:</span> {test.platform}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>{" "}
                      <span className={`capitalize ${
                        test.status === 'completed' ? 'text-green-600' :
                        test.status === 'in_progress' ? 'text-blue-600' :
                        test.status === 'scheduled' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`}>
                        {test.status.replace('_', ' ')}
                      </span>
                    </p>
                    {test.start_date && (
                      <p className="text-sm">
                        <span className="font-medium">Start Date:</span>{" "}
                        {new Date(test.start_date).toLocaleDateString()}
                      </p>
                    )}
                    {test.end_date && (
                      <p className="text-sm">
                        <span className="font-medium">End Date:</span>{" "}
                        {new Date(test.end_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}