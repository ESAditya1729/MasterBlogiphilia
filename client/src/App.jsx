import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
       <Route path="/" element={<Home />} />
    </AuthProvider>
  );
}