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
            src="/lovable-uploads/0a4fd2fe-2ca7-4e53-b5a8-1286e299191f.png" 
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