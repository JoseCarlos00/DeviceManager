
function ConnectionIndicator({ isConnected }: { isConnected: boolean }) {
  return (
		<div className='flex items-center gap-2 text-sm'>
			<div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
			<span className='text-muted-foreground'>{isConnected ? 'Conectado' : 'Desconectado'}</span>
		</div>
	);
}

export default ConnectionIndicator
