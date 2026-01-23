import React, { useEffect, ReactNode } from "react";
import { useScrollContext } from "@/shared/layout/AppLayout";

interface PageWrapperProps {
  children: ReactNode;
  /**
   * Controls whether the main section should be scrollable
   * If true, main section will have overflow-y-auto
   * If false, main section will have overflow-hidden
   */
  isScrollable?: boolean;
  /**
   * Additional className for the wrapper
   */
  className?: string;
}

/**
 * PageWrapper component that controls the main section scroll behavior
 *
 * Usage:
 * ```tsx
 * <PageWrapper isScrollable={true}>
 *   <YourPageContent />
 * </PageWrapper>
 *
 * <PageWrapper isScrollable={false}>
 *   <YourPageContent />
 * </PageWrapper>
 * ```
 */
export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  isScrollable = true,
  className = "",
}) => {
  const { setIsScrollable } = useScrollContext();

  useEffect(() => {
    // Set the scroll state when component mounts or prop changes
    setIsScrollable(isScrollable);

    // Cleanup: reset to scrollable when component unmounts
    return () => {
      setIsScrollable(true);
    };
  }, [isScrollable, setIsScrollable]);

  return <div className={`w-full ${className}`}>{children}</div>;
};
