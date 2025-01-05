interface PlatformIconProps {
  platform: string;
}

export function PlatformIcon({ platform }: PlatformIconProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <img 
            src="/lovable-uploads/35e929cd-b4a1-4bb3-98a9-31a8bf7a7a04.png" 
            alt="Meta (Facebook) Logo" 
            className="w-12 h-12 object-contain"
          />
        );
      case 'google':
        return (
          <img 
            src="/lovable-uploads/60c692e5-6102-41c5-b27e-62aad3bed037.png" 
            alt="Google Ads Logo" 
            className="w-12 h-12 object-contain"
          />
        );
      default:
        return null;
    }
  };

  return getPlatformIcon(platform);
}