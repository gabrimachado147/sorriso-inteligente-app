import React from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = React.useContext(AuthContext)
  if (!user) return <Navigate to="/login" replace />
  return children
}
