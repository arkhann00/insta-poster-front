import { useEffect, useState } from "react";
import { listAccounts } from "../api/accounts";
import { uploadMedia } from "../api/media";
import { createPost } from "../api/posts";

export default function UploadPage() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      setLoadingAccounts(true);
      setError("");
      try {
        const data = await listAccounts();
        setAccounts(data);
        if (data.length > 0) {
          setSelectedAccountId(data[0].id);
        }
      } catch (e) {
        setError(e.message || "Ошибка загрузки аккаунтов");
      } finally {
        setLoadingAccounts(false);
      }
    }

    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedAccountId) {
      setError("Выбери аккаунт");
      return;
    }
    if (!file) {
      setError("Выбери файл");
      return;
    }

    setUploading(true);
    try {
      const media = await uploadMedia({
        accountId: selectedAccountId,
        file,
      });

      const tags =
        tagsText
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0) || [];

      const payload = {
        account_id: selectedAccountId,
        media_id: media.id,
        caption: caption || null,
        tags,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      };

      await createPost(payload);

      setSuccess("Пост добавлен в очередь");
      setCaption("");
      setTagsText("");
      setScheduledAt("");
      setFile(null);

      const fileInput = document.getElementById("upload-file-input");
      if (fileInput) fileInput.value = "";
    } catch (e) {
      console.error(e);
      setError(e.message || "Ошибка загрузки или создания поста");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2 className="page-title">Загрузка ролика и постановка в очередь</h2>
        <p className="page-subtitle">
          Залей видео, добавь подпись и теги — сервис сам отправит рилс в
          Instagram по расписанию.
        </p>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <section className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Новый рилс</div>
            <div className="card-meta">
              Поддерживаются стандартные форматы видео Instagram (MP4, MOV).
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="field-group">
              <label className="field-label">Аккаунт</label>
              {loadingAccounts ? (
                <div className="text-muted">Загрузка аккаунтов...</div>
              ) : accounts.length === 0 ? (
                <div className="text-muted">
                  Нет аккаунтов. Сначала добавь их на странице &laquo;Instagram
                  аккаунты&raquo;.
                </div>
              ) : (
                <select
                  className="field-select"
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} ({acc.ig_user_id})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="field-group">
              <label className="field-label">
                Время публикации (опционально)
              </label>
              <input
                type="datetime-local"
                className="field-input"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
              <div className="field-description">
                Если не заполнять — пост уйдёт по ближайшему слоту расписания.
              </div>
            </div>
          </div>

          <div className="field-group mt-3">
            <label className="field-label">Файл видео</label>
            <input
              id="upload-file-input"
              type="file"
              accept="video/*"
              className="field-input"
              onChange={(e) =>
                setFile(
                  e.target.files && e.target.files[0] ? e.target.files[0] : null
                )
              }
            />
          </div>

          <div className="field-group mt-3">
            <label className="field-label">Подпись (caption)</label>
            <textarea
              className="field-textarea"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Текст под рилс..."
            />
          </div>

          <div className="form-grid-2 mt-3">
            <div className="field-group">
              <label className="field-label">Теги (через запятую, без #)</label>
              <input
                className="field-input"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                placeholder="например: fitness, motivation, reels"
              />
            </div>
            <div className="field-group">
              <label className="field-label">Подсказка</label>
              <div className="field-description">
                Теги помогут группировать посты внутри сервиса — они не
                обязательно должны совпадать с хештегами в Instagram.
              </div>
            </div>
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end" }}
            className="mt-4"
          >
            <button
              type="submit"
              disabled={uploading || accounts.length === 0}
              className="btn btn-primary"
            >
              {uploading ? "Загружаем..." : "Загрузить и добавить в очередь"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
