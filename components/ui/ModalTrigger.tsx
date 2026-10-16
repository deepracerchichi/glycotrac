"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";

const CloseContext = createContext<() => void>(() => {});

export const useModalClose = () => useContext(CloseContext);

export const triggerPrimary = "inline-flex min-h-12 items-center gap-2 rounded-full bg-mint px-6 font-medium text-forest";
export const triggerOutline = "inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-forest px-4 font-medium";

export default function ModalTrigger({
  label,
  title,
  description,
  icon,
  className = triggerPrimary,
  children,
}: {
  label: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {icon === undefined ? <Plus className="size-5" aria-hidden="true" /> : icon}
        {label}
      </button>

      <Modal open={open} onClose={close} title={title} description={description}>
        <CloseContext.Provider value={close}>{children}</CloseContext.Provider>
      </Modal>
    </>
  );
}