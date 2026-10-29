"use client";
// product — необязательный контекст: менеджер получит название и ссылку на товар вместе с заявкой
export type ManagerContext = { product?: { name: string; slug: string }; topic?: string };
export const openManager = (detail: ManagerContext = {}) => window.dispatchEvent(new CustomEvent<ManagerContext>("open-manager", { detail }));
export default function OpenManagerButton({ className, children, context }: { className?: string; children: React.ReactNode; context?: ManagerContext }) {
  return <button type="button" className={className} onClick={() => openManager(context)}>{children}</button>;
}
