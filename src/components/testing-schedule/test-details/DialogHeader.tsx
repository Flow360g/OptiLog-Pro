import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Test } from "../types";
import { generatePDF } from "../utils/pdfGenerator";

interface DialogHeaderProps {
  test: Test;
  results: any;
}

export function DialogHeader({ test, results }: DialogHeaderProps) {
  const handleDownloadPDF = async () => {
    if (!results) return;
    await generatePDF({ ...test, results });
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">{test.name}</h2>
      {results && (
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      )}
    </div>
  );
}