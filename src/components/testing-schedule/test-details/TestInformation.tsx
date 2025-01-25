import { useState } from "react";
import { Test } from "../types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TestInformationProps {
  test: Test;
  onSave: (updatedFields: Partial<Test>) => void;
}

export function TestInformation({ test, onSave }: TestInformationProps) {
  const [editedTest, setEditedTest] = useState({
    name: test.name,
    platform: test.platform,
    status: test.status,
    start_date: test.start_date || '',
    end_date: test.end_date || '',
    kpi: test.kpi,
    hypothesis: test.hypothesis,
  });

  const handleChange = (field: keyof typeof editedTest, value: string) => {
    setEditedTest(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof typeof editedTest) => {
    if (editedTest[field] !== test[field]) {
      onSave({ [field]: editedTest[field] });
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Test Name</span>
        <Input
          value={editedTest.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onBlur={() => handleBlur('name')}
          className="bg-transparent border-0 px-0 h-8"
        />
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Platform</span>
        <Select 
          value={editedTest.platform}
          onValueChange={(value) => {
            handleChange('platform', value);
            handleBlur('platform');
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
          onValueChange={(value) => {
            handleChange('status', value);
            handleBlur('status');
          }}
        >
          <SelectTrigger className="bg-transparent border-0 px-0 h-8">
            <SelectValue placeholder="Select status" />
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
          onChange={(e) => handleChange('start_date', e.target.value)}
          onBlur={() => handleBlur('start_date')}
          className="bg-transparent border-0 px-0 h-8"
        />
      </div>
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">End Date</span>
        <Input
          type="date"
          value={editedTest.end_date}
          onChange={(e) => handleChange('end_date', e.target.value)}
          onBlur={() => handleBlur('end_date')}
          className="bg-transparent border-0 px-0 h-8"
        />
      </div>
      <div className="grid grid-cols-2 py-2.5 px-4">
        <span className="text-gray-600 font-medium">KPI</span>
        <Input
          value={editedTest.kpi}
          onChange={(e) => handleChange('kpi', e.target.value)}
          onBlur={() => handleBlur('kpi')}
          className="bg-transparent border-0 px-0 h-8"
        />
      </div>
      <div className="grid grid-cols-2 bg-gray-50 py-2.5 px-4">
        <span className="text-gray-600 font-medium">Hypothesis</span>
        <Textarea
          value={editedTest.hypothesis}
          onChange={(e) => handleChange('hypothesis', e.target.value)}
          onBlur={() => handleBlur('hypothesis')}
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