import type { ServiceOrderStatus } from '../../types';

const labels: Record<ServiceOrderStatus, string> = {
  CHECK_IN: 'Recebido', EM_DIAGNOSTICO: 'Em diagnóstico', AGUARDANDO_PECAS: 'Aguardando peças',
  EM_EXECUCAO: 'Em execução', FINALIZADO: 'Finalizado',
};

export function OrderStatusBadge({ status }: { status: ServiceOrderStatus }) {
  return <span className={'status-tag status-' + status}>{labels[status]}</span>;
}
