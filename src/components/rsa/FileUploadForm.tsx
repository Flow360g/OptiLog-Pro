import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FileUploadFormProps {
  isUploading: boolean;
  isProcessing: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onKeywordsFileChange: (file: File | null) => void;
  onAdsFileChange: (file: File | null) => void;
  onInstructionsChange: (instructions: string) => void;
  additionalInstructions: string;
  keywordsFile: File | null;
  adsFile: File | null;
}

export function FileUploadForm({
  isUploading,
  isProcessing,
  onSubmit,
  onKeywordsFileChange,
  onAdsFileChange,
  onInstructionsChange,
  additionalInstructions,
  keywordsFile,
  adsFile,
}: FileUploadFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords File (CSV)</Label>
        <Input
          id="keywords"
          type="file"
          accept=".csv"
          onChange={(e) => onKeywordsFileChange(e.target.files?.[0] || null)}
          className="cursor-pointer"
          disabled={isUploading || isProcessing}
        />
        <p className="text-sm text-gray-500">
          Upload a CSV file containing your keywords
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ads">Ads File (CSV)</Label>
        <Input
          id="ads"
          type="file"
          accept=".csv"
          onChange={(e) => onAdsFileChange(e.target.files?.[0] || null)}
          className="cursor-pointer"
          disabled={isUploading || isProcessing}
        />
        <p className="text-sm text-gray-500">
          Upload a CSV file containing your current ads
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Add any specific instructions or context that might help improve the results</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Textarea
          id="instructions"
          placeholder="Enter any specific instructions or context that might help improve the results..."
          value={additionalInstructions}
          onChange={(e) => onInstructionsChange(e.target.value)}
          className="min-h-[100px]"
          disabled={isUploading || isProcessing}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isUploading || isProcessing || !keywordsFile || !adsFile}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Upload & Process Files"
        )}
      </Button>
    </form>
  );
}