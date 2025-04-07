import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (message) => setError(message);
  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => useContext(ErrorContext);
