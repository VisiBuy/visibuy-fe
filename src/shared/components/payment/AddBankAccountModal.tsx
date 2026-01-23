import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { useCreatePayoutAccountMutation } from "@/features/payout/payoutApi";
import { useLazyVerifyAccountQuery } from "@/features/payout/nubanApi";
import { BankAccountFailedModal } from "./BankAccountFailedModal";
import { NIGERIAN_BANKS } from "@/shared/data/nigerianBanks";

const bankAccountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  bankCode: z.string().min(1, "Bank code is required"),
  accountNumber: z
    .string()
    .min(10, "Account number must be at least 10 digits")
    .max(10, "Account number must be exactly 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  accountName: z.string().min(1, "Account name is required"),
});

type BankAccountFormData = z.infer<typeof bankAccountSchema>;

interface AddBankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [createPayoutAccount, { isLoading }] = useCreatePayoutAccountMutation();
  const [verifyAccount, { isLoading: isVerifying }] =
    useLazyVerifyAccountQuery();
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [failedErrorMessage, setFailedErrorMessage] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<BankAccountFormData>({
    resolver: zodResolver(bankAccountSchema),
    mode: "onChange",
    defaultValues: {
      bankName: "",
      bankCode: "",
      accountNumber: "",
      accountName: "",
    },
  });

  const bankCode = watch("bankCode");
  const bankName = watch("bankName");
  const accountNumber = watch("accountNumber");
  const accountName = watch("accountName");

  // Get bank data from selected bank code
  const selectedBankData = NIGERIAN_BANKS.find(
    (bank) => bank.code === bankCode
  );

  // Auto-verify account when account number and bank are provided
  useEffect(() => {
    const verifyAccountDetails = async () => {
      if (
        accountNumber &&
        accountNumber.length === 10 &&
        /^\d+$/.test(accountNumber) &&
        selectedBankData?.code
      ) {
        setVerificationError("");
        try {
          const result = await verifyAccount({
            accountNumber,
            bankCode: selectedBankData.code,
          }).unwrap();

          if (result.account_name) {
            setValue("accountName", result.account_name, {
              shouldValidate: true,
            });
            setValue("bankCode", selectedBankData.code, {
              shouldValidate: true,
            });
            trigger("accountName");
          }
        } catch (error: any) {
          // Handle different error formats
          let errorMessage =
            "Invalid account number. Please check and try again.";

          if (error?.message) {
            errorMessage = error.message;
          } else if (error?.data?.message) {
            // Handle validation error format
            if (typeof error.data.message === "object") {
              const messages: string[] = [];
              Object.values(error.data.message).forEach((msgArray) => {
                if (Array.isArray(msgArray)) {
                  messages.push(...msgArray);
                }
              });
              errorMessage = messages.join(", ") || errorMessage;
            } else {
              errorMessage = error.data.message;
            }
          }

          setVerificationError(errorMessage);
          setValue("accountName", "", { shouldValidate: true });
          trigger("accountName");
        }
      } else if (accountNumber && accountNumber.length === 10) {
        // Clear account name if account number changes
        setValue("accountName", "", { shouldValidate: true });
      }
    };

    const timeoutId = setTimeout(() => {
      verifyAccountDetails();
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [accountNumber, selectedBankData, verifyAccount, setValue, trigger]);

  // Update bank code when bank changes
  useEffect(() => {
    if (selectedBankData?.code) {
      setValue("bankCode", selectedBankData.code, { shouldValidate: true });
    }
  }, [bankCode, selectedBankData, setValue]);

  const onSubmit = async (data: BankAccountFormData) => {
    try {
      await createPayoutAccount({
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
      }).unwrap();

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.error ||
        "Failed to add bank account. Please try again.";
      setFailedErrorMessage(errorMessage);
      setIsFailedModalOpen(true);
    }
  };

  const handleClose = () => {
    reset();
    setVerificationError("");
    setFailedErrorMessage("");
    setIsFailedModalOpen(false);
    onOpenChange(false);
  };

  const isFormValid = isValid && !verificationError && accountName;

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center text-h5-desktop font-bold text-neutral-900">
              Add Bank Account For Payout
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-space-24">
            {/* Bank Details Section */}
            <div className="space-y-space-16">
              <div className="flex items-center gap-space-12">
                <Building2 className="h-5 w-5 text-neutral-600" />
                <h3 className="text-body-large font-semibold text-neutral-900">
                  Bank Details
                </h3>
              </div>

              {/* Bank Name */}
              <div className="space-y-space-8">
                <label
                  htmlFor="bankName"
                  className="text-body-small font-medium text-neutral-900"
                >
                  Bank Name
                </label>
                <Select
                  id="bankName"
                  options={NIGERIAN_BANKS.map((bank) => ({
                    value: bank.code,
                    label: bank.label,
                  }))}
                  placeholder="Enter bank name"
                  value={selectedBankData?.code || ""}
                  onChange={(e) => {
                    const bank = NIGERIAN_BANKS.find(
                      (b) => b.code === e.target.value
                    );
                    if (bank) {
                      setValue("bankName", bank.label, {
                        shouldValidate: true,
                      });
                      setValue("bankCode", bank.code, {
                        shouldValidate: true,
                      });
                      // Clear account name when bank changes
                      setValue("accountName", "", { shouldValidate: true });
                      setVerificationError("");
                      trigger(["bankName", "bankCode", "accountName"]);
                    }
                  }}
                  className={errors.bankName ? "border-danger" : ""}
                />
                {errors.bankName && (
                  <p className="text-body-small text-danger">
                    {errors.bankName.message}
                  </p>
                )}
              </div>

              {/* Account Number */}
              <div className="space-y-space-8">
                <label
                  htmlFor="accountNumber"
                  className="text-body-small font-medium text-neutral-900"
                >
                  Account Number
                </label>
                <div className="relative">
                  <Input
                    id="accountNumber"
                    type="text"
                    placeholder="Input account number"
                    {...register("accountNumber", {
                      onChange: () => {
                        setVerificationError("");
                        setValue("accountName", "", { shouldValidate: true });
                      },
                    })}
                    className={
                      errors.accountNumber || verificationError
                        ? "border-danger"
                        : ""
                    }
                    maxLength={10}
                  />
                  {isVerifying && (
                    <div className="absolute right-space-12 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary-blue" />
                    </div>
                  )}
                </div>
                {errors.accountNumber && (
                  <p className="text-body-small text-danger">
                    {errors.accountNumber.message}
                  </p>
                )}
                {verificationError && (
                  <p className="text-body-small text-danger">
                    {verificationError}
                  </p>
                )}
              </div>

              {/* Account Name (Disabled) */}
              <div className="space-y-space-8">
                <label
                  htmlFor="accountName"
                  className="text-body-small font-medium text-neutral-900"
                >
                  Account Name
                </label>
                <Input
                  id="accountName"
                  type="text"
                  placeholder="Account name will be auto-filled"
                  {...register("accountName")}
                  disabled
                  className={`${
                    errors.accountName ? "border-danger" : ""
                  } bg-neutral-100 cursor-not-allowed`}
                />
                {errors.accountName && (
                  <p className="text-body-small text-danger">
                    {errors.accountName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              variant={isFormValid ? "default" : "outline"}
              size="default"
              className={`w-full ${
                isFormValid
                  ? "bg-primary-blue text-neutral-white hover:bg-primary-blue/90"
                  : "border-neutral-300 text-neutral-600"
              }`}
              disabled={isLoading || !isFormValid || isVerifying}
            >
              {isLoading ? "Saving..." : "Save Bank Account"}
            </Button>

            {/* Disclaimer */}
            <p className="text-body-small text-center text-neutral-600">
              By adding your account, you accept to our{" "}
              <a
                href="/terms"
                className="text-primary-blue underline hover:text-primary-blue/80"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-primary-blue underline hover:text-primary-blue/80"
              >
                Privacy Policy
              </a>
              .
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Failed Modal */}
      <BankAccountFailedModal
        open={isFailedModalOpen}
        onOpenChange={setIsFailedModalOpen}
        errorMessage={failedErrorMessage}
        onRetry={() => {
          handleSubmit(onSubmit)();
        }}
      />
    </>
  );
};
