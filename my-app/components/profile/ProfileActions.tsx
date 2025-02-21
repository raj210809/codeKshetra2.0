import React from 'react';
import { Button } from "../ui/button"
import { CardFooter } from "../ui/card"

interface ProfileActionsProps {
  editMode: boolean;
  toggleEditMode: () => void;
  validateAndProceed: () => void;
  isLoading: boolean;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({ 
  editMode, toggleEditMode, validateAndProceed, isLoading 
}) => {
  return (
    <CardFooter className="flex justify-between">
      <Button onClick={toggleEditMode}>
        {editMode ? 'Cancel' : 'Edit'}
      </Button>
      <Button onClick={validateAndProceed} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Submit'}
      </Button>
    </CardFooter>
  );
};