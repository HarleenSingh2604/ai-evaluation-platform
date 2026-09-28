import { useEffect, useState } from "react";

import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  LayoutDashboard,
  Menu,
  Plus,
  Settings,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

function App() {
  const [page, setPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [strengths, setStrengths] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatus, setHistoryStatus] = useState("All");

  useEffect(() => {
  const loadEvaluations = async () => {
    try {
      const result = await fetch("http://127.0.0.1:8000/evaluations");

      if (!result.ok) {
        throw new Error("Failed to load evaluations.");
      }

      const data = await result.json();

      setEvaluations(data);
    } catch (err) {
      console.error("Could not load evaluations:", err);
    }
  };

  loadEvaluations();
}, []);
const scoreDistribution = {
  excellent: evaluations.filter((evaluation) => evaluation.score >= 90).length,
  good: evaluations.filter(
    (evaluation) => evaluation.score >= 80 && evaluation.score < 90
  ).length,
  fair: evaluations.filter(
    (evaluation) => evaluation.score >= 70 && evaluation.score < 80
  ).length,
  below: evaluations.filter((evaluation) => evaluation.score < 70).length,
};


const dimensionAverages = {
  correctness:
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) => sum + evaluation.correctness,
            0
          ) / evaluations.length
        )
      : 0,

  relevance:
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) => sum + evaluation.relevance,
            0
          ) / evaluations.length
        )
      : 0,

  clarity:
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) => sum + evaluation.clarity,
            0
          ) / evaluations.length
        )
      : 0,

  completeness:
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) => sum + evaluation.completeness,
            0
          ) / evaluations.length
        )
      : 0,
};


const filteredEvaluations = evaluations.filter((evaluation) =>
  evaluation.prompt
    .toLowerCase()
    .includes(historySearch.toLowerCase())
);
  
  const handleRunEvaluation = async () => {
  if (!prompt.trim() || !response.trim()) {
    setError("Please enter both a user prompt and an AI response.");
    setLoading(true);
    return;
  }

  setError("");

  try {
    const result = await fetch("http://127.0.0.1:8000/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        response,
      }),
    });

    if (!result.ok) {
      throw new Error("The backend could not process the evaluation.");
    }

    const data = await result.json();
    setScore(data.score);
    setStatus(data.status);
    setReasoning(data.reasoning);
    setStrengths(data.strengths);
    setSuggestions(data.suggestions);
    const evaluationsResult = await fetch(
  "http://127.0.0.1:8000/evaluations"
);

if (evaluationsResult.ok) {
  const evaluationsData = await evaluationsResult.json();
  setEvaluations(evaluationsData);
}

    console.log("Backend response:", data);

    setPage("evaluation-result");
  } catch (err) {
    setError("Could not connect to the backend. Make sure FastAPI is running.");
    console.error(err);
    setLoading(false);
  }
};

  if (page === "new-evaluation") {
    return (
      <div
  className={`min-h-screen ${
    darkMode
      ? "bg-slate-950 text-slate-100"
      : "bg-slate-50 text-slate-900"
  }`}
>
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => setPage("dashboard")}
              className="mb-5 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Back to Dashboard
            </button>
  
            <p
  className={`mb-2 text-sm font-medium ${
    darkMode ? "text-slate-400" : "text-slate-500"
  }`}
>
  Evaluation Workspace
</p>

<h1
  className={`text-3xl font-bold tracking-tight ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  New Evaluation
</h1>

<p
  className={`mt-2 max-w-2xl text-sm ${
    darkMode ? "text-slate-400" : "text-slate-500"
  }`}
>
  Evaluate an AI-generated response against a set of quality
  criteria.
</p>
          </div>
  
          {/* Form */}
          <div
  className={`min-h-full space-y-6 ${
    darkMode ? "text-slate-100" : "text-slate-900"
  }`}
>
            {/* Prompt */}
            <section
            className={`rounded-2xl border p-6 ${
              darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
             }`}
              >
              <div className="mb-4">
                <h2
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  User Prompt
</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Enter the question or instruction given to the AI.
                </p>
              </div>
  
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Explain quantum computing to a beginner..."
className={`min-h-32 w-full resize-y rounded-xl border p-4 text-sm outline-none transition ${
  darkMode
    ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 focus:bg-slate-800"
    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
}`}              />
            </section>
  
            {/* AI Response */}
            <section
  className={`rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
              <div className="mb-4">
                <h2
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  AI Response
</h2>
                <p className="mt-1 text-xs text-slate-400">
                  Paste the response you want to evaluate.
                </p>
              </div>
  
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Paste the AI-generated response here..."
                className={`min-h-48 w-full resize-y rounded-xl border p-4 text-sm outline-none transition ${
  darkMode
    ? "border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 focus:bg-slate-800"
    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
}`}
              />
            </section>
  
            {/* Criteria */}
<section
  className={`rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
  <div className="mb-5">
    <h2
      className={`font-semibold ${
        darkMode ? "text-slate-100" : "text-slate-950"
      }`}
    >
      Evaluation Criteria
    </h2>

    <p
      className={`mt-1 text-xs ${
        darkMode ? "text-slate-400" : "text-slate-500"
      }`}
    >
      Every response is evaluated across four standard quality dimensions.
    </p>
  </div>

  <div className="grid gap-3 sm:grid-cols-2">
    {[
      "Correctness",
      "Relevance",
      "Clarity",
      "Completeness",
    ].map((criterion) => (
      <div
        key={criterion}
        className={`rounded-xl border p-4 ${
          darkMode
            ? "border-slate-700 bg-slate-800"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <p
          className={`text-sm font-medium ${
            darkMode ? "text-slate-200" : "text-slate-700"
          }`}
        >
          {criterion}
        </p>
      </div>
    ))}
  </div>
</section>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
               {error}
              </div>
           )}
  
            {/* Action */}
            <div className="flex justify-end">
            <button
  onClick={handleRunEvaluation}
  disabled={loading}
  className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
>
                <Sparkles size={17} />
                {loading ? "Evaluating..." : "Run Evaluation"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (page === "evaluation-result") {
    return (
      <div
  className={`min-h-screen ${
    darkMode
      ? "bg-slate-950 text-slate-100"
      : "bg-slate-50 text-slate-900"
  }`}
>
        <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
          <button
            onClick={() => setPage("new-evaluation")}
            className={`mb-5 text-sm font-medium ${
  darkMode
    ? "text-slate-400 hover:text-slate-100"
    : "text-slate-500 hover:text-slate-900"
}`}
          >
            ← Back to Evaluation
          </button>

          <div className="mb-8">
            <p
  className={`mb-2 text-sm font-medium ${
    darkMode ? "text-slate-400" : "text-slate-500"
  }`}
>
  Evaluation Complete
</p>

<h1
  className={`text-3xl font-bold tracking-tight ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  Evaluation Result
</h1>

<p
  className={`mt-2 text-sm ${
    darkMode ? "text-slate-400" : "text-slate-500"
  }`}
>
  AI response quality analysis and scoring.
</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
  <section
  className={`rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
    <h2
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  Submitted Prompt
</h2>

<p
  className={`mt-3 text-sm leading-6 ${
    darkMode ? "text-slate-300" : "text-slate-600"
  }`}
>
  {prompt}
</p>
  </section>

  <section
  className={`rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
    <h2
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  Submitted AI Response
</h2>

<p
  className={`mt-3 text-sm leading-6 ${
    darkMode ? "text-slate-300" : "text-slate-600"
  }`}
>
  {response}
</p>
  </section>
</div>
            <div
  className={`mt-6 rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                User Prompt
              </p>

              <p
  className={`mt-3 text-sm leading-6 ${
    darkMode ? "text-slate-300" : "text-slate-700"
  }`}
>
  {prompt}
</p>
            </div>
            <div
  className={`mt-4 rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
    AI Response
  </p>

  <p
  className={`mt-3 whitespace-pre-wrap text-sm leading-6 ${
    darkMode ? "text-slate-300" : "text-slate-700"
  }`}
>
  {response}
</p>
</div>
          </div>

          {/* Overall Score */}
<section
  className={`rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p
        className={`text-sm font-medium ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Overall Score
      </p>

      <p
        className={`mt-2 text-6xl font-bold tracking-tight ${
          darkMode ? "text-slate-100" : "text-slate-950"
        }`}
      >
        {score}
        <span className="text-2xl text-slate-400">/100</span>
      </p>

      <div
        className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
          status === "Passed"
            ? darkMode
              ? "bg-emerald-950 text-emerald-300"
              : "bg-emerald-50 text-emerald-600"
            : status === "Needs Review"
            ? darkMode
              ? "bg-amber-950 text-amber-300"
              : "bg-amber-50 text-amber-600"
            : darkMode
            ? "bg-red-950 text-red-300"
            : "bg-red-50 text-red-600"
        }`}
      >
        {status}
      </div>
    </div>

    <div
      className={`flex h-32 w-32 items-center justify-center rounded-full border-[12px] ${
        darkMode ? "border-slate-200" : "border-slate-900"
      }`}
    >
      <span
        className={`text-2xl font-bold ${
          darkMode ? "text-slate-100" : "text-slate-950"
        }`}
      >
        {score}%
      </span>
    </div>
  </div>
</section>

<div className="mt-4 grid gap-4 sm:grid-cols-3">
  {/* Status */}
  <div
    className={`rounded-2xl border p-5 ${
      darkMode
        ? "border-slate-800 bg-slate-900"
        : "border-slate-200 bg-white"
    }`}
  >
    <p className="text-xs font-medium text-slate-400">
      Status
    </p>

    <p
      className={`mt-2 text-lg font-semibold ${
        status === "Passed"
          ? "text-emerald-500"
          : status === "Needs Review"
          ? "text-amber-500"
          : "text-red-500"
      }`}
    >
      {status}
    </p>
  </div>

  {/* Evaluation */}
  <div
    className={`rounded-2xl border p-5 ${
      darkMode
        ? "border-slate-800 bg-slate-900"
        : "border-slate-200 bg-white"
    }`}
  >
    <p className="text-xs font-medium text-slate-400">
      Evaluation
    </p>

    <p
      className={`mt-2 text-lg font-semibold ${
        darkMode ? "text-slate-100" : "text-slate-950"
      }`}
    >
      AI Analysis
    </p>
  </div>
</div>

        {/* Dimensions */}
        
          <section
  className={`mt-6 rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-950"
      : "border-slate-200 bg-white"
  }`}
>
            <div className="mb-6">
              <h2
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  Evaluation Dimensions
</h2>

              <p className="mt-1 text-xs text-slate-400">
                Performance across each selected criterion.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ResultDimension
               label="Correctness"
               score={dimensionAverages.correctness}
               darkMode={darkMode}
/>

<ResultDimension
  label="Relevance"
  score={dimensionAverages.relevance}
  darkMode={darkMode}
/>

<ResultDimension
  label="Clarity"
  score={dimensionAverages.clarity}
  darkMode={darkMode}
/>

<ResultDimension
  label="Completeness"
  score={dimensionAverages.completeness}
  darkMode={darkMode}
/>
            </div>
          </section>

          {/* Analysis */}
<section
  className={`mt-6 rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
  <h2
    className={`font-semibold ${
      darkMode ? "text-slate-100" : "text-slate-950"
    }`}
  >
    AI Analysis
  </h2>

  <div className="mt-5 space-y-5">
    {/* Reasoning */}
    <div>
      <p
        className={`text-sm font-semibold ${
          darkMode ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Reasoning
      </p>

      <p
        className={`mt-2 text-sm leading-6 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {reasoning}
      </p>
    </div>

    {/* Strengths */}
    <div>
      <p
        className={`text-sm font-semibold ${
          darkMode ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Strengths
      </p>

      <ul
        className={`mt-2 list-disc space-y-1 pl-5 text-sm ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {strengths.map((strength) => (
          <li key={strength}>{strength}</li>
        ))}
      </ul>
    </div>

    {/* Suggestions */}
    <div>
      <p
        className={`text-sm font-semibold ${
          darkMode ? "text-slate-200" : "text-slate-800"
        }`}
      >
        Suggestions
      </p>

      <div
        className={`mt-2 space-y-2 text-sm leading-6 ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {suggestions.map((suggestion) => (
          <p key={suggestion}>{suggestion}</p>
        ))}
      </div>
    </div>
  </div>
</section>
        </div>
      </div>
    );
  }
  return (
    <div
  className={`min-h-screen ${
    darkMode
      ? "bg-slate-950 text-slate-100"
      : "bg-slate-50 text-slate-900"
  }`}
>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
  className={`hidden w-64 border-r lg:flex lg:flex-col ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Sparkles size={19} />
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-tight">
                EvalAI
              </h1>
              <p className="text-xs text-slate-400">Evaluation Platform</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-5">
            <NavItem
             icon={<LayoutDashboard size={18} />}
             label="Dashboard"
             active={page === "dashboard"}
             onClick={() => setPage("dashboard")}
            />
            <NavItem
              icon={<Plus size={18} />}
              label="New Evaluation"
              onClick={() => setPage("new-evaluation")}
            />
            <NavItem
              icon={<FileText size={18} />}
              label="Evaluation History"
              active={page === "evaluation-history"}
              onClick={() => setPage("evaluation-history")}
             />
            
          </nav>

          <div className="border-t border-slate-200 p-3">
            <NavItem
  icon={<Settings size={18} />}
  label="Settings"
  active={page === "settings"}
  onClick={() => setPage("settings")}
/>

            <div
  className={`mt-3 flex items-center gap-3 rounded-xl p-3 ${
    darkMode ? "bg-slate-800" : "bg-slate-50"
  }`}
>
  <div
    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
      darkMode
        ? "bg-slate-700 text-slate-200"
        : "bg-slate-200 text-slate-700"
    }`}
  >
    HS
  </div>

  <div className="min-w-0 flex-1">
    <p
      className={`truncate text-sm font-semibold ${
        darkMode ? "text-slate-100" : "text-slate-900"
      }`}
    >
      User
    </p>

    <p className="truncate text-xs text-slate-400">
      Portfolio Project
    </p>
  </div>

  <ChevronDown
    size={15}
    className={darkMode ? "text-slate-500" : "text-slate-400"}
  />
</div>
          </div>
        </aside>

        {/* Main */}
        <main
  className={`min-w-0 flex-1 ${
    darkMode ? "bg-slate-950" : "bg-slate-50"
  }`}
>
          {/* Top bar */}
          <header
  className={`flex h-16 items-center justify-between border-b px-5 sm:px-8 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
            <div className="flex items-center gap-3">
              <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden">
                <Menu size={20} />
              </button>

              <div>
                <p className="text-xs text-slate-400">Workspace</p>
                <p
  className={`text-sm font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-900"
  }`}
>
  AI Evaluation Platform
</p>
              </div>
            </div>

          </header>

         
        {page === "settings" && (
  <div className="space-y-6">
    <div>
      <h1
        className={`text-xl font-bold ${
          darkMode ? "text-slate-100" : "text-slate-950"
        }`}
      >
        Settings
      </h1>

      <p
        className={`mt-1 text-sm ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Manage your evaluation platform preferences.
      </p>
    </div>

    {/* Appearance */}
    <section
      className={`rounded-2xl border p-6 ${
        darkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <h2
        className={`font-semibold ${
          darkMode ? "text-slate-100" : "text-slate-950"
        }`}
      >
        Appearance
      </h2>

      <p
        className={`mt-1 text-sm ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        Choose how the evaluation platform looks.
      </p>

      <div
        className={`mt-5 flex items-center justify-between rounded-xl p-4 ${
          darkMode ? "bg-slate-800" : "bg-slate-50"
        }`}
      >
        <div>
          <p
            className={`text-sm font-medium ${
              darkMode ? "text-slate-100" : "text-slate-900"
            }`}
          >
            Theme
          </p>

          <p
            className={`mt-1 text-xs ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {darkMode
              ? "Dark theme is currently active."
              : "Light theme is currently active."}
          </p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition ${
            darkMode
              ? "bg-slate-700 text-slate-100 hover:bg-slate-600"
              : "bg-white text-slate-700 hover:bg-slate-100"
          }`}
        >
          {darkMode ? "Dark" : "Light"}
        </button>
      </div>
    </section>
  

    <section
  className={`rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
      <h2
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  AI Evaluation
</h2>

      <p
  className={`mt-1 text-sm ${
    darkMode ? "text-slate-400" : "text-slate-500"
  }`}
>
  Information about the AI evaluation engine.
</p>

<div
  className={`mt-5 flex items-center justify-between rounded-xl p-4 ${
    darkMode ? "bg-slate-800" : "bg-slate-50"
  }`}
>
  <div>
    <p
      className={`text-sm font-medium ${
        darkMode ? "text-slate-100" : "text-slate-900"
      }`}
    >
      Evaluation Model
    </p>

    <p
      className={`mt-1 text-xs ${
        darkMode ? "text-slate-400" : "text-slate-500"
      }`}
    >
      Used to evaluate AI-generated responses.
    </p>
  </div>

  <span
    className={`rounded-lg px-3 py-2 text-sm font-medium shadow-sm ${
      darkMode
        ? "bg-slate-700 text-slate-100"
        : "bg-white text-slate-700"
    }`}
  >
    GPT-5.6 Luna
  </span>
</div>
    </section>

    <section
  className={`rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
     <h2
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  Connection
</h2>

      <p
  className={`mt-1 text-sm ${
    darkMode ? "text-slate-400" : "text-slate-500"
  }`}
>
  Current platform connection status.
</p>

<div
  className={`mt-5 flex items-center justify-between rounded-xl p-4 ${
    darkMode ? "bg-slate-800" : "bg-slate-50"
  }`}
>
  <div>
    <p
      className={`text-sm font-medium ${
        darkMode ? "text-slate-100" : "text-slate-900"
      }`}
    >
      API Connection
    </p>

    <p
      className={`mt-1 text-xs ${
        darkMode ? "text-slate-400" : "text-slate-500"
      }`}
    >
      The evaluation backend is available.
    </p>
  </div>

  <span
    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
      darkMode
        ? "bg-emerald-950 text-emerald-300"
        : "bg-emerald-50 text-emerald-700"
    }`}
  >
    Connected
  </span>
</div>
</section>

    <section
  className={`rounded-2xl border p-6 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
      <h2
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  About
</h2>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        AI Evaluation Platform helps teams test and analyze
        AI-generated responses using structured evaluation criteria.
      </p>
    </section>
  </div>
)}

          {page === "dashboard" && (
  <>
          <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
            <div className="mb-8">
              <p
  className={`mb-2 text-sm font-medium ${
    darkMode ? "text-slate-400" : "text-slate-500"
  }`}
>
  Overview
</p>

              <h2
  className={`text-3xl font-bold tracking-tight ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  Evaluation Dashboard
</h2>

              <p
  className={`mt-2 max-w-2xl text-sm ${
    darkMode ? "text-slate-400" : "text-slate-500"
  }`}
>
  Monitor the quality and performance of your AI-generated responses.
</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Evaluations"
                value={String(evaluations.length)}
                change=""
                icon={<FileText size={19} />}
                darkMode={darkMode}
              />

              <StatCard
                title="Average Score"
                value={
  evaluations.length > 0
    ? (
        evaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) /
        evaluations.length
      ).toFixed(1)
    : "0.0"
}
                change=""
                icon={<TrendingUp size={19} />}
                darkMode={darkMode}
              />

              <StatCard
                title="Pass Rate"
                value={
  evaluations.length > 0
    ? `${(
        (evaluations.filter(
          (evaluation) => evaluation.status === "Passed"
        ).length /
          evaluations.length) *
        100
      ).toFixed(1)}%`
    : "0.0%"
}
                change=""
                icon={<CheckCircle2 size={19} />}
                darkMode={darkMode}
              />

              <StatCard
                title="Needs Review"
                value={String(
  evaluations.filter(
    (evaluation) => evaluation.status === "Needs Review"
  ).length
)}
                change=""
                icon={<Clock3 size={19} />}
                darkMode={darkMode}
              />
            </div>

            {/* Main grid */}
            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              {/* Recent evaluations */}
              <section
  className={`rounded-2xl border xl:col-span-2 ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
  <div
    className={`flex items-center justify-between border-b px-6 py-5 ${
      darkMode ? "border-slate-800" : "border-slate-100"
    }`}
  >
    <div>
      <h3
        className={`font-semibold ${
          darkMode ? "text-slate-100" : "text-slate-950"
        }`}
      >
        Recent Evaluations
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        Your latest AI response evaluations
      </p>
    </div>

                  <button
                    className="..."
                    onClick={() => setPage("evaluation-history")}
                    >
                    View all
                    </button>
                </div>

                <div
  className={`divide-y ${
    darkMode ? "divide-slate-800" : "divide-slate-100"
  }`}
>
  {evaluations.length === 0 ? (
    <div className="px-6 py-8 text-center text-sm text-slate-500">
      No evaluations yet.
    </div>
  ) : (
    evaluations.slice(0, 5).map((evaluation) => (
      <EvaluationRow
        key={evaluation.id}
        title={evaluation.prompt}
        model="AI Evaluator"
        score={String(evaluation.score)}
        status={
          evaluation.status === "Needs Review"
            ? "Review"
            : evaluation.status
        }
        darkMode={darkMode}
      />
    ))
  )}
</div>
              </section>

              {/* Score distribution */}
              <section
  className={`rounded-2xl border ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
  <div
    className={`border-b px-6 py-5 ${
      darkMode ? "border-slate-800" : "border-slate-100"
    }`}
  >
    <h3
      className={`font-semibold ${
        darkMode ? "text-slate-100" : "text-slate-950"
      }`}
    >
      Quality Overview
    </h3>

    <p className="mt-1 text-xs text-slate-400">
      Evaluation score distribution
    </p>
  </div>

  <div className="p-6">
    <div className="flex items-end justify-between">
      <div>
        <p
          className={`text-4xl font-bold tracking-tight ${
            darkMode ? "text-slate-100" : "text-slate-950"
          }`}
        >
          {evaluations.length > 0
  ? (
      evaluations.reduce(
        (sum, evaluation) => sum + evaluation.score,
        0
      ) / evaluations.length
    ).toFixed(1)
  : "0.0"}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Average score
        </p>
      </div>

                    <div
  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
    darkMode
      ? "bg-slate-800 text-slate-300"
      : "bg-slate-100 text-slate-600"
  }`}
>
  <TrendingUp size={13} />
  Live
</div>
                  </div>

                  <div className="mt-8 space-y-5">
  <ProgressRow
    label="90–100"
    value={
      evaluations.length > 0
        ? `${((scoreDistribution.excellent / evaluations.length) * 100).toFixed(1)}%`
        : "0%"
    }
    darkMode={darkMode}
  />

  <ProgressRow
    label="80–89"
    value={
      evaluations.length > 0
        ? `${((scoreDistribution.good / evaluations.length) * 100).toFixed(1)}%`
        : "0%"
    }
    darkMode={darkMode}
  />

  <ProgressRow
    label="70–79"
    value={
      evaluations.length > 0
        ? `${((scoreDistribution.fair / evaluations.length) * 100).toFixed(1)}%`
        : "0%"
    }
    darkMode={darkMode}
  />

  <ProgressRow
    label="Below 70"
    value={
      evaluations.length > 0
        ? `${((scoreDistribution.below / evaluations.length) * 100).toFixed(1)}%`
        : "0%"
    }
    darkMode={darkMode}
  />
</div>
                </div>
              </section>
            </div>

            {/* Evaluation dimensions */}
            <section
  className={`mt-6 rounded-2xl border ${
    darkMode
      ? "border-slate-800 bg-slate-900"
      : "border-slate-200 bg-white"
  }`}
>
              <div
  className={`border-b px-6 py-5 ${
    darkMode ? "border-slate-800" : "border-slate-100"
  }`}
>
                <h3
  className={`font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
                  Evaluation Dimensions
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Average performance across evaluation criteria
                </p>
              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
                <Dimension
  label="Correctness"
  score={`${dimensionAverages.correctness}`}
  darkMode={darkMode}
/>

<Dimension
  label="Relevance"
  score={`${dimensionAverages.relevance}`}
  darkMode={darkMode}
/>

<Dimension
  label="Clarity"
  score={`${dimensionAverages.clarity}`}
  darkMode={darkMode}
/>

<Dimension
  label="Completeness"
  score={`${dimensionAverages.completeness}`}
  darkMode={darkMode}
/>
              </div>
            </section>
          </div>
          </>
  )}

  {page === "evaluation-history" && (
          <div className="space-y-6">
  <div>
    <h1
  className={`text-2xl font-bold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  Evaluation History
</h1>

    <p className="mt-1 text-sm text-slate-500">
      Review your previous AI response evaluations.
    </p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2"></div>
    <input
  type="text"
  value={historySearch}
  onChange={(e) => setHistorySearch(e.target.value)}
  placeholder="Search evaluations..."
  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
  darkMode
    ? "border-slate-700 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-slate-600 focus:ring-2 focus:ring-slate-800"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
}`}
/>
<select

  value={historyStatus}
  onChange={(e) => setHistoryStatus(e.target.value)}
className={`mt-3 w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
  darkMode
    ? "border-slate-700 bg-slate-900 text-slate-100 focus:border-slate-600 focus:ring-2 focus:ring-slate-800"
    : "border-slate-200 bg-white text-slate-900 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
}`}>
  <option value="All">All statuses</option>
  <option value="Passed">Passed</option>
  <option value="Needs Review">Needs Review</option>
  <option value="Failed">Failed</option>
</select>
  </div>

  {evaluations.length === 0 ? (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <FileText className="mx-auto text-slate-400" size={32} />

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        No evaluations yet
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Your completed evaluations will appear here.
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {filteredEvaluations
  .filter(
    (evaluation) =>
      historyStatus === "All" || evaluation.status === historyStatus
  )
  .map((evaluation) => (
        <div
  key={evaluation.id}
  onClick={() => {
    setPrompt(evaluation.prompt);
    setResponse(evaluation.response);
    setScore(evaluation.score);
    setStatus(evaluation.status);
    setReasoning(evaluation.reasoning);
    setStrengths(evaluation.strengths);
    setSuggestions(evaluation.suggestions);
    setPage("evaluation-result");
    setLoading(false);
  }}
  className={`cursor-pointer rounded-2xl border p-6 transition ${
  darkMode
    ? "border-slate-800 bg-slate-900 hover:border-slate-700 hover:shadow-sm"
    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
}`}
>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
  Evaluation #{evaluation.id}
</p>

<p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
  Prompt
</p>

<h2
  className={`mt-1 line-clamp-2 text-base font-semibold ${
    darkMode ? "text-slate-100" : "text-slate-900"
  }`}
>
  {evaluation.prompt}
</h2>
            </div>

            <div className="shrink-0 text-right">
              <div
  className={`text-3xl font-bold ${
    darkMode ? "text-slate-100" : "text-slate-950"
  }`}
>
  {evaluation.score}
</div>

              <div
  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
  evaluation.status === "Passed"
    ? darkMode
      ? "bg-emerald-950 text-emerald-300"
      : "bg-emerald-50 text-emerald-700"
    : evaluation.status === "Needs Review"
    ? darkMode
      ? "bg-amber-950 text-amber-300"
      : "bg-amber-50 text-amber-700"
    : darkMode
    ? "bg-red-950 text-red-300"
    : "bg-red-50 text-red-700"
}`}
>
  {evaluation.status}
</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <HistoryScore
              label="Correctness"
              score={evaluation.correctness}
              darkMode={darkMode}
            />

            <HistoryScore
              label="Relevance"
              score={evaluation.relevance}
              darkMode={darkMode}
            />

            <HistoryScore
              label="Clarity"
              score={evaluation.clarity}
              darkMode={darkMode}
            />

            <HistoryScore
              label="Completeness"
              score={evaluation.completeness}
              darkMode={darkMode}
            />
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  )}
        </main>
      </div>
    </div>
  );
}



function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
  onClick={onClick}
  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({
  title,
  value,
  change,
  icon,
  darkMode,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        darkMode
          ? "border-slate-800 bg-slate-900"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            darkMode
              ? "bg-slate-800 text-slate-300"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {icon}
        </div>

        <span className="text-xs font-semibold text-emerald-600">
          {change}
        </span>
      </div>

      <p
        className={`mt-5 text-sm ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-1 text-2xl font-bold tracking-tight ${
          darkMode ? "text-slate-100" : "text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function EvaluationRow({
  title,
  model,
  score,
  status,
  darkMode,
}: {
  title: string;
  model: string;
  score: string;
  status: "Passed" | "Review";
  darkMode: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div
        className={`hidden h-9 w-9 items-center justify-center rounded-xl sm:flex ${
          darkMode
            ? "bg-slate-800 text-slate-300"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        <FileText size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-semibold ${
            darkMode ? "text-slate-100" : "text-slate-800"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-400">{model}</p>
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-bold ${
            darkMode ? "text-slate-100" : "text-slate-950"
          }`}
        >
          {score}/100
        </p>

        <div
          className={`mt-1 flex items-center justify-end gap-1 text-xs font-medium ${
            status === "Passed"
              ? "text-emerald-600"
              : "text-amber-600"
          }`}
        >
          {status === "Passed" ? (
            <CheckCircle2 size={12} />
          ) : (
            <XCircle size={12} />
          )}
          {status}
        </div>
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  darkMode,
}: {
  label: string;
  value: string;
  darkMode: boolean;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs">
        <span
          className={`font-medium ${
            darkMode ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {label}
        </span>

        <span
          className={`font-semibold ${
            darkMode ? "text-slate-100" : "text-slate-700"
          }`}
        >
          {value}
        </span>
      </div>

      <div
        className={`h-2 overflow-hidden rounded-full ${
          darkMode ? "bg-slate-700" : "bg-slate-100"
        }`}
      >
        <div
          className={`h-full rounded-full ${
            darkMode ? "bg-slate-200" : "bg-slate-900"
          }`}
          style={{ width: value }}
        />
      </div>
    </div>
  );
}
function Dimension({
  label,
  score,
  darkMode,
}: {
  label: string;
  score: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 ${
        darkMode ? "bg-slate-800" : "bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {label}
        </span>

        <span
          className={`text-lg font-bold ${
            darkMode ? "text-slate-100" : "text-slate-950"
          }`}
        >
          {score}
        </span>
      </div>

      <div
        className={`mt-3 h-1.5 overflow-hidden rounded-full ${
          darkMode ? "bg-slate-700" : "bg-slate-200"
        }`}
      >
        <div
          className={`h-full rounded-full ${
            darkMode ? "bg-slate-200" : "bg-slate-900"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function HistoryScore({
  label,
  score,
  darkMode,
}: {
  label: string;
  score: number;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 ${
        darkMode ? "bg-slate-800" : "bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium ${
            darkMode ? "text-slate-300" : "text-slate-500"
          }`}
        >
          {label}
        </span>

        <span
          className={`text-sm font-bold ${
            darkMode ? "text-slate-100" : "text-slate-900"
          }`}
        >
          {score}
        </span>
      </div>

      <div
        className={`mt-2 h-1.5 overflow-hidden rounded-full ${
          darkMode ? "bg-slate-700" : "bg-slate-200"
        }`}
      >
        <div
          className={`h-full rounded-full ${
            darkMode ? "bg-slate-200" : "bg-slate-900"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
function ResultDimension({
  label,
  score,
  darkMode,
}: {
  label: string;
  score: number;
  darkMode: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        darkMode
          ? "border-slate-700 bg-slate-800"
          : "border-slate-100 bg-slate-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-sm font-medium ${
            darkMode ? "text-slate-300" : "text-slate-600"
          }`}
        >
          {label}
        </span>

        <span
          className={`text-lg font-bold ${
            darkMode ? "text-slate-100" : "text-slate-950"
          }`}
        >
          {score}
        </span>
      </div>

      <div
        className={`mt-3 h-2 overflow-hidden rounded-full ${
          darkMode ? "bg-slate-700" : "bg-slate-200"
        }`}
      >
        <div
          className={`h-full rounded-full ${
            darkMode ? "bg-slate-200" : "bg-slate-900"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
export default App;