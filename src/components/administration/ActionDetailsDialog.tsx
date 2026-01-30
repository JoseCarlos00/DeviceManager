// components/administration/ActionDetailsDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Wrench, RefreshCw } from 'lucide-react';
import type { AdminAction } from '@/stores/adminActionsStore';

interface ActionDetailsDialogProps {
  action: AdminAction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ACTION_ICONS = {
  broadcast_message: MessageSquare,
  maintenance_mode: Wrench,
  update_notification: RefreshCw,
};

const ACTION_LABELS = {
  broadcast_message: 'Mensaje Broadcast',
  maintenance_mode: 'Modo Mantenimiento',
  update_notification: 'Notificación de Actualización',
};

export default function ActionDetailsDialog({
  action,
  open,
  onOpenChange,
}: ActionDetailsDialogProps) {
  if (!action) return null;

  const Icon = ACTION_ICONS[action.action];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {ACTION_LABELS[action.action]}
          </DialogTitle>
          <DialogDescription>
            Detalles de la acción ejecutada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información general */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha y hora</p>
              <p className="text-sm font-mono">{new Date(action.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ejecutado por</p>
              <p className="text-sm">{action.executedBy}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Dispositivos afectados</p>
              <p className="text-sm font-medium">
                {action.devicesAffected} de {action.totalDevices}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge
                variant={
                  action.status === 'success'
                    ? 'default'
                    : action.status === 'partial'
                    ? 'secondary'
                    : 'destructive'
                }
              >
                {action.status === 'success' && '✅ Exitoso'}
                {action.status === 'partial' && '⚠️ Parcial'}
                {action.status === 'error' && '❌ Error'}
              </Badge>
            </div>
          </div>

          {/* Detalles específicos según tipo de acción */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Detalles específicos</p>
            
            {action.action === 'broadcast_message' && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Mensaje:</p>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm italic">"{action.details.message}"</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Remitente:</p>
                  <p className="text-sm font-medium">{action.details.sender}</p>
                </div>
              </div>
            )}

            {action.action === 'maintenance_mode' && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Finaliza:</p>
                  <p className="text-sm font-medium">
                    {action.details.maintenanceUntilReadable}
                  </p>
                </div>
                {action.details.reason && (
                  <div>
                    <p className="text-sm text-muted-foreground">Razón:</p>
                    <p className="text-sm">{action.details.reason}</p>
                  </div>
                )}
              </div>
            )}

            {action.action === 'update_notification' && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Dispositivos notificados:</p>
                  <p className="text-sm font-medium">{action.devicesAffected}</p>
                </div>
                {action.details.offlineDevices && action.details.offlineDevices > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dispositivos offline:</p>
                    <p className="text-sm text-yellow-600">
                      {action.details.offlineDevices} (no recibieron notificación)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Respuesta del servidor */}
          {action.details.serverResponse && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Respuesta del servidor</p>
              <div className="p-3 bg-muted rounded-md font-mono text-xs">
                <p>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <span className="font-medium">{action.details.serverResponse.status}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Message:</span>{' '}
                  {action.details.serverResponse.message}
                </p>
                {action.details.serverResponse.data && (
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(action.details.serverResponse.data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
