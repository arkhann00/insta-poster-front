import React, { useEffect, useState } from "react";
import { fetchAccounts, createAccount, deleteAccount } from "../api/accounts";
import {
  fetchReels,
  uploadReelsBulk,
  deleteReel,
  publishReels,
} from "../api/reels";
import { fetchAssignments } from "../api/assignments";

function DashboardPage({ user, onLogout }) {
  const [accounts, setAccounts] = useState([]);
  const [reels, setReels] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // форма аккаунта
  const [accountName, setAccountName] = useState("");
  const [accountExternalId, setAccountExternalId] = useState("");
  const [accountAccessToken, setAccountAccessToken] = useState("");

  // форма загрузки рилсов (несколько файлов)
  const [reelFiles, setReelFiles] = useState([]);
  const [uploadingReels, setUploadingReels] = useState(false); // <-- новое состояние

  // состояние публикации
  const [publishing, setPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  async function loadData() {
    try {
      setError(null);
      setLoading(true);
      const [accountsData, reelsData, assignmentsData] = await Promise.all([
        fetchAccounts(),
        fetchReels(),
        fetchAssignments(),
      ]);
      setAccounts(accountsData);
      setReels(reelsData);
      setAssignments(assignmentsData);
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить данные");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Создание аккаунта
  async function handleCreateAccount(e) {
    e.preventDefault();
    if (!accountName.trim()) {
      return;
    }
    try {
      setError(null);
      const newAcc = await createAccount({
        name: accountName.trim(),
        external_id: accountExternalId.trim() || null,
        access_token: accountAccessToken.trim() || null,
      });
      setAccounts((prev) => [...prev, newAcc]);
      setAccountName("");
      setAccountExternalId("");
      setAccountAccessToken("");
    } catch (err) {
      console.error(err);
      setError("Ошибка при создании аккаунта");
    }
  }

  // Удаление аккаунта (без confirm)
  async function handleDeleteAccount(id) {
    try {
      setError(null);
      await deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      setError("Ошибка при удалении аккаунта");
    }
  }

  // Массовая загрузка рилсов
  async function handleUploadReels(e) {
    e.preventDefault();
    if (!reelFiles || reelFiles.length === 0) return;
    if (uploadingReels) return; // защита от повторного клика

    try {
      setError(null);
      setUploadingReels(true);
      const created = await uploadReelsBulk(reelFiles);
      setReels((prev) => [...prev, ...created]);
      setReelFiles([]);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setError("Ошибка при загрузке видео");
    } finally {
      setUploadingReels(false);
    }
  }

  // Удаление рилса (без confirm)
  async function handleDeleteReel(id) {
    try {
      setError(null);
      await deleteReel(id);
      setReels((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      setError("Ошибка при удалении рилса");
    }
  }

  // Публикация рилсов на аккаунты
  async function handlePublish() {
    try {
      setError(null);
      setPublishing(true);
      const result = await publishReels();
      setPublishResult(result);
      await loadData();
    } catch (err) {
      console.error(err);
      setError("Ошибка при публикации");
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="app-root">
        <header className="app-header">
          <div className="app-logo">
            <div className="app-logo-badge">RP</div>
            <span>Reels Poster</span>
          </div>
        </header>
        <main className="page-main">
          <div
            className="page-inner"
            style={{ textAlign: "center", marginTop: 60 }}
          >
            Загрузка данных...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-badge">RP</div>
          <span>Reels Poster</span>
        </div>
        <div className="app-user">
          <div className="app-user-email">{user.email}</div>
          <button className="btn btn-outline btn-pill" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </header>

      <main className="page-main">
        <div className="page-inner">
          {error && <div className="alert-error">{error}</div>}

          <div className="section-row">
            {/* Блок аккаунтов */}
            <section className="section-card">
              <h2 className="section-title">Бизнес-аккаунты</h2>
              <p className="section-subtitle">
                Сохраняй Instagram business / creator аккаунты, ID и токен для
                выкладки.
              </p>

              <form
                onSubmit={handleCreateAccount}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <div>
                  <label className="input-label">Название аккаунта</label>
                  <input
                    type="text"
                    className="input-field"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Например, Instagram клиента X"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">
                    ID бизнес-аккаунта (external id)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={accountExternalId}
                    onChange={(e) => setAccountExternalId(e.target.value)}
                    placeholder="ID Instagram business / creator пользователя"
                  />
                </div>

                <div>
                  <label className="input-label">
                    Токен доступа (access token)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={accountAccessToken}
                    onChange={(e) => setAccountAccessToken(e.target.value)}
                    placeholder="Специальный токен для выкладки от лица аккаунта"
                  />
                </div>

                <div style={{ marginTop: 4 }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    Добавить аккаунт
                  </button>
                </div>
              </form>

              <div style={{ fontSize: 13 }}>
                {accounts.length === 0 ? (
                  <div style={{ color: "#9ca3af" }}>Аккаунтов пока нет</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>External ID</th>
                        <th style={{ textAlign: "right" }}>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((acc) => (
                        <tr key={acc.id}>
                          <td>{acc.id}</td>
                          <td>{acc.name}</td>
                          <td>{acc.external_id || "—"}</td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn btn-outline"
                              style={{
                                padding: "4px 9px",
                                fontSize: 12,
                                borderRadius: 9,
                                borderColor: "rgba(248,113,113,0.6)",
                                color: "#fecaca",
                              }}
                              onClick={() => handleDeleteAccount(acc.id)}
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            {/* Блок медиа */}
            <section className="section-card">
              <h2 className="section-title">Рилсы (медиа)</h2>
              <p className="section-subtitle">
                Загрузить сразу пачку роликов и раздать их по аккаунтам.
              </p>

              <form
                onSubmit={handleUploadReels}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="input-file"
                  onChange={(e) =>
                    setReelFiles(
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    uploadingReels || !reelFiles || reelFiles.length === 0
                  }
                  style={{
                    opacity: uploadingReels
                      ? 0.6
                      : reelFiles && reelFiles.length > 0
                      ? 1
                      : 0.5,
                    cursor:
                      uploadingReels || !reelFiles || reelFiles.length === 0
                        ? "default"
                        : "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {uploadingReels
                    ? "Загружаем..."
                    : `Загрузить (${reelFiles.length || 0})`}
                </button>
              </form>

              <div style={{ fontSize: 13, marginBottom: 14 }}>
                {reels.length === 0 ? (
                  <div style={{ color: "#9ca3af" }}>Медиа пока нет</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Имя файла</th>
                        <th>Статус</th>
                        <th style={{ textAlign: "right" }}>Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reels.map((reel) => (
                        <tr key={reel.id}>
                          <td>{reel.id}</td>
                          <td>{reel.original_filename}</td>
                          <td>
                            {reel.is_used ? (
                              <span className="badge badge-muted">
                                Использован
                              </span>
                            ) : (
                              <span className="badge badge-success">
                                Готов к выкладке
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn btn-outline"
                              style={{
                                padding: "4px 9px",
                                fontSize: 12,
                                borderRadius: 9,
                                borderColor: "rgba(248,113,113,0.6)",
                                color: "#fecaca",
                              }}
                              onClick={() => handleDeleteReel(reel.id)}
                            >
                              Удалить
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div
                style={{
                  paddingTop: 10,
                  borderTop: "1px solid rgba(31,41,55,0.9)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <button
                  onClick={handlePublish}
                  disabled={
                    publishing || accounts.length === 0 || reels.length === 0
                  }
                  className="btn btn-primary btn-pill"
                  style={{
                    alignSelf: "flex-start",
                    opacity:
                      publishing || accounts.length === 0 || reels.length === 0
                        ? 0.55
                        : 1,
                    cursor:
                      publishing || accounts.length === 0 || reels.length === 0
                        ? "default"
                        : "pointer",
                  }}
                >
                  {publishing ? "Публикуем..." : "Выложить"}
                </button>

                {publishResult && (
                  <div style={{ fontSize: 12, color: "#cbd5f5" }}>
                    <div>
                      Опубликовано:{" "}
                      <strong>{publishResult.total_published}</strong>
                    </div>
                    <div>
                      Рилсов осталось без аккаунта:{" "}
                      <strong>{publishResult.reels_left_unassigned}</strong>
                    </div>
                    <div>
                      Аккаунтов осталось без рилса:{" "}
                      <strong>{publishResult.accounts_without_reels}</strong>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Лог статусов */}
          <section className="section-card section-status">
            <h2 className="section-title">Статус отправки рилсов</h2>
            <p className="section-subtitle">
              Живой лог всех попыток публикации: что ушло, что не прошло и
              почему.
            </p>

            <div style={{ fontSize: 13 }}>
              {assignments.length === 0 ? (
                <div style={{ color: "#9ca3af" }}>Отправок пока не было</div>
              ) : (
                <table className="table">
                  <thead>
                    <tr>
                      <th>Время</th>
                      <th>Рилс</th>
                      <th>Аккаунт</th>
                      <th>Статус</th>
                      <th>Ошибка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a) => {
                      let badgeClass = "badge badge-muted";
                      if (a.status === "published")
                        badgeClass = "badge badge-success";
                      if (a.status === "error")
                        badgeClass = "badge badge-error";

                      return (
                        <tr key={a.id}>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {new Date(a.created_at).toLocaleString()}
                          </td>
                          <td>
                            {a.reel
                              ? `${a.reel.id} — ${a.reel.original_filename}`
                              : `reel_id=${a.reel_id}`}
                          </td>
                          <td>
                            {a.business_account
                              ? `${a.business_account.name} (${
                                  a.business_account.external_id || "нет id"
                                })`
                              : `account_id=${a.business_account_id}`}
                          </td>
                          <td>
                            <span className={badgeClass}>{a.status}</span>
                          </td>
                          <td
                            style={{
                              maxWidth: 320,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              color: "#9ca3af",
                            }}
                            title={a.error_message || ""}
                          >
                            {a.error_message
                              ? a.error_message.slice(0, 80) + "..."
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
