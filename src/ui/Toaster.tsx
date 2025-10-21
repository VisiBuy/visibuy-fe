"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/ui/Toast";
import { useToast } from "@/ui/use-toast";

interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  [key: string]: any; // For any extra props (like the rest in ...props)
}

export function Toaster() {
  const { toasts, dismissAll } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        ...props
      }: ToastItem) {
        return (
          <Toast key={id} {...props}>
            <div className='grid gap-y-9'>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose onClick={() => dismissAll()} />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
