import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type UserPosition = Database['public']['Enums']['user_position'];

interface ProfileFormProps {
  email: string;
  firstName: string;
  lastName: string;
  position: UserPosition | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  logoUrl: string | null;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPositionChange: (value: UserPosition) => void;
  onPrimaryColorChange: (value: string) => void;
  onSecondaryColorChange: (value: string) => void;
  onLogoChange: (path: string) => void;
}

export function ProfileForm({
  email,
  firstName,
  lastName,
  position,
  primaryColor,
  secondaryColor,
  logoUrl,
  onFirstNameChange,
  onLastNameChange,
  onPositionChange,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onLogoChange,
}: ProfileFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG or JPEG)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      onLogoChange(filePath);
      toast({
        title: "Logo uploaded successfully",
        description: "Your brand logo has been updated",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your logo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Email</Label>
        <div className="text-gray-600">{email}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          value={firstName}
          onChange={(e) => onFirstNameChange(e.target.value)}
          placeholder="Enter your first name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder="Enter your last name"
        />
      </div>

      <div className="space-y-4">
        <Label>Position</Label>
        <Select value={position || undefined} onValueChange={onPositionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select your position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="activation_executive">Activation Executive</SelectItem>
            <SelectItem value="activation_manager">Activation Manager</SelectItem>
            <SelectItem value="activation_director">Activation Director</SelectItem>
            <SelectItem value="digital_partner">Digital Partner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Brand Colors</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="primaryColor"
                value={primaryColor || "#000000"}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="w-12 h-12 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={primaryColor || ""}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="secondaryColor"
                value={secondaryColor || "#000000"}
                onChange={(e) => onSecondaryColorChange(e.target.value)}
                className="w-12 h-12 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={secondaryColor || ""}
                onChange={(e) => onSecondaryColorChange(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Brand Logo</Label>
        <div className="space-y-4">
          {logoUrl && (
            <div className="w-48 h-48 mx-auto">
              <img
                src={`${supabase.storage.from('logos').getPublicUrl(logoUrl).data.publicUrl}`}
                alt="Brand logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <div className="flex items-center justify-center">
            <Button
              variant="outline"
              className="relative"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload Logo"}
              <Input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}