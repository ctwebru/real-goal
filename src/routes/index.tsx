import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Lock, EyeOff, HeartHandshake, ShieldCheck, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  QUESTIONS,
  IMPROVEMENT_OPTIONS,
  labelsFor,
  findInvite,
} from "@/lib/survey";
import heroAsset from "@/assets/hero.jpg.asset.json";
import directorAsset from "@/assets/director.png.asset.json";
import directorGroupAsset from "@/assets/director-group.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Опрос семей — «Резиденция Рада»" },
      {
        name: "description",
        content:
          "Конфиденциальный опрос родственников подопечных сети пансионатов «Резиденция Рада». Ответы видит лично основатель, управляющие пансионатов — нет.",
      },
      { property: "og:title", content: "Опрос семей — «Резиденция Рада»" },
      {
        property: "og:description",
        content:
          "2–3 минуты, чтобы рассказать, как живётся вашему близкому. Честно и напрямую основателю сети.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SurveyPage,
});

type Answers = Record<string, { score?: number | "na"; comment?: string }>;

function SurveyPage() {
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [improvements, setImprovements] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");
  const [nps, setNps] = useState<number | null>(null);
  const [finalComment, setFinalComment] = useState("");

  const invite = useMemo(() => {
    if (typeof window === "undefined") return null;
    return findInvite(new URLSearchParams(window.location.search).get("t"));
  }, []);

  const answeredCount = QUESTIONS.filter((q) => answers[q.id]?.score !== undefined).length;
  const progress = Math.round(
    ((answeredCount + (nps !== null ? 1 : 0)) / (QUESTIONS.length + 1)) * 100,
  );

  const setScore = (id: string, score: number | "na") =>
    setAnswers((a) => ({ ...a, [id]: { ...a[id], score } }));
  const setComment = (id: string, comment: string) =>
    setAnswers((a) => ({ ...a, [id]: { ...a[id], comment: comment.slice(0, 1000) } }));

  const toggleImprovement = (opt: string) =>
    setImprovements((prev) => {
      if (prev.includes(opt)) return prev.filter((p) => p !== opt);
      if (opt === "Ничего — меня всё устраивает") return [opt];
      const next = prev.filter((p) => p !== "Ничего — меня всё устраивает");
      return next.length >= 2 ? next : [...next, opt];
    });

  if (submitted) return <ThankYou />;

  return (
    <main className="min-h-screen bg-background">
      {!started ? (
        <Intro invite={invite} onStart={() => setStarted(true)} />
      ) : (
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-6 sm:px-6">
          <div className="sticky top-0 z-10 -mx-4 mb-8 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="size-3.5" /> Ответы видит лично Наталья Евгеньевна
              </span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="mt-2 h-1.5" />
          </div>

          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => {
              const labels = labelsFor(q);
              const current = answers[q.id]?.score;
              const showFollowUp = typeof current === "number" && current <= 2;
              return (
                <section key={q.id} className="surface-card p-5 sm:p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {idx + 1}. {q.section}
                  </p>
                  <h2 className="mt-2 text-lg leading-snug text-foreground sm:text-xl">
                    {q.title}
                  </h2>
                  <div className="mt-4 space-y-2">
                    {[5, 4, 3, 2, 1].map((v) => (
                      <OptionButton
                        key={v}
                        selected={current === v}
                        onClick={() => setScore(q.id, v)}
                        label={`${v} — ${labels[v]}`}
                      />
                    ))}
                    {q.allowUnknown && (
                      <OptionButton
                        selected={current === "na"}
                        onClick={() => setScore(q.id, "na")}
                        label="Не могу оценить"
                        muted
                      />
                    )}
                  </div>
                  {showFollowUp && (
                    <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4">
                      <label className="text-sm text-foreground" htmlFor={`c-${q.id}`}>
                        {q.followUp}
                      </label>
                      <Textarea
                        id={`c-${q.id}`}
                        maxLength={1000}
                        value={answers[q.id]?.comment ?? ""}
                        onChange={(e) => setComment(q.id, e.target.value)}
                        placeholder="Ваш комментарий"
                        className="mt-2 bg-card"
                      />
                    </div>
                  )}
                </section>
              );
            })}

            <section className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                12. Что нам стоит улучшить
              </p>
              <h2 className="mt-2 text-lg leading-snug sm:text-xl">
                Каким направлениям нам следует уделить больше внимания?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Можно выбрать не более двух.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {IMPROVEMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleImprovement(opt)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors",
                      improvements.includes(opt)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground hover:border-primary/40",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {improvements.includes("Другое") && (
                <Input
                  maxLength={200}
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Что именно?"
                  className="mt-4"
                />
              )}
            </section>

            <section className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                13. Рекомендация
              </p>
              <h2 className="mt-2 text-lg leading-snug sm:text-xl">
                Насколько вероятно, что вы порекомендуете «Резиденцию Рада» знакомым?
              </h2>
              <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-11">
                {Array.from({ length: 11 }, (_, i) => i).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setNps(v)}
                    className={cn(
                      "rounded-lg border py-2.5 text-sm font-medium transition-colors",
                      nps === v
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>0 — точно не порекомендую</span>
                <span>10 — обязательно порекомендую</span>
              </div>
            </section>

            <section className="surface-card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                14. И последнее
              </p>
              <h2 className="mt-2 text-lg leading-snug sm:text-xl">
                Есть ли что-то ещё, о чём вы хотели бы рассказать?
              </h2>
              <Textarea
                maxLength={2000}
                value={finalComment}
                onChange={(e) => setFinalComment(e.target.value.slice(0, 2000))}
                placeholder="Любое пожелание, замечание или предложение"
                className="mt-3 min-h-28"
              />
            </section>

            <Button
              size="lg"
              className="w-full rounded-xl py-6 text-base"
              onClick={() => {
                setSubmitted(true);
                if (typeof window !== "undefined") window.scrollTo({ top: 0 });
              }}
            >
              Отправить ответы Наталье Евгеньевне
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Ответы поступают напрямую основателю сети. Управляющие пансионатов не имеют доступа
              к вашим ответам.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function OptionButton({
  selected,
  onClick,
  label,
  muted,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  muted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[15px] transition-colors",
        selected
          ? "border-primary bg-primary/8 text-foreground"
          : "border-border bg-card hover:border-primary/40",
        muted && !selected && "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-primary bg-primary text-primary-foreground" : "border-border",
        )}
      >
        {selected && <Check className="size-3" />}
      </span>
      {label}
    </button>
  );
}

function Intro({
  invite,
  onStart,
}: {
  invite: ReturnType<typeof findInvite>;
  onStart: () => void;
}) {
  return (
    <div>
      <div className="relative">
        <img
          src={heroAsset.url}
          alt="Подопечные и сотрудники пансионата «Резиденция Рада» на прогулке"
          className="h-64 w-full object-cover sm:h-96"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="mx-auto -mt-20 max-w-2xl px-4 pb-20 sm:px-6">
        <div className="surface-card p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <img
              src={directorAsset.url}
              alt="Наталья Евгеньевна Протасова, основатель сети пансионатов «Резиденция Рада»"
              className="size-16 rounded-full border border-border object-cover object-top"
            />
            <div>
              <p className="font-serif text-lg">Наталья Евгеньевна Протасова</p>
              <p className="text-sm text-muted-foreground">
                Основатель сети пансионатов «Резиденция Рада»
              </p>
            </div>
          </div>

          <h1 className="mt-6 text-2xl leading-tight sm:text-3xl">
            Мне важно услышать вас лично
          </h1>
          <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/90">
            <p>Здравствуйте{invite ? `, ${invite.relative}` : ""}!</p>
            <p>
              Спасибо за ваше доверие. Мне важно понимать, насколько вы довольны пребыванием
              вашего близкого и что мы можем сделать лучше.
            </p>
            <p>
              Мне важно получить именно ваше мнение — <strong>в том числе если чем-то в нашей
              работе вы недовольны</strong>. Все ответы я увижу лично.
            </p>
          </div>

          {invite && (
            <div className="mt-6 rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm">
              <p className="text-muted-foreground">Опрос по подопечному</p>
              <p className="mt-0.5 font-medium">{invite.resident}</p>
              <p className="text-muted-foreground">Пансионат «{invite.home}»</p>
            </div>
          )}

          <div className="mt-6 grid gap-3">
            <Assurance
              icon={<EyeOff className="size-5" />}
              title="Управляющие не видят ваши ответы"
              text="Ответы уходят напрямую основателю сети. Управляющий пансионата получает только обезличенную сводку по своему пансионату — без имён и без ваших комментариев."
            />
            <Assurance
              icon={<HeartHandshake className="size-5" />}
              title="Оценка влияет только на качество услуг"
              text="Она никак не отражается на отношении к вашему близкому. Именно объективная оценка — даже низкая — помогает нам исправлять то, что нужно исправить."
            />
            <Assurance
              icon={<ShieldCheck className="size-5" />}
              title="Персонально и в динамике"
              text="Опрос привязан к вашему близкому, чтобы мы видели, как ситуация меняется от месяца к месяцу и вовремя реагировали."
            />
          </div>

          <Button size="lg" className="mt-7 w-full rounded-xl py-6 text-base" onClick={onStart}>
            Начать опрос — 2–3 минуты
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">14 коротких вопросов</p>
        </div>

        <img
          src={directorGroupAsset.url}
          alt="Наталья Евгеньевна с подопечными пансионата"
          className="mt-8 w-full rounded-2xl border border-border object-cover shadow-[var(--shadow-soft)]"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function Assurance({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-secondary/50 p-4">
      <span className="mt-0.5 text-primary">{icon}</span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function ThankYou() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="surface-card p-7 text-center sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <HeartHandshake className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl sm:text-3xl">Спасибо за обратную связь</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Ваши ответы помогают мне видеть работу наших пансионатов глазами семей подопечных и
          понимать, что мы можем делать ещё лучше.
        </p>
        <div className="mt-7 rounded-xl border border-border bg-secondary/50 p-5 text-left">
          <p className="text-sm text-muted-foreground">
            Если есть вопрос или ситуация, которую вы хотели бы обсудить лично со мной:
          </p>
          <p className="mt-3 font-medium">Наталья Евгеньевна Протасова</p>
          <p className="text-sm text-muted-foreground">Основатель сети «Резиденция Рада»</p>
          <a
            href="mailto:dirrada@yandex.ru"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <Mail className="size-4" /> dirrada@yandex.ru
          </a>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">С теплом и благодарностью</p>
      </div>
    </main>
  );
}
