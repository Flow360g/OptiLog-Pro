import { PlatformIcon } from "../PlatformIcon";

interface PlatformCellProps {
  platform: string;
}

export function PlatformCell({ platform }: PlatformCellProps) {
  return (
    <td className="p-4 w-24">
      <div className="flex justify-center">
        <PlatformIcon platform={platform} />
      </div>
    </td>
  );
}