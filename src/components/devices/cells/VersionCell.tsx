import { useAppVersionStore } from "@/stores/appVersionStore"
import { AlertTriangle } from 'lucide-react';

export function VersionCell({ version }: { version: number | undefined }) {
  const currentVersion = useAppVersionStore((state) => state.currentVersion);
  const currentVersionName = useAppVersionStore((state) => state.currentVersionName);


  if (!version) {
    return <span className='text-muted-foreground text-xs'>—</span>;
  }

  const isOutdated = currentVersion !== null && version !== currentVersion;

  return (
		<div className='flex items-center gap-1.5 text-center'>
			<span className='font-mono text-xs text-center w-full'>{currentVersionName}</span>
			{isOutdated && <AlertTriangle className='h-3.5 w-3.5 text-amber-500 shrink-0' />}
		</div>
	);
}
