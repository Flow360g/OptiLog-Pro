import { Navigation } from "@/components/Navigation";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20">
      <Navigation />
      <div className="p-8">Loading...</div>
    </div>
  );
}