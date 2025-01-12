import { Button } from "@/components/ui/button";
import { ProfileForm } from "./ProfileForm";
import { ClientSelector } from "./ClientSelector";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { useSettingsForm } from "@/hooks/useSettingsForm";

interface SettingsFormProps {
  userId: string;
  userClients: string[];
}

export function SettingsForm({ userId, userClients }: SettingsFormProps) {
  const {
    email,
    firstName,
    lastName,
    position,
    primaryColor,
    secondaryColor,
    logoPath,
    isProfileSaving,
    setFirstName,
    setLastName,
    setPosition,
    setPrimaryColor,
    setSecondaryColor,
    setLogoPath,
    selectedClients,
    handleClientToggle,
    isClientSaving,
    handleSave
  } = useSettingsForm(userId, userClients);

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <ProfileForm
        email={email}
        firstName={firstName}
        lastName={lastName}
        position={position}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        logoUrl={logoPath}
        onFirstNameChange={setFirstName}
        onLastNameChange={setLastName}
        onPositionChange={setPosition}
        onPrimaryColorChange={setPrimaryColor}
        onSecondaryColorChange={setSecondaryColor}
        onLogoChange={setLogoPath}
      />

      <ClientSelector
        selectedClients={selectedClients}
        onClientToggle={handleClientToggle}
      />

      <Button 
        onClick={handleSave}
        className="w-full gradient-bg"
        disabled={isProfileSaving || isClientSaving}
      >
        {isProfileSaving || isClientSaving ? 'Saving...' : 'Save Changes'}
      </Button>

      <DeleteAccountButton userId={userId} />
    </div>
  );
}