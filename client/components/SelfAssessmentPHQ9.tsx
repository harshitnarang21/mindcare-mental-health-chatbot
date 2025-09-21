import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BookingDialog from "@/components/BookingDialog";
import { BarChart3, Heart, AlertTriangle, CheckCircle, RefreshCw, Calendar, ExternalLink, Shield } from "lucide-react";

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

function classify(score: number): { level: string; color: string; bgColor: string; advice: string; icon: any } {
  if (score <= 4) return { 
    level: "Minimal", 
    color: "text-emerald-400", 
    bgColor: "from-emerald-500/10 to-green-500/10",
    advice: "Keep healthy routines and reach out if symptoms increase.",
    icon: CheckCircle
  };
  if (score <= 9) return { 
    level: "Mild", 
    color: "text-yellow-400", 
    bgColor: "from-yellow-500/10 to-orange-500/10",
    advice: "Try self‑care strategies and check back in 1–2 weeks.",
    icon: AlertTriangle
  };
  if (score <= 14) return { 
    level: "Moderate", 
    color: "text-orange-400", 
    bgColor: "from-orange-500/10 to-red-500/10",
    advice: "Consider speaking to a counsellor. Early help is effective.",
    icon: Heart
  };
  if (score <= 19) return { 
    level: "Moderately severe", 
    color: "text-red-400", 
    bgColor: "from-red-500/10 to-pink-500/10",
    advice: "We recommend a confidential appointment with the counsellor.",
    icon: AlertTriangle
  };
  return { 
    level: "Severe", 
    color: "text-red-400", 
    bgColor: "from-red-500/20 to-pink-500/20",
    advice: "Please seek professional help urgently. If in danger, call emergency services.",
    icon: AlertTriangle
  };
}

export default function SelfAssessmentPHQ9() {
  const [answers, setAnswers] = useState(Array(PHQ9_QUESTIONS.length).fill(-1));
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
    <div className="space-y-6">
      {/* Main Assessment Card */}
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-200">PHQ‑9 Self‑Assessment</CardTitle>
          <CardDescription className="text-gray-400">
            Over the last 2 weeks, how often have you been bothered by any of the following problems?
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Questions */}
          {PHQ9_QUESTIONS.map((q, i) => (
            <Card key={i} className="bg-gray-900/30 backdrop-blur-sm border-gray-600/30 shadow-sm">
              <CardContent className="p-4">
                <Label className="text-gray-200 font-medium mb-4 block">
                  {i + 1}. {q}
                </Label>
                <RadioGroup
                  value={answers[i]?.toString()}
                  onValueChange={(v) =>
                    setAnswers((arr) => {
                      const next = [...arr];
                      next[i] = Number(v);
                      return next;
                    })
                  }
                  className="grid gap-3 sm:grid-cols-2 md:grid-cols-4"
                >
                  {OPTIONS.map((o) => (
                    <div key={o.value} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                      <RadioGroupItem 
                        value={o.value.toString()} 
                        id={`q${i}-${o.value}`}
                        className="border-gray-500 text-orange-400 focus:ring-orange-400"
                      />
                      <Label htmlFor={`q${i}-${o.value}`} className="text-sm text-gray-300 cursor-pointer flex-1">
                        {o.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {/* Score Display */}
          {done && (
            <Card className={`bg-gradient-to-r ${cls.bgColor} border-gray-600/50 backdrop-blur-sm`}>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <cls.icon className={`w-8 h-8 ${cls.color}`} />
                  <div>
                    <p className="text-2xl font-bold text-gray-200">
                      Score: {score}
                    </p>
                    <p className={`text-lg font-semibold ${cls.color}`}>
                      {cls.level}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={reset}
              variant="outline"
              className="bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white backdrop-blur-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={() => setSubmitted(true)} 
              disabled={!done}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Guidance
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {submitted && done && (
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-200">
              <Heart className="w-5 h-5 text-orange-400" />
              Your Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Advice Card */}
            <Card className={`bg-gradient-to-r ${cls.bgColor} border-gray-600/30 backdrop-blur-sm`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <cls.icon className={`w-6 h-6 ${cls.color} mt-1`} />
                  <p className="text-gray-200 leading-relaxed">{cls.advice}</p>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Button 
                onClick={() => setBookOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Confidential Appointment
              </Button>
              <Button 
                variant="outline"
                className="bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white backdrop-blur-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Explore Relaxation Resources
              </Button>
            </div>

            {/* Disclaimer */}
            <Card className="bg-gray-900/50 border-orange-400/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div className="text-sm text-gray-300 space-y-1">
                    <p className="font-medium text-orange-300">Important Notice</p>
                    <p>This screening is informational and not a diagnosis. If you selected item 9 above or feel at risk, please seek immediate help.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      <BookingDialog open={bookOpen} onOpenChange={setBookOpen} />
    </div>
  );
}
