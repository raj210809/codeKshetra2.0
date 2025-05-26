import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import StreamForecast from './StreamForecast'
import { LineChartIcon } from 'lucide-react';

interface StreamForecastDialogProps {
  stream_id: number;
  chain_id: number;
  triggerText?: string;
}

const StreamForecastDialog: React.FC<StreamForecastDialogProps> = ({ 
  stream_id,
  chain_id,
  triggerText = "View Stream Forecast"
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><LineChartIcon className='w-4 h-4 mr-2'/> {triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stream Forecast</DialogTitle>
          <DialogDescription>
          
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          <StreamForecast
            streamId={stream_id}
            chain_id={chain_id}
            title="Stream forecast"
            description="Forecast based on active stream"
            chartColor="#00edbe"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default StreamForecastDialog