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

type UserPosition = Database['public']['Enums']['user_position'];

interface ProfileFormProps {
  email: string;
  firstName: string;
  lastName: string;
  position: UserPosition | null;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onPositionChange: (value: UserPosition) => void;
}

export function ProfileForm({
  email,
  firstName,
  lastName,
  position,
  onFirstNameChange,
  onLastNameChange,
  onPositionChange,
}: ProfileFormProps) {
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
    </div>
  );
}