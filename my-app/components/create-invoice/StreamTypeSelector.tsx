import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

type StreamType = "linear" | "monthly";

interface StreamTypeSelectorProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  streamType: StreamType;
  updateStreamType: (newStreamType: StreamType) => void;
}

export function StreamTypeSelector({ setStep, streamType, updateStreamType }: StreamTypeSelectorProps) {
  const handleBack = () => {
    setStep(1);
  }

  const handleNext = () => {
    if (streamType) {
      setStep(3);
    }
  }

  const LinearStreamSVG = () => (
    <svg width="100%" height="100" viewBox="0 0 200 100" preserveAspectRatio="none">
      <line x1="0" y1="100" x2="200" y2="0" stroke="currentColor" strokeWidth="3" />
    </svg>
  );

  return (
    <div className="w-[90%] lg:w-[85%] xl:w-[65%]">
      <Progress value={85} className="my-8" />
      <Card>
        <CardHeader>
          <CardTitle>Type of Stream</CardTitle>
          <CardDescription>Select the type of stream for asset distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={streamType} onValueChange={(value) => updateStreamType(value as StreamType)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className={`cursor-pointer bg-muted ${streamType === "linear" ? "border-primary" : "border-transparent"}`}>
                <CardHeader>
                  <CardTitle className="text-primary">Linear Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-24 text-primary">
                    <LinearStreamSVG />
                  </div>
                  <CardDescription className="text-muted-foreground mt-4">
                    Distribute assets at a constant rate/second
                  </CardDescription>
                  <RadioGroupItem value="linear" className="sr-only" />
                </CardContent>
                <CardFooter>
                  <Button variant="default" className="w-full">
                    {streamType === "linear" ? "Picked" : "Select"}
                  </Button>
                </CardFooter>
              </Card>

              <Card className={`cursor-pointer ${streamType === "monthly" ? "border-primary" : "border-transparent opacity-50"}`}>
                <CardHeader>
                  <CardTitle className="text-primary-foreground">Monthly Unlocks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-24 flex items-end text-primary">
                    <div className="w-1/4 bg-primary h-4 mr-1"></div>
                    <div className="w-1/4 bg-primary h-8 mr-1"></div>
                    <div className="w-1/4 bg-primary h-12 mr-1"></div>
                    <div className="w-1/4 bg-primary h-16"></div>
                  </div>
                  <CardDescription className="mt-2 text-muted-foreground">
                    Unlock assets on the same day every month
                  </CardDescription>
                  <p className="text-muted-foreground font-semibold mt-2 text-4xl">Coming soon...</p>
                  <RadioGroupItem value="monthly" className="sr-only" />
                </CardContent>
              </Card>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack}>Back</Button>
          <Button onClick={handleNext}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  )
}