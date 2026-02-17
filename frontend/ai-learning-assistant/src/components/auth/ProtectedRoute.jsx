import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";

const ProtectedRoute = () => {
  const isAuthenticated = false;
  const isLoading = false;

  if (isLoading) {
    return (
      <>
        <div>loading...</div>
      </>
    );
  }

  return (
    <React.Fragment>
      {isAuthenticated ? (
        <AppLayout>
          <Outlet />
        </AppLayout>
      ) : (
        <Navigate to="/login" replace />
      )}
    </React.Fragment>
  );
};

export default ProtectedRoute;
