import React, { useEffect, useState } from 'react';
import { SenderDetails } from '@/types/types';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Mail, Building, Globe, Info, ChevronUp, ChevronDown, Upload } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion'
import { useToast } from "@/components/ui/use-toast";
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedSupabaseClient } from '@/lib/createAuthenticatedSupabaseClient';

interface ProfileFormProps {
  senderDetails: SenderDetails;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
  isFetching: boolean;
  toggleEditMode: () => void;
  validateAndProceed: () => Promise<void>;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  senderDetails,
  handleInputChange,
  editMode,
  isFetching,
  toggleEditMode,
  validateAndProceed,
  isLoading
}) => {
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);


  const handleSwitchChange = (checked: boolean) => {
    setShowAdditionalDetails(checked);
    if (!checked) {
      // Clear additional details when switch is turned off
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }

        const { imageUrl } = await response.json();

        handleInputChange({
          target: { id: 'profileImage', value: imageUrl }
        } as React.ChangeEvent<HTMLInputElement>);

        toast({
          title: "Image uploaded successfully",
          description: "Your profile picture has been updated.",
        });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast({
          title: "Error uploading image",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const basicFields = [
    { id: 'email', label: 'Email', icon: <Mail className="h-4 w-4" />, required: true },
  ];

  const additionalFields = [
    { id: 'address', label: 'Address', icon: <MapPin className="h-4 w-4" />, required: false },
    { id: 'city', label: 'City', icon: <Building className="h-4 w-4" />, required: false },
    { id: 'state', label: 'State/Province', icon: <Building className="h-4 w-4" />, required: false },
    { id: 'zip', label: 'Zip/Postal Code', icon: <MapPin className="h-4 w-4" />, required: false },
    { id: 'country', label: 'Country', icon: <Globe className="h-4 w-4" />, required: false },
  ];

  const handleSave = async () => {
    try {
      await validateAndProceed();
      toggleEditMode();
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error saving profile",
        description: "Please check your inputs and try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log(senderDetails)
  }, [senderDetails])

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <Avatar className="h-16 w-16 sm:h-24 sm:w-24 mb-4">
              {previewUrl ? (
                <AvatarImage src={previewUrl} alt="Profile" />
              ) : senderDetails.profile_image ? (
                <AvatarImage src={senderDetails.profile_image} alt="Profile" />
              ) : (
                <>
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${senderDetails.name}`} />
                  <AvatarFallback>{senderDetails.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                </>
              )}
            </Avatar>
            {editMode && (
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => document.getElementById('profile-image')?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <Upload className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
          <Input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {isFetching ? (
            <Skeleton className="h-8 w-48" />
          ) : editMode ? (
            <div className="w-full max-w-xs mt-2">
              <Label htmlFor="name" className="sr-only">Name</Label>
              <Input
                id="name"
                value={senderDetails.name}
                onChange={handleInputChange}
                className="text-xl sm:text-2xl font-bold text-center"
                required
              />
              <p className="text-xs text-red-500 text-center mt-1">* Required</p>
            </div>
          ) : (
            <h2 className="text-xl sm:text-2xl font-bold text-center">{senderDetails.name} <span className='text-red-500 text-xs'>*</span></h2>
          )}
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-center break-all">{senderDetails.evmAddress}</p>
        </div>
        <div className="space-y-4">
          {basicFields.map((field) => (
            <div key={field.id} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:w-1/4">
                {field.icon}
                <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
              </div>
              {isFetching ? (
                <Skeleton className="h-9 flex-grow" />
              ) : editMode ? (
                <div className="flex-grow">
                  <Input
                    id={field.id}
                    value={senderDetails[field.id as keyof SenderDetails]}
                    onChange={handleInputChange}
                    placeholder={field.label}
                    required={field.required}
                  />
                  {field.required && <p className="text-xs text-red-500 mt-1">* Required</p>}
                </div>
              ) : (
                <p className="flex-grow text-sm sm:text-base">
                  {senderDetails[field.id as keyof SenderDetails] || `No ${field.label.toLowerCase()} provided`}
                  {field.required && <span className='text-red-500 text-xs ml-1'>*</span>}
                </p>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between bg-secondary p-4 rounded-lg cursor-pointer" onClick={() => setShowAdditionalDetails(!showAdditionalDetails)}>
            <div className="flex items-center space-x-2">
              <Switch
                id="additional-details"
                checked={showAdditionalDetails}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="additional-details" className="font-medium">Show Additional Details</Label>
            </div>
            {showAdditionalDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>

          <AnimatePresence>
            {showAdditionalDetails && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                As we are in testnet, additional information is not required. These fields provide the full invoicing experience.
              </motion.p>
            )}
          </AnimatePresence>



          <AnimatePresence>
            {showAdditionalDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {additionalFields.map((field) => (
                  <div key={field.id} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4">
                    <div className="flex items-center space-x-2 sm:w-1/4">
                      {field.icon}
                      <Label htmlFor={field.id} className="text-sm">{field.label}</Label>
                    </div>
                    {isFetching ? (
                      <Skeleton className="h-9 flex-grow" />
                    ) : editMode ? (
                      <div className="flex-grow">
                        <Input
                          id={field.id}
                          value={senderDetails[field.id as keyof SenderDetails]}
                          onChange={handleInputChange}
                          placeholder={field.label}
                          required={field.required}
                        />
                        {field.required && <p className="text-xs text-red-500 mt-1">* Required</p>}
                      </div>
                    ) : (
                      <p className="flex-grow text-sm sm:text-base">
                        {senderDetails[field.id as keyof SenderDetails] || `No ${field.label.toLowerCase()} provided`}
                        {field.required && <span className='text-red-500 text-xs ml-1'>*</span>}
                      </p>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-col items-center">
          {editMode ? (
            <Button onClick={handleSave} disabled={isLoading || isUploading} className="w-full sm:w-auto">
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          ) : (
            <Button onClick={toggleEditMode} className="w-full sm:w-auto">
              Edit Profile
            </Button>
          )}
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-4 text-center">
            <Info className="h-4 w-4 mr-2 flex-shrink-0" />
            <p>Fields marked with <span className="text-red-500">*</span> are required.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};