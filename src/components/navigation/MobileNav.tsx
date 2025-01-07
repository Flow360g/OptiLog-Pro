import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavLinks } from "./NavLinks";
import { UserMenu } from "./UserMenu";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userEmail: string | null;
}

export function MobileNav({ isOpen, setIsOpen, userEmail }: MobileNavProps) {
  return (
    <div className="flex items-center gap-1 md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-[2.1rem] w-[2.1rem]" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col space-y-4 mt-8">
            <NavLinks onLinkClick={() => setIsOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
      <UserMenu userEmail={userEmail} />
    </div>
  );
}