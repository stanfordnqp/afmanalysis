import { useState } from "react";
import { createPortal } from "react-dom";

const REPO = "stanfordnqp/afmanalysis";

const TYPES = [
  { id: "bug",     label: "🐛  Bug",     ghLabel: "bug" },
  { id: "feature", label: "✨  Feature", ghLabel: "enhancement" },
  { id: "other",   label: "💬  Other",   ghLabel: "" },
] as const;

export default function FeedbackButton() {
  const [open, setOpen]   = useState(false);
  const [type, setType]   = useState<"bug" | "feature" | "other">("other");
  const [title, setTitle] = useState("");
  const [body, setBody]   = useState("");

  function close() {
    setOpen(false);
  }

  function submit() {
    const t = TYPES.find((x) => x.id === type)!;
    const fullBody = [
      body.trim(),
      "",
      "---",
      "*Submitted via [afminism](https://stanfordnqp.github.io/afmanalysis/)*",
    ].join("\n");
    const params = new URLSearchParams({ body: fullBody });
    if (title.trim()) params.set("title", title.trim());
    if (t.ghLabel)    params.set("labels", t.ghLabel);
    window.open(`https://github.com/${REPO}/issues/new?${params}`, "_blank");
    close();
    setTitle(""); setBody(""); setType("other");
  }

  return (
    <>
      <button className="feedback-fab" onClick={() => setOpen(true)} title="Leave feedback">
        <ChatIcon />
      </button>

      {open && createPortal(
        <div className="modal-backdrop" onClick={close}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <div className="feedback-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ChatIcon color="#3b82f6" />
                <span>Leave Feedback</span>
              </div>
              <button className="icon-btn" onClick={close}>✕</button>
            </div>

            <div className="feedback-modal-body">
              <div className="feedback-type-row">
                {TYPES.map((t) => (
                  <button
                    key={t.id}
                    className={`feedback-type-btn${type === t.id ? " active" : ""}`}
                    onClick={() => setType(t.id)}
                  >{t.label}</button>
                ))}
              </div>

              <input
                className="feedback-input"
                placeholder="Short title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && close()}
              />

              <textarea
                className="feedback-textarea"
                placeholder="Describe the issue or suggestion…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                autoFocus
              />

              <div className="feedback-footer">
                <span className="feedback-note">
                  Opens a GitHub issue — requires a GitHub account
                </span>
                <button
                  className="feedback-submit-btn"
                  onClick={submit}
                  disabled={!body.trim()}
                >
                  Open on GitHub →
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

function ChatIcon({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round">
      <path d="M17 11.5a1.5 1.5 0 0 1-1.5 1.5H6l-3 3V4.5A1.5 1.5 0 0 1 4.5 3h11A1.5 1.5 0 0 1 17 4.5v7z"/>
    </svg>
  );
}
