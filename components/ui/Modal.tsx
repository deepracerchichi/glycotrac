"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-[60]">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-forest/50 backdrop-blur-sm transition duration-200 data-closed:opacity-0 motion-reduce:transition-none"
      />
      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <DialogPanel
          transition
          className="flex max-h-[92dvh] w-full flex-col rounded-t-3xl bg-white shadow-2xl transition duration-200 data-closed:translate-y-8 data-closed:opacity-0 motion-reduce:transition-none sm:max-w-xl sm:rounded-3xl sm:data-closed:translate-y-0 sm:data-closed:scale-95"
        >
          <div className="flex items-start justify-between gap-4 border-b border-black/10 p-5 sm:p-6">
            <div className="min-w-0">
              <DialogTitle className="text-2xl font-medium tracking-tight">{title}</DialogTitle>
              {description && <p className="mt-1 text-ink/70">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-forest"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="overflow-y-auto p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}