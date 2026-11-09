import { useProfile as useProfileContext } from "@/contexts/ProfileContext";

export function useProfile() {
  return useProfileContext();
}

export default useProfile;
