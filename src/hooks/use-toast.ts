import { useDispatch, useSelector } from "react-redux";
import { addToast, dismissToast, removeToast } from "../ui/toastSlice";
import { selectToasts } from "../ui/toastSlice";
import type { ToastProps } from "../ui/toastSlice";

export function useToast() {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  const toast = (props: ToastProps) => {
    dispatch(addToast(props));
  };

  const dismiss = (toastId?: string) => {
    dispatch(dismissToast(toastId));
  };

  const dismissAll = () => {
    dispatch(removeToast());
  };

  return {
    toast,
    dismiss,
    dismissAll,
    toasts,
  };
}
