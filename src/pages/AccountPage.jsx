import { useEffect, useState } from "react";
import { listAccounts, createAccount, deleteAccount } from "../api/accounts";

export default function AccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [igUserId, setIgUserId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [tokenExpiresAt, setTokenExpiresAt] = useState("");

  async function loadAccounts() {
    setLoading(true);
    setError("");
    try {
      const data = await listAccounts();
      setAccounts(data);
    } catch (e) {
      setError(e.message || "Ошибка загрузки аккаунтов");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCreating(true);

    try {
      const payload = {
        name,
        ig_user_id: igUserId,
        access_token: accessToken,
        token_expires_at: tokenExpiresAt || null,
      };

      await createAccount(payload);
      setSuccess("Аккаунт создан");
      setName("");
      setIgUserId("");
      setAccessToken("");
      setTokenExpiresAt("");
      await loadAccounts();
    } catch (e) {
      setError(e.message || "Ошибка создания аккаунта");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Удалить аккаунт?")) return;
    setError("");
    setSuccess("");

    try {
      await deleteAccount(id);
      setSuccess("Аккаунт удалён");
      await loadAccounts();
    } catch (e) {
      setError(e.message || "Ошибка удаления аккаунта");
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2 className="page-title">Instagram аккаунты</h2>
        <p className="page-subtitle">
          Подключи бизнес-аккаунты Instagram, чтобы планировать рилсы.
        </p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Новый аккаунт</div>
            <div className="card-meta">
              Введи Instagram User ID и действующий Access Token.
            </div>
          </div>
        </div>

        <form onSubmit={handleCreate}>
          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">Название аккаунта</label>
              <input
                className="field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например, Main blog"
                required
              />
            </div>

            <div className="field-group">
              <label className="field-label">Instagram User ID</label>
              <input
                className="field-input"
                value={igUserId}
                onChange={(e) => setIgUserId(e.target.value)}
                placeholder="1784..."
                required
              />
            </div>
          </div>

          <div className="field-group mt-3">
            <label className="field-label">Access Token</label>
            <input
              className="field-input"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="EAAG..."
              required
            />
          </div>

          <div className="form-grid-2 mt-3">
            <div className="field-group">
              <label className="field-label">
                Дата истечения токена (опционально)
              </label>
              <input
                type="datetime-local"
                className="field-input"
                value={tokenExpiresAt}
                onChange={(e) => setTokenExpiresAt(e.target.value)}
              />
            </div>
            <div className="field-group">
              <label className="field-label">Подсказка</label>
              <div className="field-description">
                Если токен без даты истечения, оставь поле пустым — сервис всё
                равно шифрует и хранит его в базе.
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
            className="mt-4"
          >
            <button
              type="submit"
              disabled={creating}
              className="btn btn-primary"
            >
              {creating ? "Создаём..." : "Создать аккаунт"}
            </button>
          </div>
        </form>
      </section>

      <section className="card">
        <div className="card-header">
          <div className="card-title">Подключённые аккаунты</div>
          <div className="card-meta">
            Всего: {loading ? "…" : accounts.length}
          </div>
        </div>

        {loading ? (
          <div className="text-muted">Загрузка...</div>
        ) : accounts.length === 0 ? (
          <div className="text-muted">Пока нет ни одного аккаунта.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Название</th>
                <th>IG User ID</th>
                <th>Токен истекает</th>
                <th style={{ textAlign: "right" }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td>{acc.name}</td>
                  <td>{acc.ig_user_id}</td>
                  <td>
                    {acc.token_expires_at
                      ? new Date(acc.token_expires_at).toLocaleString("ru-RU")
                      : "—"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="btn btn-danger"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
