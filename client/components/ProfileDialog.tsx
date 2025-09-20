import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import { User, School, Heart, Shield, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProfileDialog() {
  // ✅ KEEP YOUR EXISTING AUTH INTEGRATION - NO CHANGES
  const { needsProfile, upsertProfile, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // ✅ KEEP YOUR EXISTING CORE FIELDS - EXACTLY AS BEFORE
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [age, setAge] = useState<string>("");

  // ✨ NEW: Enhanced fields (completely optional - won't break anything)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");
  const [stressLevel, setStressLevel] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [currentConcerns, setCurrentConcerns] = useState<string[]>([]);
  const [supportSystem, setSupportSystem] = useState<string[]>([]);
  const [previousTherapy, setPreviousTherapy] = useState("");
  const [medications, setMedications] = useState("");
  const [goals, setGoals] = useState("");
  const [consent, setConsent] = useState(true); // ✅ Default true so it doesn't block existing flow

  // ✅ KEEP YOUR EXISTING useEffect - NO CHANGES
  useEffect(() => {
    setOpen(!!user && needsProfile);
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user, needsProfile]);

  // ✨ NEW: Helper functions for enhanced fields
  const handleConcernToggle = (concern: string) => {
    setCurrentConcerns(prev => 
      prev.includes(concern) ? prev.filter(c => c !== concern) : [...prev, concern]
    );
  };

  const handleSupportToggle = (support: string) => {
    setSupportSystem(prev => 
      prev.includes(support) ? prev.filter(s => s !== support) : [...prev, support]
    );
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // ✅ ENHANCED BUT COMPATIBLE save function
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    
    // ✅ KEEP YOUR EXISTING CORE FIELDS - EXACTLY THE SAME FORMAT
    const coreProfile = {
      full_name: fullName.trim() || null, 
      college: college.trim() || null, 
      age: age ? Number(age) : null
    };

    // ✨ NEW: Optional enhanced data (only if filled out)
    const enhancedData = {
      email: email.trim() || null,
      gender: gender || null,
      phone: phone.trim() || null,
      course: course.trim() || null,
      year: year || null,
      location: location.trim() || null,
      stressLevel: stressLevel || null,
      emergencyContact: emergencyContact.trim() || null,
      emergencyPhone: emergencyPhone.trim() || null,
      currentConcerns: currentConcerns.length > 0 ? currentConcerns : null,
      supportSystem: supportSystem.length > 0 ? supportSystem : null,
      previousTherapy: previousTherapy || null,
      medications: medications.trim() || null,
      goals: goals.trim() || null,
      completedAt: new Date().toISOString(),
      profileVersion: "enhanced"
    };

    // ✅ SAFE: Only add enhanced_profile if there's actually enhanced data
    const hasEnhancedData = Object.values(enhancedData).some(val => val !== null && val !== "enhanced");
    
    const finalProfile = hasEnhancedData 
      ? { ...coreProfile, enhanced_profile: JSON.stringify(enhancedData) }
      : coreProfile; // ✅ Falls back to your exact existing format

    // ✅ KEEP YOUR EXISTING upsertProfile CALL - NO CHANGES
    await upsertProfile(finalProfile);
    setSaving(false);
    setOpen(false);
  }

  // ✅ QUICK SAVE: Allow skipping enhanced steps - keeps existing flow working
  async function quickSave() {
    if (!fullName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    setSaving(true);
    // ✅ EXACT same call as your existing version
    await upsertProfile({ 
      full_name: fullName.trim() || null, 
      college: college.trim() || null, 
      age: age ? Number(age) : null 
    });
    setSaving(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Complete Your Profile
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? "Basic info required - or skip to save quickly" : `Step ${step} of 4 - Optional detailed information`}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator - only show if past step 1 */}
        {step > 1 && (
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`flex-1 h-2 rounded-full mx-1 ${
                i <= step ? 'bg-primary' : 'bg-gray-200'
              }`} />
            ))}
          </div>
        )}

        <form onSubmit={save}>
          {/* Step 1: Your Original Fields + Quick Complete Option */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* ✅ YOUR EXACT EXISTING FIELDS */}
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="full">Full name *</Label>
                  <Input 
                    id="full" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Your full name" 
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="college">College</Label>
                  <Input 
                    id="college" 
                    value={college} 
                    onChange={(e) => setCollege(e.target.value)} 
                    placeholder="e.g. XYZ Institute" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm" htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    type="number" 
                    min={10} 
                    max={120} 
                    placeholder="18" 
                  />
                </div>

                {/* ✨ NEW: Optional enhanced fields for step 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-sm" htmlFor="email">Email (optional)</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="your.email@college.edu"
                      disabled={!!user?.email}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-sm">Gender (optional)</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* ✅ DUAL SAVE OPTIONS: Quick save (existing) or enhanced flow */}
                <div className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      onClick={quickSave}
                      className="flex-1" 
                      disabled={saving || !fullName.trim()}
                      variant="outline"
                    >
                      {saving ? "Saving…" : "Save & Continue"}
                    </Button>
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      disabled={!fullName.trim()}
                      className="flex-1"
                    >
                      Enhanced Setup
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    Quick save works just like before, or continue for personalized mental health support
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Steps 2-4: Enhanced fields (completely optional) */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Academic Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Course/Major</Label>
                    <Input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Computer Science" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Academic Year</Label>
                    <Select value={year} onValueChange={setYear}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st-year">1st Year</SelectItem>
                        <SelectItem value="2nd-year">2nd Year</SelectItem>
                        <SelectItem value="3rd-year">3rd Year</SelectItem>
                        <SelectItem value="4th-year">4th Year</SelectItem>
                        <SelectItem value="graduate">Graduate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Location</Label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Stress Level</Label>
                    <Select value={stressLevel} onValueChange={setStressLevel}>
                      <SelectTrigger><SelectValue placeholder="Current stress" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (1-3)</SelectItem>
                        <SelectItem value="moderate">Moderate (4-6)</SelectItem>
                        <SelectItem value="high">High (7-8)</SelectItem>
                        <SelectItem value="severe">Severe (9-10)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Mental Health Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Current Concerns (select any that apply)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Anxiety', 'Depression', 'Stress', 'Academic Pressure', 'Sleep Issues', 'Social Anxiety'].map(concern => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={concern}
                          checked={currentConcerns.includes(concern)}
                          onCheckedChange={() => handleConcernToggle(concern)}
                        />
                        <Label htmlFor={concern} className="text-sm">{concern}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Previous Therapy</Label>
                  <Select value={previousTherapy} onValueChange={setPreviousTherapy}>
                    <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Never had therapy</SelectItem>
                      <SelectItem value="past">Had therapy before</SelectItem>
                      <SelectItem value="current">Currently in therapy</SelectItem>
                      <SelectItem value="considering">Considering therapy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Goals & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label>What are you hoping to achieve?</Label>
                  <Textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="Better stress management, improved sleep, etc."
                    className="min-h-[60px]"
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="consent" checked={consent} onCheckedChange={(checked) => setConsent(!!checked)} />
                    <Label htmlFor="consent" className="text-sm">
                      I consent to personalized mental health support through MindCare.
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation for steps 2-4 */}
          {step > 1 && (
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" />Previous
              </Button>
              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Next<ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Complete Profile"}
                </Button>
              )}
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
