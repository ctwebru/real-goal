import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { ArrowLeft, EyeOff, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CATEGORY_SCORES,
  FLAG_LABEL,
  HOMES,
  HOME_STATS,
  NETWORK_TREND,
  RESIDENTS,
  type Resident,
} from "@/lib/mock-analytics";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Кабинет основателя — «Резиденция Рада»" },
      {
        name: "description",
        content:
          "Закрытая панель: динамика удовлетворённости по каждому подопечному, по пансионату и по всей сети «Резиденция Рада».",
      },
      { property: "og:title", content: "Кабинет основателя — «Резиденция Рада»" },
      {
        property: "og:description",
        content: "Динамика оценок семей по подопечным, пансионатам и сети.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [home, setHome] = useState<string>("Вся сеть");
  const residents =
    home === "Вся сеть" ? RESIDENTS : RESIDENTS.filter((r) => r.home === home);

  return (
    <main className="min-h-screen bg-secondary/40">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl">Кабинет основателя</h1>
            <p className="text-sm text-muted-foreground">
              Демо-данные · доступ только у Натальи Евгеньевны
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
              <EyeOff className="size-3.5" /> Управляющие не имеют доступа
            </span>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-secondary"
            >
              <ArrowLeft className="size-4" /> К опросу
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {["Вся сеть", ...HOMES].map((h) => (
            <button
              key={h}
              onClick={() => setHome(h)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                home === h
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              {h}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi label="Средний балл" value="4.4" delta="+0.1" positive />
          <Kpi label="NPS" value="54" delta="-3" />
          <Kpi label="Ответов в августе" value="49" delta="+5" positive />
          <Kpi label="Доля оценок ≤3" value="11%" delta="+2 п.п." />
        </div>

        <Tabs defaultValue="network">
          <TabsList>
            <TabsTrigger value="network">Сеть</TabsTrigger>
            <TabsTrigger value="homes">Пансионаты</TabsTrigger>
            <TabsTrigger value="residents">Подопечные</TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="mt-4 space-y-4">
            <Panel title="Динамика по сети" subtitle="Средний балл и NPS по волнам опроса">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={NETWORK_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="wave" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis yAxisId="l" domain={[3, 5]} stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis
                    yAxisId="r"
                    orientation="right"
                    domain={[0, 100]}
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Line
                    yAxisId="l"
                    type="monotone"
                    dataKey="csat"
                    name="Средний балл"
                    stroke="var(--chart-1)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                  <Line
                    yAxisId="r"
                    type="monotone"
                    dataKey="nps"
                    name="NPS"
                    stroke="var(--chart-2)"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="Оценки по направлениям" subtitle="Сравнение пансионатов по категориям">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={CATEGORY_SCORES}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="category" stroke="var(--muted-foreground)" fontSize={11} />
                  <YAxis domain={[0, 5]} stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="Радужная" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Щукина-1" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Щукина-2" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Panel>
          </TabsContent>

          <TabsContent value="homes" className="mt-4">
            <Panel title="Пансионаты" subtitle="Август · демо-данные">
              <div className="grid gap-4 sm:grid-cols-3">
                {HOME_STATS.map((h) => (
                  <div key={h.home} className="rounded-xl border border-border p-4">
                    <p className="font-medium">{h.home}</p>
                    <p className="mt-2 font-serif text-3xl">{h.csat.toFixed(1)}</p>
                    <p
                      className={cn(
                        "text-xs",
                        h.delta >= 0 ? "text-primary" : "text-destructive",
                      )}
                    >
                      {h.delta >= 0 ? "+" : ""}
                      {h.delta.toFixed(1)} к прошлой волне
                    </p>
                    <dl className="mt-4 space-y-1.5 text-sm">
                      <Row label="NPS" value={String(h.nps)} />
                      <Row label="Ответов" value={String(h.responses)} />
                      <Row
                        label="Оценок ≤3"
                        value={`${h.lowShare}%`}
                        danger={h.lowShare >= 15}
                      />
                    </dl>
                  </div>
                ))}
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="residents" className="mt-4 space-y-4">
            {residents.map((r) => (
              <ResidentCard key={r.id} resident={r} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "13px",
} as const;

function Kpi({
  label,
  value,
  delta,
  positive,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
}) {
  return (
    <div className="surface-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-3xl">{value}</p>
      <p
        className={cn(
          "mt-1 inline-flex items-center gap-1 text-xs",
          positive ? "text-primary" : "text-destructive",
        )}
      >
        {positive ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
        {delta}
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-5 sm:p-6">
      <h2 className="text-lg">{title}</h2>
      {subtitle && <p className="mb-4 text-sm text-muted-foreground">{subtitle}</p>}
      {children}
    </section>
  );
}

function Row({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-medium", danger && "text-destructive")}>{value}</dd>
    </div>
  );
}

function ResidentCard({ resident }: { resident: Resident }) {
  const first = resident.trend[0].csat;
  const last = resident.trend[resident.trend.length - 1].csat;
  const diff = last - first;

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg">{resident.name}</h3>
          <p className="text-sm text-muted-foreground">
            {resident.home} · {resident.relative} · последний ответ {resident.lastDate}
          </p>
        </div>
        <Badge
          variant={resident.flag === "risk" ? "destructive" : "secondary"}
          className={cn(resident.flag === "watch" && "bg-accent/15 text-accent")}
        >
          {FLAG_LABEL[resident.flag]}
        </Badge>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_200px]">
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={resident.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="wave" stroke="var(--muted-foreground)" fontSize={11} />
            <YAxis domain={[1, 5]} stroke="var(--muted-foreground)" fontSize={11} width={24} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line
              type="monotone"
              dataKey="csat"
              name="Средний балл"
              stroke={diff < 0 ? "var(--destructive)" : "var(--chart-1)"}
              strokeWidth={2.5}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>

        <dl className="space-y-1.5 self-center text-sm">
          <Row label="Текущий балл" value={last.toFixed(1)} danger={last < 3.5} />
          <Row
            label="Изменение"
            value={`${diff >= 0 ? "+" : ""}${diff.toFixed(1)}`}
            danger={diff < 0}
          />
          <Row label="NPS" value={String(resident.lastNps)} danger={resident.lastNps <= 6} />
        </dl>
      </div>

      {resident.lastComment && (
        <blockquote className="mt-4 rounded-xl border-l-2 border-accent bg-secondary/60 p-4 text-sm italic text-foreground/90">
          «{resident.lastComment}»
        </blockquote>
      )}
    </section>
  );
}
