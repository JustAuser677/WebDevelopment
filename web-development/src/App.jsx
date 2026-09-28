import { useEffect, useMemo, useState } from "react";
import tile from "./assets/figma/catalog-imgVector15.svg";
import outline from "./assets/figma/catalog-imgVector16.svg";
import line from "./assets/figma/catalog-imgVector17.svg";
import heroTile from "./assets/figma/event-imgVector8.svg";
import "./App.css";

const events = [
  {
    id: "semantic-html",
    type: "Frontend",
    title: "Семантический HTML",
    date: "18 сен",
    time: "16:00",
    place: "ауд. 304",
    format: "Очно",
    seats: 18,
    level: "Для всех",
  },
  {
    id: "git",
    type: "Инструменты",
    title: "Git без страха",
    date: "19 сен",
    time: "14:30",
    place: "online",
    format: "Онлайн",
    seats: 8,
    level: "Начальный",
  },
  {
    id: "ux",
    type: "UX/UI",
    title: "UX-разбор интерфейсов",
    date: "21 сен",
    time: "17:00",
    place: "коворкинг",
    format: "Очно",
    seats: 5,
    level: "Для всех",
  },
  {
    id: "rest",
    type: "Backend",
    title: "REST API на практике",
    date: "23 сен",
    time: "15:00",
    place: "ауд. 211",
    format: "Очно",
    seats: 14,
    level: "Продвинутый",
  },
  {
    id: "portfolio",
    type: "Карьера",
    title: "Портфолио разработчика",
    date: "25 сен",
    time: "18:00",
    place: "online",
    format: "Онлайн",
    seats: 32,
    level: "Для всех",
  },
  {
    id: "a11y",
    type: "Frontend",
    title: "Доступность в вебе",
    date: "27 сен",
    time: "13:00",
    place: "ауд. 118",
    format: "Очно",
    seats: 10,
    level: "Начальный",
  },
];
const chips = ["Все", "Frontend", "Backend", "UX/UI", "Карьера"];
const defaultFilters = {
  date: "На этой неделе",
  formats: ["Очно"],
  level: "Для всех",
};
const plural = (n, one, few, many) =>
  n % 10 === 1 && n % 100 !== 11
    ? one
    : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)
      ? few
      : many;
const inCurrentWeek = (date) => {
  const today = new Date();
  const monday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - ((today.getDay() + 6) % 7),
  );
  const sunday = new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 7,
  );
  const eventDate = new Date(
    today.getFullYear(),
    8,
    Number(date.split(" ")[0]),
  );
  return eventDate >= monday && eventDate < sunday;
};
const stored = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

function Artwork({ large = false }) {
  return (
    <div className={large ? "artwork large" : "artwork"}>
      <span className="art-icon">
        {large ? (
          <>
            <img src={heroTile} width="82" height="82" alt="" />
            <b>{"</>"}</b>
          </>
        ) : (
          <>
            <img src={tile} width="56" height="56" alt="" />
            <img
              className="art-outline"
              src={outline}
              width="38"
              height="32"
              alt=""
            />
            <img className="art-line" src={line} width="36" height="2" alt="" />
          </>
        )}
      </span>
    </div>
  );
}

function Card({ item, favorite, toggle, open }) {
  return (
    <article className="event-card">
      <div className="card-art">
        <Artwork />
        <button
          className={favorite ? "heart selected" : "heart"}
          onClick={toggle}
          aria-label={
            favorite ? "Убрать из избранного" : "Добавить в избранное"
          }
          aria-pressed={favorite}
        >
          {favorite ? "♥" : "♡"}
        </button>
      </div>
      <div className="card-info">
        <span className="tag">{item.type}</span>
        <button className="card-title" onClick={open}>
          {item.title}
        </button>
        <span className="card-meta">
          {item.date} · {item.time} · {item.place}
        </span>
        <span className="card-seats">
          {item.seats} {plural(item.seats, "место", "места", "мест")}
        </span>
      </div>
    </article>
  );
}

function Catalog({
  query,
  setQuery,
  category,
  setCategory,
  sort,
  setSort,
  draft,
  setDraft,
  apply,
  reset,
  items,
  favorites,
  toggle,
  open,
}) {
  const toggleFormat = (format) =>
    setDraft((old) => ({
      ...old,
      formats: old.formats.includes(format)
        ? old.formats.filter((x) => x !== format)
        : [...old.formats, format],
    }));
  return (
    <section className="catalog">
      <h1>Учебные мероприятия</h1>
      <p className="subtitle">
        Найдите лекцию, мастер-класс или встречу по интересам.
      </p>
      <div className="catalog-controls">
        <input
          type="search"
          aria-label="Поиск по названию или теме"
          placeholder="Поиск по названию или теме..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          aria-label="Сортировка"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Сначала новые</option>
          <option value="oldest">Сначала старые</option>
        </select>
        <button className="secondary" onClick={reset}>
          Сбросить
        </button>
      </div>
      <div className="filter-bar">
        <span>Фильтры</span>
        <div className="chips">
          {chips.map((x) => (
            <button
              key={x}
              className={x === category ? "chip active" : "chip"}
              onClick={() => setCategory(x)}
              aria-pressed={x === category}
            >
              {x}
            </button>
          ))}
        </div>
        <span className="count">
          {items.length} {plural(items.length, "событие", "события", "событий")}
        </span>
      </div>
      <div className="catalog-layout">
        <div className="cards">
          {items.length ? (
            items.map((item) => (
              <Card
                key={item.id}
                item={item}
                favorite={favorites.includes(item.id)}
                toggle={() => toggle(item.id)}
                open={() => open(item.id)}
              />
            ))
          ) : (
            <div className="empty">
              Мероприятия не найдены.{" "}
              <button onClick={reset}>Сбросить фильтры</button>
            </div>
          )}
        </div>
        <aside className="filters panel">
          <h2>Мои фильтры</h2>
          <label className="field-label" htmlFor="filter-date">
            Дата
          </label>
          <select
            id="filter-date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          >
            <option>На этой неделе</option>
            <option>Любая дата</option>
          </select>
          <fieldset>
            <legend>Формат</legend>
            {["Очно", "Онлайн"].map((x) => (
              <label key={x}>
                <input
                  type="checkbox"
                  checked={draft.formats.includes(x)}
                  onChange={() => toggleFormat(x)}
                />
                {x}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Уровень</legend>
            {["Для всех", "Начальный", "Продвинутый"].map((x) => (
              <label key={x}>
                <input
                  type="radio"
                  name="level"
                  checked={draft.level === x}
                  onChange={() => setDraft({ ...draft, level: x })}
                />
                {x}
              </label>
            ))}
          </fieldset>
          <button className="primary apply" onClick={apply}>
            Применить
          </button>
        </aside>
      </div>
    </section>
  );
}

function Event({ item, favorite, toggle, back, register, registered }) {
  const [tab, setTab] = useState("Описание");
  const semantic = item.id === "semantic-html";
  return (
    <section className="event-page">
      <button className="back" onClick={back}>
        ← Назад к каталогу
      </button>
      <div className="event-layout">
        <div className="event-content">
          <div className="event-hero panel">
            <Artwork large />
            <div>
              <span className="tag">{item.type}</span>
              <h1>
                {item.id === "semantic-html"
                  ? "Семантический HTML без лишних div"
                  : item.title}
              </h1>
              <p>
                {item.id === "semantic-html"
                  ? "Разберём структуру страницы, landmark-области и доступные формы."
                  : "Учебное мероприятие для развития навыков."}
              </p>
              <div className="event-facts">
                <strong>
                  {item.id === "semantic-html" ? "18 сентября" : item.date} ·{" "}
                  {item.time}
                </strong>
                <strong>
                  {item.id === "semantic-html"
                    ? "Аудитория 304 · 90 минут"
                    : item.place}
                </strong>
              </div>
            </div>
          </div>
          <div
            className="tabs panel"
            role="tablist"
            aria-label="Сведения о мероприятии"
          >
            {["Описание", "Программа", "Спикеры"].map((x) => (
              <button
                key={x}
                role="tab"
                aria-selected={tab === x}
                className={tab === x ? "active" : ""}
                onClick={() => setTab(x)}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="description panel" role="tabpanel">
            {tab === "Описание" ? (
              <>
                <h2>О мероприятии</h2>
                <p>
                  {semantic ? (
                    <>
                      На занятии участники научатся выбирать семантические
                      элементы страницы,
                      <br className="desktop-br" /> определять границы
                      компонентов и проверять структуру документа до стилизации.
                    </>
                  ) : (
                    <>
                      На встрече участники познакомятся с темой «{item.title}» и
                      разберут практические примеры.
                    </>
                  )}
                </p>
                <div className="description-grid">
                  <div>
                    <h3>Что будет на встрече</h3>
                    <ul>
                      {(semantic
                        ? [
                            "landmark-элементы: header, nav, main, aside, footer;",
                            "article и section: когда использовать;",
                            "формы, label, состояния ошибок;",
                            "небольшой разбор реального макета.",
                          ]
                        : [
                            "введение в тему мероприятия;",
                            "практические примеры;",
                            "ответы на вопросы участников.",
                          ]
                      ).map((topic) => (
                        <li key={topic}>{topic}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="states">
                    <h3>Интерактивные состояния</h3>
                    <dl>
                      {[
                        ["Вкладки", "active / hover"],
                        ["Запись", "default / loading"],
                        ["Избранное", "off / on"],
                        ["Места", "available / full"],
                      ].map(([a, b]) => (
                        <div key={a}>
                          <dt>{a}</dt>
                          <dd>{b}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </>
            ) : tab === "Программа" ? (
              <>
                <h2>Программа</h2>
                <ul className="program">
                  {(semantic
                    ? [
                        "Семантическая структура страницы и landmark-элементы",
                        "Когда использовать article и section",
                        "Доступные формы и состояния ошибок",
                        "Разбор реального макета",
                      ]
                    : [item.title, "Практические примеры", "Вопросы участников"]
                  ).map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <h2>Спикеры</h2>
                <p>Преподаватели кафедры веб-технологий.</p>
              </>
            )}
          </div>
        </div>
        <aside className="booking panel">
          <h2>Запись на мероприятие</h2>
          <p className="availability">Осталось {item.seats} из 40 мест</p>
          <div className="progress">
            <span style={{ width: `${((40 - item.seats) / 40) * 100}%` }} />
          </div>
          <button className="primary" onClick={register}>
            {registered ? "Изменить заявку" : "Записаться"}
          </button>
          <button
            className="secondary"
            onClick={toggle}
            aria-pressed={favorite}
          >
            {favorite ? "♥ В избранном" : "♡ В избранное"}
          </button>
          <div className="organizer">
            <span>Организатор</span>
            <strong>Кафедра веб-технологий</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Registration({ eventId, registrations, save, cancel, goMine }) {
  const existing = registrations.find((x) => x.eventId === eventId);
  const [form, setForm] = useState(
    existing || {
      name: "Алексей Вернер",
      email: "student@example.com",
      group: "ИТИС-41",
      format: "Очно",
      comment: "",
      consent: true,
    },
  );
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const change = (key, value) => {
    setForm((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: null }));
  };
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = "Укажите имя и фамилию";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Введите корректный e-mail";
    if (!form.consent) next.consent = "Необходимо согласие с правилами участия";
    setErrors(next);
    if (Object.keys(next).length) return;
    setStatus("loading");
    window.setTimeout(() => {
      save({ ...form, eventId, submittedAt: new Date().toISOString() });
      setStatus("success");
    }, 650);
  };
  return (
    <section className="registration">
      <h1>Регистрация на мероприятие</h1>
      <p className="subtitle">
        Заполните данные. Поля со звёздочкой обязательны.
      </p>
      <div className="registration-layout">
        <form className="registration-form panel" onSubmit={submit} noValidate>
          <h2>Контактные данные</h2>
          <label className="field-label" htmlFor="name">
            Имя и фамилия *
          </label>
          <input
            id="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <span className="error">{errors.name}</span>}
          <label className="field-label" htmlFor="email">
            E-mail *
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => change("email", e.target.value)}
            aria-invalid={!!errors.email}
          />
          {errors.email && <span className="error">{errors.email}</span>}
          <label className="field-label" htmlFor="group">
            Группа / команда
          </label>
          <input
            id="group"
            value={form.group}
            onChange={(e) => change("group", e.target.value)}
          />
          <fieldset>
            <legend>Формат участия *</legend>
            <div className="format-options">
              {["Очно", "Онлайн"].map((x) => (
                <label key={x}>
                  <input
                    type="radio"
                    name="format"
                    checked={form.format === x}
                    onChange={() => change("format", x)}
                  />
                  {x}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="field-label" htmlFor="comment">
            Комментарий
          </label>
          <textarea
            id="comment"
            placeholder="Например, вопрос организатору..."
            value={form.comment}
            onChange={(e) => change("comment", e.target.value)}
          />
          <label className="consent">
            <input
              type="checkbox"
              checked={form.consent}
              onChange={(e) => change("consent", e.target.checked)}
            />
            Я согласен с правилами участия
          </label>
          {errors.consent && <span className="error">{errors.consent}</span>}
          <div className="form-actions">
            <button
              className="primary"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Отправка…" : "Отправить заявку"}
            </button>
            <button className="secondary" type="button" onClick={cancel}>
              Отмена
            </button>
          </div>
          {status === "success" && (
            <div className="inline-success" role="status">
              ✓ Заявка принята. Она сохранена в «Моих событиях».
            </div>
          )}
        </form>
        <aside className="form-states panel">
          <h2>Состояния формы</h2>
          <div className="state-block">
            <h3>1. Ошибка обязательного поля</h3>
            <label className="field-label" htmlFor="example-email">
              E-mail *
            </label>
            <input
              id="example-email"
              value="student@"
              readOnly
              aria-invalid="true"
            />
            <span className="error">Введите корректный e-mail</span>
          </div>
          <div className="state-block">
            <h3>2. Отправка</h3>
            <button className="primary loading" disabled>
              Отправка...
            </button>
            <p>Кнопка недоступна до завершения.</p>
          </div>
          <div className="state-block">
            <h3>3. Успех</h3>
            <div className="success-box">
              <strong>✓ Заявка принята</strong>
              <p>Подтверждение отправлено на почту.</p>
              <button onClick={goMine}>Перейти в «Мои события» →</button>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [query, setQuery] = useState(""),
    [headerQuery, setHeaderQuery] = useState(""),
    [category, setCategory] = useState("Все"),
    [sort, setSort] = useState("newest");
  const [draft, setDraft] = useState(defaultFilters),
    [filters, setFilters] = useState(null);
  const [favorites, setFavorites] = useState(() =>
    stored("campusflow-favorites", ["git", "a11y"]),
  );
  const [registrations, setRegistrations] = useState(() =>
    stored("campusflow-registrations", []),
  );
  useEffect(() => {
    const handler = () => setPath(window.location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);
  useEffect(
    () =>
      localStorage.setItem("campusflow-favorites", JSON.stringify(favorites)),
    [favorites],
  );
  useEffect(
    () =>
      localStorage.setItem(
        "campusflow-registrations",
        JSON.stringify(registrations),
      ),
    [registrations],
  );
  const navigate = (to) => {
    history.pushState({}, "", to);
    setPath(window.location.pathname);
    scrollTo({ top: 0, behavior: "smooth" });
  };
  const toggle = (id) =>
    setFavorites((old) =>
      old.includes(id) ? old.filter((x) => x !== id) : [...old, id],
    );
  const reset = () => {
    setQuery("");
    setCategory("Все");
    setSort("newest");
    setDraft(defaultFilters);
    setFilters(null);
  };
  const items = useMemo(
    () =>
      events
        .filter(
          (x) =>
            (!query.trim() ||
              `${x.title} ${x.type}`
                .toLocaleLowerCase("ru")
                .includes(query.trim().toLocaleLowerCase("ru"))) &&
            (category === "Все" || x.type === category) &&
            (!filters?.formats.length || filters.formats.includes(x.format)) &&
            (!filters ||
              filters.level === "Для всех" ||
              filters.level === x.level) &&
            (!filters ||
              filters.date === "Любая дата" ||
              inCurrentWeek(x.date)),
        )
        .sort((a, b) =>
          sort === "newest"
            ? events.indexOf(a) - events.indexOf(b)
            : events.indexOf(b) - events.indexOf(a),
        ),
    [query, category, sort, filters],
  );
  const isEvent = path.startsWith("/event/"),
    isRegister = path === "/register",
    isMine = path === "/my-events";
  const event = events.find((x) => path.endsWith(`/${x.id}`)) || events[0];
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => navigate("/catalog")}
            aria-label="CampusFlow — каталог"
          >
            <span className="brand-mark">CF</span>
            <span>CampusFlow</span>
          </button>
          <nav className="main-nav" aria-label="Основная навигация">
            <button
              className={!isRegister && !isMine ? "active" : ""}
              onClick={() => navigate("/catalog")}
            >
              Каталог
            </button>
            <button
              className={isMine ? "active" : ""}
              onClick={() => navigate("/my-events")}
            >
              Мои события
            </button>
            <button
              className={isRegister ? "active" : ""}
              onClick={() => navigate("/register")}
            >
              Профиль
            </button>
          </nav>
          <form
            className="header-search"
            onSubmit={(e) => {
              e.preventDefault();
              setQuery(headerQuery);
              navigate("/catalog");
            }}
          >
            <input
              aria-label="Поиск мероприятий"
              placeholder="Поиск"
              value={headerQuery}
              onChange={(e) => setHeaderQuery(e.target.value)}
            />
          </form>
          <button
            className="avatar"
            onClick={() => navigate("/register")}
            aria-label="Открыть профиль"
          >
            AV
          </button>
        </div>
      </header>
      <main className="shell">
        {isEvent ? (
          <Event
            item={event}
            favorite={favorites.includes(event.id)}
            toggle={() => toggle(event.id)}
            back={() => navigate("/catalog")}
            register={() => navigate(`/register?event=${event.id}`)}
            registered={registrations.some((x) => x.eventId === event.id)}
          />
        ) : isRegister ? (
          <Registration
            eventId={
              new URLSearchParams(location.search).get("event") ||
              "semantic-html"
            }
            registrations={registrations}
            save={(entry) =>
              setRegistrations((old) => [
                ...old.filter((x) => x.eventId !== entry.eventId),
                entry,
              ])
            }
            cancel={() =>
              navigate(
                "/event/" +
                  (new URLSearchParams(location.search).get("event") ||
                    "semantic-html"),
              )
            }
            goMine={() => navigate("/my-events")}
          />
        ) : isMine ? (
          <section className="my-events">
            <h1>Мои события</h1>
            <p className="subtitle">Мероприятия, на которые вы записались.</p>
            <div className="my-list">
              {registrations.length ? (
                registrations.map((entry) => {
                  const x = events.find((item) => item.id === entry.eventId);
                  return (
                    x && (
                      <Card
                        key={x.id}
                        item={x}
                        favorite={favorites.includes(x.id)}
                        toggle={() => toggle(x.id)}
                        open={() => navigate(`/event/${x.id}`)}
                      />
                    )
                  );
                })
              ) : (
                <div className="empty">
                  Пока нет записей.{" "}
                  <button onClick={() => navigate("/catalog")}>
                    Выбрать мероприятие →
                  </button>
                </div>
              )}
            </div>
          </section>
        ) : (
          <Catalog
            query={query}
            setQuery={setQuery}
            category={category}
            setCategory={setCategory}
            sort={sort}
            setSort={setSort}
            draft={draft}
            setDraft={setDraft}
            apply={() => setFilters({ ...draft })}
            reset={reset}
            items={items}
            favorites={favorites}
            toggle={toggle}
            open={(id) => navigate(`/event/${id}`)}
          />
        )}
      </main>
    </>
  );
}
export default App;
