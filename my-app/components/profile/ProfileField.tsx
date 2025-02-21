import React from 'react';
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Skeleton } from '../ui/skeleton';

interface ProfileFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  required?: boolean;
  type?: string;
  isFetching: boolean;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({ 
  id, label, value, onChange, disabled, required, type = 'text', isFetching 
}) => {
  if (isFetching) {
    return (
      <div className="flex flex-col space-y-1.5">
        <Skeleton className="h-4 w-[50px]" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-1.5">
      <Label htmlFor={id}>{label}{required && <span className="text-red-600">*</span>}</Label>
      <Input
        id={id}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
      />
    </div>
  );
};