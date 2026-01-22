import React from "react";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/shared/components/ui/dialog";

interface BankAccountSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BankAccountSuccessModal: React.FC<
  BankAccountSuccessModalProps
> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-neutral-100 border-0 shadow-none">
        <div className="flex flex-col items-center justify-center py-space-32 px-space-24 space-y-space-24">
          {/* Success Icon */}
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary-green">
            <Check className="h-10 w-10 text-neutral-white stroke-[3]" />
          </div>

          {/* Success Message */}
          <div className="text-center space-y-space-8">
            <h3 className="text-h5-desktop font-bold text-neutral-900">
              Bank Added Successfully!
            </h3>
            <p className="text-body-medium text-neutral-600">
              Your payout method has been saved securely.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

