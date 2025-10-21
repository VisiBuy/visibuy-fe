import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthService from  '@/modules/Auth/lib/service'
import { LoginCredentials } from "@/modules/Auth/models/types";
import { getMeQueryKey } from "@/modules/Auth/queries/queries";
export function useLogout() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: () => AuthService.logout(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getMeQueryKey() });
      },
    });
  }