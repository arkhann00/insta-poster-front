import { useEffect, useState } from "react";
import { listAccounts } from "../api/accounts";
import { listPosts, deletePost } from "../api/posts";
import { API_URL } from "../api/base";

export default function QueuePage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadAccounts() {
    try {
      const data = await listAccounts();
      setAccounts(data);
      if (!selectedAccountId && data.length > 0) {
        setSelectedAccountId(data[0].id);
      }
    } catch (e) {
      setError(e.message || "Ошибка загрузки аккаунтов");
    }
  }

  async function loadPosts() {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (selectedAccountId) params.accountId = selectedAccountId;
      if (statusFilter) params.status = statusFilter;
      const data = await listPosts(params);
      setPosts(data);
    } catch (e) {
      setError(e.message || "Ошибка загрузки постов");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountId, statusFilter]);

  async function handleDeletePost(id) {
    if (!window.confirm("Удалить пост из очереди?")) return;
    setError("");
    setSuccess("");
    try {
      await deletePost(id);
      setSuccess("Пост удалён");
      await loadPosts();
    } catch (e) {
      setError(e.message || "Ошибка удаления поста");
    }
  }

  function fullMediaUrl(relativeUrl) {
    if (!relativeUrl) return "";
    if (
      relativeUrl.startsWith("http://") ||
      relativeUrl.startsWith("https://")
    ) {
      return relativeUrl;
    }
    return `${API_URL}${relativeUrl}`;
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2 className="page-title">Очередь постов</h2>
        <p className="page-subtitle">
          Здесь видны все ролики, поставленные в очередь на публикацию.
        </p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="card">
        <div className="card-header">
          <div className="card-title">Фильтры</div>
        </div>

        <div className="queue-filters">
          <div className="field-group">
            <label className="field-label">Аккаунт</label>
            <select
              className="field-select"
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
            >
              <option value="">Все аккаунты</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label className="field-label">Статус</label>
            <select
              className="field-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Все</option>
              <option value="planned">planned</option>
              <option value="booking">booking</option>
              <option value="publishing">publishing</option>
              <option value="published">published</option>
              <option value="failed">failed</option>
              <option value="paused">paused</option>
            </select>
          </div>

          <button onClick={loadPosts} className="btn btn-secondary">
            Обновить
          </button>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <div className="card-title">Посты в очереди</div>
          <div className="card-meta">
            {loading
              ? "Загрузка..."
              : posts.length === 0
              ? "Пока нет постов в очереди."
              : `Всего: ${posts.length}`}
          </div>
        </div>

        {loading ? (
          <div className="text-muted">Загрузка...</div>
        ) : posts.length === 0 ? (
          <div className="text-muted">Пока нет постов в очереди.</div>
        ) : (
          <div className="queue-list">
            {posts.map((post) => {
              const url = fullMediaUrl(post.media_url);
              return (
                <article key={post.id} className="queue-item">
                  <div className="queue-item-media">
                    {url ? (
                      <video src={url} controls />
                    ) : (
                      <div className="text-muted">
                        Нет media_url (проверь бэкенд).
                      </div>
                    )}
                  </div>

                  <div className="queue-item-body">
                    <div className="queue-item-header">
                      <span className="queue-status-pill">{post.status}</span>
                      <span className="queue-date">
                        Создан:{" "}
                        {new Date(post.created_at).toLocaleString("ru-RU")}
                      </span>
                    </div>

                    <div className="mt-2">
                      <div className="field-label">Caption</div>
                      <div className="queue-caption">{post.caption || "—"}</div>
                    </div>

                    <div className="mt-2">
                      <div className="field-label">Теги</div>
                      <div>
                        {post.tags && post.tags.length > 0
                          ? post.tags.join(", ")
                          : "—"}
                      </div>
                    </div>

                    <div className="mt-2 queue-date">
                      Запланировано на:{" "}
                      {post.scheduled_at
                        ? new Date(post.scheduled_at).toLocaleString("ru-RU")
                        : "не задано"}
                    </div>

                    {post.error && (
                      <div className="mt-2 alert alert-error">
                        Ошибка: {post.error}
                      </div>
                    )}

                    <div className="queue-footer">
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="btn btn-danger"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
