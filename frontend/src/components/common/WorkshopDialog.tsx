import { useEffect, useRef, type ReactNode } from 'react';

export function WorkshopDialog({ title, onDismiss, children }: { title: string; onDismiss: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return <dialog ref={ref} aria-label={title} className="work-dialog" onCancel={e => { e.preventDefault(); onDismiss(); }}>
    {children}
  </dialog>;
}
