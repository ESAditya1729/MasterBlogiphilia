import { useTheme } from "../contexts/ThemeContext";

const LoadingSpinner = ({ fullScreen = false }) => {
  const { mode } = useTheme();
  
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'h-screen w-screen' : 'h-full w-full'}`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
        mode === 'dark' ? 'border-blue-400' : 'border-blue-600'
      }`}></div>
    </div>
  );
};

export default LoadingSpinner;