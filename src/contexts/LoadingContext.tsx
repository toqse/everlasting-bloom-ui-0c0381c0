import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  // Start false so no loading window appears on refresh; Navbar still uses setIsLoading for link transitions
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

const defaultLoadingContext: LoadingContextType = {
  isLoading: false,
  setIsLoading: () => {},
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  return context ?? defaultLoadingContext;
};
