import { useGlobaEventBus } from "@/hooks/use-globa-event-bus";
import { EventBus } from "@/utils/EventBus";
import { createContext, PropsWithChildren } from "react";

const EventBusContext = createContext<EventBus | null>(null);

export const EventBusProvider = ({ children }: PropsWithChildren) => {
  const eventBus = useState(() => new EventBus())[0];
  return (
    <EventBusContext.Provider value={eventBus}>
      {children}
    </EventBusContext.Provider>
  )
}

export function useEventBus(){
  return useContext(EventBusContext);
}