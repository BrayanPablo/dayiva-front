import { useEffect, useState } from "react";

const THEMES = ["dayiva", "black"];

export default function ThemeSwitcher({ compact = false }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dayiva");

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    if (document.body) {
      document.body.setAttribute("data-theme", theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Normaliza tema guardado que ya no esté permitido
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (!saved || !THEMES.includes(saved)) {
      setTheme("dayiva");
    } else {
      const html = document.documentElement;
      html.setAttribute("data-theme", saved);
      if (document.body) {
        document.body.setAttribute("data-theme", saved);
      }
    }
  }, []);

  if (compact) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost">
          Tema {theme}
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48">
          {THEMES.map((t) => (
            <li key={t}>
              <a onClick={() => setTheme(t)} className={t === theme ? "active" : ""}>{t}</a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Tema</span>
      </label>
      <select
        className="select select-bordered select-sm"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        {THEMES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}


