import { useState } from "react";
import { Test } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TestInformationProps {
  test: Test;
  onSave?: (updatedTest: Test) => void;
}

export function TestInformation({ test, onSave }: TestInformationProps) {
  const { toast } = useToast();
  const [editedTest, setEditedTest] = useState({
    name: test.name,
    platform: test.platform as "facebook" | "google" | "tiktok",
    status: test.status,
    start_date: test.start_date || '',
    end_date: test.end_date || '',
    kpi: test.kpi,
    hypothesis: test.hypothesis,
  });

  const formatStatus = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Planning';
      case 'in_progress':
        return 'Working on it';
      case 'completed':
        return 'Live';
      case 'cancelled':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleTestUpdate = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .update(editedTest)
        .eq('id', test.id)
        .select(`
          *,
          test_types (
            name,
            test_categories (
              name
            )
          )
        `)
        .single();

      if (error) throw error;

      if (data) {
        onSave?.(data as Test);
        toast({
          title: "Test updated",
          description: "Test details have been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating test:', error);
      toast({
        title: "Error updating test",
        description: "There was a problem saving the test details.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Test Name</span>
        <Input
          value={editedTest.name}
          onChange={(e) => setEditedTest(prev => ({ ...prev, name: e.target.value }))}
          onBlur={handleTestUpdate}
          className="bg-transparent border-0 px-0 h-8"
        />
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Platform</span>
        <Select 
          value={editedTest.platform}
          onValueChange={(value: "facebook" | "google" | "tiktok") => {
            setEditedTest(prev => ({ ...prev, platform: value }));
            handleTestUpdate();
          }}
        >
          <SelectTrigger className="bg-transparent border-0 px-0 h-8">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="google">Google</SelectItem>
            <SelectItem value="tiktok">TikTok</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Status</span>
        <Select 
          value={editedTest.status}
          onValueChange={(value: Test['status']) => {
            setEditedTest(prev => ({ ...prev, status: value }));
            handleTestUpdate();
          }}
        >
          <SelectTrigger className="bg-transparent border-0 px-0 h-8">
            <SelectValue placeholder="Select status">
              {formatStatus(editedTest.status)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Planning</SelectItem>
            <SelectItem value="in_progress">Working on it</SelectItem>
            <SelectItem value="completed">Live</SelectItem>
            <SelectItem value="cancelled">Completed</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Start Date</span>
        <Input
          type="date"
          value={editedTest.start_date}
          onChange={(e) => setEditedTest(prev => ({ ...prev, start_date: e.target.value }))}
          onBlur={handleTestUpdate}
          className="bg-transparent border-0 px-0 h-8"
        />
      </div>
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">End Date</span>
        <Input
          type="date"
          value={editedTest.end_date}
          onChange={(e) => setEditedTest(prev => ({ ...prev, end_date: e.target.value }))}
          onBlur={handleTestUpdate}
          className="bg-transparent border-0 px-0 h-8"
        />
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">KPI</span>
        <Input
          value={editedTest.kpi}
          onChange={(e) => setEditedTest(prev => ({ ...prev, kpi: e.target.value }))}
          onBlur={handleTestUpdate}
          className="bg-transparent border-0 px-0 h-8"
        />
      </div>
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Hypothesis</span>
        <Textarea
          value={editedTest.hypothesis}
          onChange={(e) => setEditedTest(prev => ({ ...prev, hypothesis: e.target.value }))}
          onBlur={handleTestUpdate}
          className="bg-transparent border-0 px-0 min-h-[60px] resize-none"
        />
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Test Type</span>
        <span className="text-gray-700">
          {`${test.test_types.test_categories.name} - ${test.test_types.name}`}
        </span>
      </div>
    </div>
  );
}