import { useEffect, useState } from "react";
import { getSchedule, saveSchedule } from "../services/mockApi.js";

export default function SchedulePage() {
  const [form, setForm] = useState(getSchedule());

  useEffect(() => {
    setForm(getSchedule());
  }, []);

  const onSave = () => {
    saveSchedule(form);
    alert("Сохранено");
  };

  const toggleDow = (idx) => {
    const copy = new Set(form.daysOfWeek);
    if (copy.has(idx)) copy.delete(idx);
    else copy.add(idx);
    setForm({ ...form, daysOfWeek: Array.from(copy).sort((a, b) => a - b) });
  };

  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Планирование</h2>
        <p className="text-sm text-slate-400">
          Настрой, как часто и в какие дни публиковать рилсы автоматически.
        </p>
      </div>

      <div className="bg-slate-900/70 rounded-xl p-4 md:p-5 border border-slate-800/80 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field
            label="Интервал (мин)"
            description="Через сколько минут брать следующий пост из очереди."
          >
            <input
              type="number"
              min="5"
              step="5"
              value={form.intervalMinutes}
              onChange={(e) =>
                setForm({ ...form, intervalMinutes: Number(e.target.value) })
              }
              className="w-full rounded-md bg-slate-950/80 border border-slate-600 px-3 py-2 text-slate-100 text-sm"
            />
          </Field>

          <Field
            label="Начало дня"
            description="Часы от 0 до 23, когда можно начинать постить."
          >
            <input
              type="number"
              min="0"
              max="23"
              value={form.dailyWindowStartHour}
              onChange={(e) =>
                setForm({
                  ...form,
                  dailyWindowStartHour: Number(e.target.value),
                })
              }
              className="w-full rounded-md bg-slate-950/80 border border-slate-600 px-3 py-2 text-slate-100 text-sm"
            />
          </Field>

          <Field
            label="Конец дня"
            description="Часы от 1 до 24, когда прекращать публикации."
          >
            <input
              type="number"
              min="1"
              max="24"
              value={form.dailyWindowEndHour}
              onChange={(e) =>
                setForm({
                  ...form,
                  dailyWindowEndHour: Number(e.target.value),
                })
              }
              className="w-full rounded-md bg-slate-950/80 border border-slate-600 px-3 py-2 text-slate-100 text-sm"
            />
          </Field>

          <Field
            label="Максимум в день"
            description="Ограничение по количеству постов в сутки."
          >
            <input
              type="number"
              min="1"
              max="50"
              value={form.maxPerDay}
              onChange={(e) =>
                setForm({ ...form, maxPerDay: Number(e.target.value) })
              }
              className="w-full rounded-md bg-slate-950/80 border border-slate-600 px-3 py-2 text-slate-100 text-sm"
            />
          </Field>
        </div>

        <div className="pt-2 space-y-2">
          <div className="text-sm font-medium text-slate-100">
            Дни недели для публикаций
          </div>
          <div className="text-xs text-slate-400">
            Выбери, в какие дни можно постить. Нумерация как в бэке: 0 – Вс, 1 –
            Пн, ... 6 – Сб.
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {days.map((d, i) => {
              const value = (i + 1) % 7; // совпадает с твоей логикой
              const active = form.daysOfWeek.includes(value);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDow(value)}
                  className={[
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    active
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60"
                      : "bg-slate-950/60 text-slate-300 border-slate-700 hover:bg-slate-800",
                  ].join(" ")}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold text-sm shadow-sm shadow-emerald-500/30"
          >
            <span>Сохранить</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, description, children }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-slate-200">{label}</label>
      <div>{children}</div>
      {description && (
        <p className="text-xs text-slate-400 leading-snug">{description}</p>
      )}
    </div>
  );
}
