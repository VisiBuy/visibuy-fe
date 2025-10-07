import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

export const hasPermission = (permissions: string[], userPermissions: string[]) =>
  permissions.some((perm) => userPermissions.includes(perm));

const withAuth =
  <P extends object>(Component: React.ComponentType<P>, requiredPermissions: string[]) =>
  (props: P) => {
    const userPermissions = useAppSelector((s) => s.auth.permissions);
    const allowAccess = hasPermission(requiredPermissions, userPermissions);
    if (!allowAccess) return <Navigate to="/error/401" replace />;
    return <Component {...props} />;
  };

export default withAuth;
