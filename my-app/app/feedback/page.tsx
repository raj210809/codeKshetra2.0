'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

export default function FeedbackPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    satisfactionLevel: 'none',
    reasonForRating: '',
    alternativeSolution: '',
    mainBenefit: '',
    idealCustomer: '',
    improvementSuggestions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    toast({
      title: "Submitting feedback...",
      description: "Please wait while we process your response.",
    });
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: "Thank you so much for your feedback 🙏",
        description: "Your feedback helps us improve Streambill for everyone. We truly appreciate your time and insights.",
      });

      // Optional: Reset form
      setFormData({
        satisfactionLevel: 'none',
        reasonForRating: '',
        alternativeSolution: '',
        mainBenefit: '',
        idealCustomer: '',
        improvementSuggestions: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Survey</CardTitle>
          <CardDescription>Help us improve our product by answering these questions. * indicates required field</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question 1 */}
          <div className="space-y-3">
            <Label>1. How would you feel if you could no longer use Streambill? *</Label>
            <RadioGroup 
              defaultValue="none" 
              onValueChange={(value) => handleInputChange('satisfactionLevel', value)}
              value={formData.satisfactionLevel}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very-disappointed" id="very-disappointed" />
                <Label htmlFor="very-disappointed">Very disappointed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat-disappointed" id="somewhat-disappointed" />
                <Label htmlFor="somewhat-disappointed">Somewhat disappointed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-disappointed" id="not-disappointed" />
                <Label htmlFor="not-disappointed">Not disappointed</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 2 */}
          <div className="space-y-3">
            <Label>2. Please help us understand why you selected this answer? *</Label>
            <Textarea 
              placeholder="Type your answer here..." 
              value={formData.reasonForRating}
              onChange={(e) => handleInputChange('reasonForRating', e.target.value)}
              required
            />
          </div>

          {/* Question 3 - Optional */}
          <div className="space-y-3">
            <Label>3. What would you use if Streambill were no longer available? (Optional)</Label>
            <Textarea 
              placeholder="Type your answer here..." 
              value={formData.alternativeSolution}
              onChange={(e) => handleInputChange('alternativeSolution', e.target.value)}
            />
          </div>

          {/* Question 4 - Optional */}
          <div className="space-y-3">
            <Label>4. What is the main benefit you receive from using Streambill? (Optional)</Label>
            <Textarea 
              placeholder="Type your answer here..." 
              value={formData.mainBenefit}
              onChange={(e) => handleInputChange('mainBenefit', e.target.value)}
            />
          </div>

          {/* Question 5 - Optional */}
          <div className="space-y-3">
            <Label>5. What type of person do you think would benefit most from Streambill? (Optional)</Label>
            <Textarea 
              placeholder="Type your answer here..." 
              value={formData.idealCustomer}
              onChange={(e) => handleInputChange('idealCustomer', e.target.value)}
            />
          </div>

          {/* Question 6 - Optional */}
          <div className="space-y-3">
            <Label>6. How can we improve Streambill for you? (Optional)</Label>
            <Textarea 
              placeholder="Type your answer here..." 
              value={formData.improvementSuggestions}
              onChange={(e) => handleInputChange('improvementSuggestions', e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
