import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Remove 'default' import

export default function useAuth() {
  return useContext(AuthContext);
}