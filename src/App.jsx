import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const EVENTS = [
  "Mehendi Ceremony",
  "Sangeet Night",
  "Wedding Ceremony",
  "Reception Dinner",
  "Post-Wedding Brunch"
];

export default function WeddingRSVPApp() {
  const [name, setName] = useState("");
  const [responses, setResponses] = useState(
      EVENTS.reduce((acc, event) => ({ ...acc, [event]: false }), {})
  );
  const [submitted, setSubmitted] = useState(false);

  const handleCheckboxChange = (eventName) => {
    setResponses((prev) => ({ ...prev, [eventName]: !prev[eventName] }));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    setSubmitted(true);
    console.log("RSVP Submitted:", { name, responses });
  };

  if (submitted) {
    return (
        <div className="max-w-xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Thank you, {name}!</h1>
          <p className="text-lg">Your RSVP has been recorded.</p>
        </div>
    );
  }

  return (
      <div className="max-w-xl mx-auto p-6">
        <Card className="p-6">
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">Wedding RSVP</h1>
            <div className="mb-4">
              <Label htmlFor="name">Your Name</Label>
              <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
              />
            </div>
            <div className="mb-4">
              <h2 className="font-semibold mb-2">Events you'll attend:</h2>
              {EVENTS.map((event) => (
                  <div key={event} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                        id={event}
                        checked={responses[event]}
                        onCheckedChange={() => handleCheckboxChange(event)}
                    />
                    <Label htmlFor={event}>{event}</Label>
                  </div>
              ))}
            </div>
            <Button onClick={handleSubmit} className="w-full">
              Submit RSVP
            </Button>
          </CardContent>
        </Card>
      </div>
  );
}
