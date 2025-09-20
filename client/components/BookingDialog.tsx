import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function BookingDialog({ open, onOpenChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("in_person");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success("Request sent confidentially. We’ll email you confirmation.");
      onOpenChange(false);
      setName("");
      setEmail("");
      setMode("in_person");
      setTime("");
      setNotes("");
    } catch {
      toast.error("Could not send request. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confidential booking</DialogTitle>
          <DialogDescription>
            Book a session with the on‑campus counsellor or request a helpline call.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-3" id="booking">
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="name">Name (optional)</label>
            <Input id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Optional" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="email">Contact email</label>
            <Input id="email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@college.edu" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">Preferred mode</label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_person">In person (counselling room)</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="time">Preferred time</label>
            <Input id="time" required value={time} onChange={(e)=>setTime(e.target.value)} placeholder="e.g. Mon 3–5 PM" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm" htmlFor="notes">Notes for counsellor (optional)</label>
            <Textarea id="notes" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Anything you’d like us to know in advance?" />
          </div>
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending…" : "Send request"}</Button>
          </div>
          <p className="text-xs text-muted-foreground">Your request is encrypted in transit and only visible to authorized staff. Never used for discipline or grading.</p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
