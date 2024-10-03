import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { SupabaseClient } from "@supabase/supabase-js";

type SupabaseClientType = SupabaseClient<any, "public", any> | undefined;

export interface SupabaseClientContextType {
  supabaseClient: SupabaseClientType;
  setSupabaseClient: Dispatch<SetStateAction<SupabaseClientType>>;
}

const SupabaseClientContext = createContext<
  SupabaseClientContextType | undefined
>(undefined);

const SupabaseClientProvider = ({ children }: { children: ReactNode }) => {
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClientType>();

  return (
    <SupabaseClientContext.Provider
      value={{ supabaseClient, setSupabaseClient }}
    >
      {children}
    </SupabaseClientContext.Provider>
  );
};

export { SupabaseClientProvider, SupabaseClientContext };
