import { useContext } from "react";

export const useGetContext = (reactContext) => {
  const context = useContext(reactContext);
  if (context === undefined) {
    console.error("no context");
  }
  return context;
};
