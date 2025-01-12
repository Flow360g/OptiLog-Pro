import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Test } from "../types";

interface DialogHeaderProps {
  test: Test;
  onDownloadPDF: () => Promise<void>;
}

export function DialogHeader({ test, onDownloadPDF }: DialogHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">{test.name}</h2>
      {test.results && (
        <Button
          onClick={onDownloadPDF}
          className="gradient-bg text-white flex items-center gap-2"
          variant={null}
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      )}
    </div>
  );
}