import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SignificanceResult } from "../../types";

interface SignificanceResultsCardProps {
  results: SignificanceResult;
}

export function SignificanceResultsCard({ results }: SignificanceResultsCardProps) {
  return (
    <Card className={`p-6 ${results.isSignificant ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
      <h3 className="text-lg font-semibold mb-4">
        {results.isSignificant ? "Significant test result!" : "No significant difference"}
      </h3>
      <p className="text-gray-700">
        {results.isSignificant ? (
          `Variation B's observed conversion rate (${(results.experimentRate * 100).toFixed(2)}%) was ${Math.abs(results.relativeLift).toFixed(2)}% ${results.relativeLift > 0 ? 'higher' : 'lower'} than Variation A's conversion rate (${(results.controlRate * 100).toFixed(2)}%). You can be 95% confident that this result is a consequence of the changes you made and not a result of random chance.`
        ) : (
          `The difference between Variation A (${(results.controlRate * 100).toFixed(2)}%) and Variation B (${(results.experimentRate * 100).toFixed(2)}%) is not statistically significant. This means we cannot be confident that the observed difference is not due to random chance.`
        )}
      </p>
      <div className="text-sm text-gray-500 mt-2 flex items-center gap-1">
        <span className="font-bold">P-value:</span>
        <span>{results.pValue.toFixed(4)}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-1 text-gray-400 hover:text-gray-600">
              (?)
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4">
              <p>A p-value, or probability value, is a number describing how likely it is that your data would have occurred by random chance (i.e., that the null hypothesis is true).</p>
              <p className="mt-2">The level of statistical significance is often expressed as a p-value between 0 and 1. To achieve a statistical significance of 95%, we need a p-value of 0.05 or lower.</p>
              <p className="mt-2">The smaller the p-value, the less likely the results occurred by random chance, and the stronger the evidence that you should reject the null hypothesis.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}