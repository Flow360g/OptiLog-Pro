import { Button } from "@/components/ui/button";

interface TestSourceSectionProps {
  onSourceSelect: (source: 'new' | 'library') => void;
}

export function TestSourceSection({ onSourceSelect }: TestSourceSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        type="button"
        variant="outline"
        className="p-6 h-auto flex flex-col gap-2 border-2 border-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:border-0"
        onClick={() => onSourceSelect('new')}
      >
        <span className="text-lg font-semibold">Create New</span>
        <span className="text-sm">
          Create a new test from scratch
        </span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="p-6 h-auto flex flex-col gap-2 border-2 border-primary hover:bg-gradient-to-r hover:from-primary hover:to-secondary hover:text-primary-foreground hover:border-0"
        onClick={() => onSourceSelect('library')}
      >
        <span className="text-lg font-semibold">Choose From Test Library</span>
        <span className="text-sm">
          Select from pre-made test templates
        </span>
      </Button>
    </div>
  );
}