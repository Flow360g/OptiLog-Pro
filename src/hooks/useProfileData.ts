import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type UserPosition = Database['public']['Enums']['user_position'];

export function useProfileData(userId: string | undefined) {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [position, setPosition] = useState<UserPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!userId) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('position, first_name, last_name, email')
          .eq('id', userId)
          .single();

        if (profile) {
          setPosition(profile.position || null);
          setFirstName(profile.first_name || '');
          setLastName(profile.last_name || '');
          setEmail(profile.email || '');
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast.error("Failed to load profile data");
      }
    };

    loadProfileData();
  }, [userId]);

  const saveProfileData = async (userId: string) => {
    if (isSaving) return;
    
    try {
      setIsSaving(true);
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          position,
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw new Error("Failed to update profile");
      }

      return true;
    } catch (error) {
      console.error("Save profile error:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    email,
    firstName,
    lastName,
    position,
    loading,
    isSaving,
    setFirstName,
    setLastName,
    setPosition,
    saveProfileData
  };
}