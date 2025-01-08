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
        className="p-6 h-auto flex flex-col gap-2 hover:border-primary"
        onClick={() => onSourceSelect('new')}
      >
        <span className="text-lg font-semibold">Create New</span>
        <span className="text-sm text-muted-foreground">
          Create a new test from scratch
        </span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="p-6 h-auto flex flex-col gap-2 hover:border-primary"
        onClick={() => onSourceSelect('library')}
      >
        <span className="text-lg font-semibold">Choose From Test Library</span>
        <span className="text-sm text-muted-foreground">
          Select from pre-made test templates
        </span>
      </Button>
    </div>
  );
}