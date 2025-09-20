import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BookingDialog from "@/components/BookingDialog";

const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself",
];

const OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

function classify(score: number): { level: string; color: string; advice: string } {
  if (score <= 4) return { level: "Minimal", color: "text-emerald-600", advice: "Keep healthy routines and reach out if symptoms increase." };
  if (score <= 9) return { level: "Mild", color: "text-yellow-600", advice: "Try self‑care strategies and check back in 1–2 weeks." };
  if (score <= 14) return { level: "Moderate", color: "text-orange-600", advice: "Consider speaking to a counsellor. Early help is effective." };
  if (score <= 19) return { level: "Moderately severe", color: "text-red-600", advice: "We recommend a confidential appointment with the counsellor." };
  return { level: "Severe", color: "text-red-700", advice: "Please seek professional help urgently. If in danger, call emergency services." };
}

export default function SelfAssessmentPHQ9() {
  const [answers, setAnswers] = useState<number[]>(Array(PHQ9_QUESTIONS.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const score = useMemo(() => answers.reduce((a, b) => a + Math.max(b, 0), 0), [answers]);
  const done = useMemo(() => answers.every((v) => v >= 0), [answers]);
  const cls = classify(score);

  function reset() {
    setAnswers(Array(PHQ9_QUESTIONS.length).fill(-1));
    setSubmitted(false);
  }

  return (
    <section id="self-check" className="scroll-mt-24">
      <Card>
        <CardHeader>
          <CardTitle>PHQ‑9 Self‑Assessment</CardTitle>
          <CardDescription>
            Over the last 2 weeks, how often have you been bothered by any of the following problems?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ol className="space-y-6">
            {PHQ9_QUESTIONS.map((q, i) => (
              <li key={i} className="rounded-lg border p-4">
                <div className="mb-3 font-medium">{i + 1}. {q}</div>
                <RadioGroup
                  value={String(answers[i])}
                  onValueChange={(v) => setAnswers((arr) => { const next = [...arr]; next[i] = Number(v); return next; })}
                  className="grid gap-2 sm:grid-cols-2 md:grid-cols-4"
                >
                  {OPTIONS.map((o) => (
                    <div key={o.value} className="flex items-center gap-2 rounded-md border p-2">
                      <RadioGroupItem id={`q${i}-${o.value}`} value={String(o.value)} />
                      <Label className="cursor-pointer" htmlFor={`q${i}-${o.value}`}>{o.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div className="text-sm text-muted-foreground">Score: <span className="font-semibold text-foreground">{score}</span> · <span className={cls.color}>{cls.level}</span></div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={reset}>Reset</Button>
              <Button disabled={!done} onClick={() => setSubmitted(true)}>View guidance</Button>
            </div>
          </div>

          {submitted && (
            <div className="rounded-lg border bg-secondary/30 p-4">
              <div className="mb-1 text-sm font-semibold">Recommendation</div>
              <p className="text-sm text-muted-foreground">{cls.advice}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => setBookOpen(true)}>Book confidential appointment</Button>
                <a href="/#resources" className="text-sm text-primary underline-offset-4 hover:underline">Explore relaxation audio & guides</a>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">This screening is informational and not a diagnosis. If you selected item 9 above or feel at risk, please seek immediate help.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <BookingDialog open={bookOpen} onOpenChange={setBookOpen} />
    </section>
  );
}
