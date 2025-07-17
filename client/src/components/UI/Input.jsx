import { forwardRef } from 'react';

const Input = forwardRef(({ Icon, error, className = '', ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        ref={ref}
        className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} pr-3 py-3 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:${
          error ? 'ring-red-500' : 'ring-indigo-500'
        } focus:border-transparent placeholder-gray-400 transition-all ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 absolute -bottom-5 left-0">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;