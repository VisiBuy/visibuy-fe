import React from "react";
import { Outlet } from "react-router-dom";

export const ProtectedRoute: React.FC = () => {
  // TEMP: Allow access without login while building pages
  return <Outlet />;
};


// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { useAppSelector } from "../../app/hooks";

// type ProtectedRouteProps = {
//   requiredPermissions?: string[];
//   redirectPath?: string;
// };

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
//   requiredPermissions,
//   redirectPath = "/login",
// }) => {
//   const user = useAppSelector((s) => s.auth.user);
//   const permissions = useAppSelector((s) => s.auth.permissions);

//   if (!user) return <Navigate to={redirectPath} replace />;

//   if (requiredPermissions && requiredPermissions.length > 0) {
//     const allowed = requiredPermissions.some((p) => permissions.includes(p));
//     if (!allowed) return <Navigate to="/error/401" replace />;
//   }

//   return <Outlet />;
// };
