import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";

export default function ProfileDialog() {
  const { needsProfile, upsertProfile, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [age, setAge] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setOpen(!!user && needsProfile);
  }, [user, needsProfile]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await upsertProfile({ full_name: fullName.trim() || null, college: college.trim() || null, age: age ? Number(age) : null });
    setSaving(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription>We’ll use your name to greet you and show on community posts.</DialogDescription>
        </DialogHeader>
        <form onSubmit={save} className="space-y-3">
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="full">Full name</label>
            <Input id="full" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Your full name" required />
          </div>
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="college">College</label>
            <Input id="college" value={college} onChange={(e)=>setCollege(e.target.value)} placeholder="e.g. XYZ Institute" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="age">Age</label>
            <Input id="age" value={age} onChange={(e)=>setAge(e.target.value)} type="number" min={10} max={120} placeholder="18" />
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
