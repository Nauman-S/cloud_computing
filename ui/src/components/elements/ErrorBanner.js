import React from "react";
import { useError } from "../../services/ErrorProvider";

const ErrorBanner = () => {
  const { error, clearError } = useError();

  return (
    error && (
      <div
        className="alert alert-danger alert-dismissible fade show mb-0 rounded-0"
        role="alert"
      >
        <strong>Error:</strong> {error}
        {clearError && (
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={clearError}
          ></button>
        )}
      </div>
    )
  );
};

export default ErrorBanner;
