import { useState } from "react";
import {
  changePassword,
  getCurrentUser,
  setTheme,
} from "../services/mockApi.js";

export default function SettingsPage() {
  const user = getCurrentUser();
  const [form, setForm] = useState({ oldPwd: "", newPwd: "" });

  const onSavePwd = () => {
    const ok = changePassword(user.email, form.oldPwd, form.newPwd);
    if (ok) alert("Пароль изменён (локально)");
    else alert("Неверный текущий пароль");
    setForm({ oldPwd: "", newPwd: "" });
  };

  return (
    <div className="container">
      <h2>Настройки</h2>

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginTop: 0 }}>Тема</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="ghost" onClick={() => setTheme("dark")}>
            Тёмная
          </button>
          <button className="ghost" onClick={() => setTheme("light")}>
            Светлая
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Пароль</h3>
        <div className="row">
          <input
            placeholder="Текущий пароль"
            type="password"
            value={form.oldPwd}
            onChange={(e) => setForm((v) => ({ ...v, oldPwd: e.target.value }))}
          />
          <input
            placeholder="Новый пароль"
            type="password"
            value={form.newPwd}
            onChange={(e) => setForm((v) => ({ ...v, newPwd: e.target.value }))}
          />
          <button onClick={onSavePwd}>Сохранить</button>
        </div>
      </div>
    </div>
  );
}
