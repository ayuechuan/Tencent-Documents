import { createContext, PropsWithChildren } from "react";
import { ConferenceStore } from ".";

const Context = createContext({} as ConferenceStore);
export function ConferenceProvider({ children }: PropsWithChildren) {
  return (
    <Context.Provider value={new ConferenceStore()}>
      {children}
    </Context.Provider>
  )
}

export function useConference() {
  return useContext(Context)
}
