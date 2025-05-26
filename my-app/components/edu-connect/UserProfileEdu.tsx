import React from 'react';
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserProfileCard = ({ eduUsername, ethAddress }: any) => {
  const initials = eduUsername
    .split('.')
    .map((name: any) => name[0].toUpperCase())
    .join('')

  return (
    <Card className="w-full max-w-sm shadow-md shadow-[#00ebbc] ">
      <CardContent className="flex items-center space-x-4 p-4">
        <Avatar className="h-8 w-8 ">
          <AvatarFallback className="text-black font-semibold">{initials}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{eduUsername}</h3>
          <p className="text-sm text-[#00ebbc] font-semibold opacity-100">
            {ethAddress.slice(0, 6)}...{ethAddress.slice(-4)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;