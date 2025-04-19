import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = false, id, ...props }, ref) => {
    // Generate a unique id if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={cn(fullWidth ? 'w-full' : '', 'mb-4')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'block rounded-md shadow-sm',
            'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
            'sm:text-sm px-3 py-2 w-full',
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;