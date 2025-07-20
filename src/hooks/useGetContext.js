import { useContext } from "react";

export const useGetContext = (reactContext) => {
  const context = useContext(reactContext);
  if (context === undefined) {
    throw new Error("no context");
  }
  return context;
};
