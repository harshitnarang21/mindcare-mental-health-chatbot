import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SelfAssessmentPHQ9 from "@/components/SelfAssessmentPHQ9";
import { HeartPulse, MessagesSquare, BookOpen, Users, BarChart3, Languages } from "lucide-react";

export default function Index() {
  return (
    <div className="bg-gradient-to-b from-background via-background to-background">
      {/* Hero */}
      <section className="relative border-b bg-[radial-gradient(60rem_30rem_at_top_right,theme(colors.teal.100)_0%,transparent_45%)] py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Digital Mental Health & Psychological Support for Students
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Confidential, stigma‑free support tailored to your campus: AI first‑aid, self‑assessment, resources, peer support, and anonymized insights for administrators.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="/#self-check"><Button size="lg">Start Self‑Check</Button></a>
                <a href="/#features"><Button size="lg" variant="outline">Explore Features</Button></a>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">Culturally adaptive • Regional languages • Offline counsellor mapping</div>
            </div>
            <div className="relative">
              <div className="rounded-xl border bg-card p-4 shadow-xl">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Stat label="24/7 AI First‑Aid" value="Instant" />
                  <Stat label="Confidential Bookings" value="On‑campus" />
                  <Stat label="Resource Hub" value="Audio/Video" />
                  <Stat label="Peer Forum" value="Moderated" />
                  <Stat label="Admin Insights" value="Anonymous" />
                  <Stat label="Languages" value="EN · HI +" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">What you can do</h2>
              <p className="text-muted-foreground">A structured, scalable support system designed for higher education.</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon={<MessagesSquare className="h-5 w-5" />} title="AI‑guided First‑Aid" desc="Interactive chat suggests coping strategies and refers to professionals when needed." />
            <Feature icon={<HeartPulse className="h-5 w-5" />} title="Confidential Booking" desc="Book appointments with on‑campus counsellors or request helpline callbacks." />
            <Feature icon={<BookOpen className="h-5 w-5" />} title="Resource Hub" desc="Guides, videos, and relaxation audio in regional languages and campus context." />
            <Feature icon={<Users className="h-5 w-5" />} title="Peer Support" desc="Moderated peer‑to‑peer forum led by trained student volunteers." />
            <Feature icon={<BarChart3 className="h-5 w-5" />} title="Admin Dashboard" desc="Anonymous trends to plan interventions without exposing identities." />
            <Feature icon={<Languages className="h-5 w-5" />} title="Cultural & Language Fit" desc="Adapt content to local context; add institute‑specific resources and helplines." />
          </div>
        </div>
      </section>

      {/* Self Assessment */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <SelfAssessmentPHQ9 />
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="scroll-mt-24 border-t py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Psychoeducational Resources</h2>
            <p className="text-muted-foreground">Short, campus‑ready content you can localize for your students.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <ResourceCard title="5‑Minute Breathing" type="Audio" lang="English / Hindi" desc="Guided 4‑7‑8 breathing to ease anxiety and prepare for sleep." />
            <ResourceCard title="Study Stress 101" type="Video" lang="English" desc="Evidence‑based tips for exam planning and focus blocks." />
            <ResourceCard title="Grounding Exercises" type="Guide" lang="English / Regional" desc="5‑4‑3‑2‑1 grounding and progressive muscle relaxation." />
          </div>
        </div>
      </section>

      {/* About / Admin Teaser */}
      <section id="about" className="py-14">
        <div className="mx-auto max-w-6xl px-4">
          <Card>
            <CardHeader>
              <CardTitle>Why a Digital Platform for Psychological Support?</CardTitle>
              <CardDescription>
                Most apps are generic, Western‑oriented, or paid. EduMind is tailored for your institution with offline mapping to counsellors and real‑time anonymous analytics.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Early detection and preventive tools (PHQ‑9 / GAD‑7 / GHQ)</li>
                <li>Institution‑specific customization and languages</li>
                <li>Stigma‑free access via AI first‑aid and peer support</li>
                <li>Centralized monitoring and data‑driven policy planning</li>
              </ul>
              <div className="rounded-lg border p-4">
                <div className="text-sm font-semibold">Admin Dashboard (preview)</div>
                <div className="mt-2 text-sm text-muted-foreground">Anonymous weekly trends: mood, anxiety, sleep, bookings. Export for IQAC.</div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                  <div className="rounded-md bg-emerald-100 p-2 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200">Mood ↑</div>
                  <div className="rounded-md bg-yellow-100 p-2 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-200">Anxiety →</div>
                  <div className="rounded-md bg-sky-100 p-2 text-sky-900 dark:bg-sky-900/20 dark:text-sky-200">Sleep ↓</div>
                  <div className="rounded-md bg-indigo-100 p-2 text-indigo-900 dark:bg-indigo-900/20 dark:text-indigo-200">Bookings ↑</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3 text-center">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-primary">
            {icon}
          </span>
          {title}
        </CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function ResourceCard({ title, type, lang, desc }: { title: string; type: string; lang: string; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{type} • {lang}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
        <div className="mt-4">
          <Button variant="secondary" size="sm">Open</Button>
        </div>
      </CardContent>
    </Card>
  );
}
