import { WebWorkerContext } from "@/contexts/webWorker";
import React from "react";

export const useWebWorker = () => {
  const webWorker = React.useContext(WebWorkerContext);
  if (!webWorker) {
    throw new Error('useWebWorker must be used within a WebWorkerProvider');
  }
  return webWorker;
}