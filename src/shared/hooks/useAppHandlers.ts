import { useCallback } from 'react';

interface UseAppHandlersProps {
  signOut: () => Promise<void>;
  setIsPremium: (premium: boolean) => void;
}

export const useAppHandlers = ({ signOut, setIsPremium }: UseAppHandlersProps) => {
  
  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const handleUpgradeToPremium = useCallback(() => {
    setIsPremium(true);
  }, [setIsPremium]);

  return {
    handleLogout,
    handleUpgradeToPremium
  };
};