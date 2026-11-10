import { FormEvent, useMemo, useState } from "react";

type IconName =
  | "activity"
  | "arrow"
  | "calendar"
  | "check"
  | "chevron"
  | "clock"
  | "dumbbell"
  | "flame"
  | "home"
  | "moon"
  | "plus"
  | "stats"
  | "sun"
  | "user"
  | "x";

const paths: Record<IconName, React.ReactNode> = {
  activity: <><path d="M4 12h3l2-7 4 14 2-7h5" /></>,
  arrow: <><path d="m9 18 6-6-6-6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  chevron: <><path d="m6 9 6 6 6-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  dumbbell: <><path d="M6.5 6.5v11M3.5 8.5v7M17.5 6.5v11M20.5 8.5v7M6.5 12h11" /></>,
  flame: <><path d="M12 22c4 0 7-3 7-7 0-3-1.5-5.5-4-8 .2 2-1 3.2-2 4-1-3-3-5-3-8-3 2.5-5 6-5 10 0 5 3 9 7 9Z" /><path d="M9.5 18c0-2 1.2-3.2 2.5-4.5.2 1.5 1.5 2.2 2.5 3.5.5 2-1 3-2.5 3s-2.5-.8-2.5-2Z" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  moon: <><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  stats: <><path d="M5 20V10M12 20V4M19 20v-7" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.7-4 3.4-6 8-6s7.3 2 8 6" /></>,
  x: <><path d="m6 6 12 12M18 6 6 18" /></>,
};

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
    >
      {paths[name]}
    </svg>
  );
}

type Workout = {
  id: number;
  name: string;
  focus: string;
  duration: number;
  exercises: { name: string; sets: number; reps: string }[];
};

type AccountStatus = "logged-out" | "free" | "premium";

const initialWorkouts: Workout[] = [
  {
    id: 1,
    name: "Upper Power",
    focus: "Peito, ombro e tríceps",
    duration: 52,
    exercises: [
      { name: "Supino reto", sets: 4, reps: "8–10" },
      { name: "Desenvolvimento", sets: 3, reps: "10–12" },
      { name: "Crucifixo inclinado", sets: 3, reps: "12" },
      { name: "Tríceps na polia", sets: 4, reps: "10–12" },
    ],
  },
  {
    id: 2,
    name: "Lower Strength",
    focus: "Pernas e glúteos",
    duration: 48,
    exercises: [
      { name: "Agachamento livre", sets: 4, reps: "6–8" },
      { name: "Leg press", sets: 4, reps: "10" },
      { name: "Stiff", sets: 3, reps: "10–12" },
      { name: "Panturrilha em pé", sets: 4, reps: "15" },
    ],
  },
  {
    id: 3,
    name: "Pull & Core",
    focus: "Costas, bíceps e abdômen",
    duration: 45,
    exercises: [
      { name: "Puxada alta", sets: 4, reps: "8–10" },
      { name: "Remada baixa", sets: 3, reps: "10–12" },
      { name: "Rosca direta", sets: 3, reps: "12" },
      { name: "Prancha", sets: 3, reps: "45 seg" },
    ],
  },
];

const adContent = {
  Início: {
    brand: "PULSE FUEL",
    title: "Energia para a próxima série.",
    copy: "20% OFF em suplementos selecionados",
    tag: "NUTRIÇÃO ESPORTIVA",
  },
  Treinos: {
    brand: "MOVE PRO",
    title: "Seu treino merece o tênis certo.",
    copy: "Frete grátis na primeira compra",
    tag: "PERFORMANCE",
  },
  Progresso: {
    brand: "RECOVER+",
    title: "Evolução também acontece no descanso.",
    copy: "Conheça a linha de recuperação muscular",
    tag: "RECUPERAÇÃO",
  },
};

function AdBanner({ screen }: { screen: keyof typeof adContent }) {
  const ad = adContent[screen];

  return (
    <aside className={`ad-banner ad-${screen.toLowerCase()}`} aria-label="Publicidade">
      <div className="ad-meta">
        <span>PUBLICIDADE</span>
        <i>AD</i>
      </div>
      <div className="ad-body">
        <div className="ad-mark">{ad.brand.slice(0, 1)}</div>
        <div className="ad-copy">
          <span>{ad.tag}</span>
          <strong>{ad.title}</strong>
          <small>{ad.copy}</small>
        </div>
        <button type="button" aria-label={`Ver oferta de ${ad.brand}`}>
          Ver oferta <Icon name="arrow" size={16} />
        </button>
      </div>
      <div className="ad-brand">{ad.brand}</div>
    </aside>
  );
}

function Heatmap() {
  const cells = useMemo(
    () =>
      Array.from({ length: 364 }, (_, i) => {
        const seed = (i * 17 + i * i * 3) % 23;
        if (seed < 11) return 0;
        if (seed < 16) return 1;
        if (seed < 20) return 2;
        if (seed < 22) return 3;
        return 4;
      }),
    [],
  );

  return (
    <div className="heatmap-shell">
      <div className="heatmap-months">
        <span>Jan</span><span>Mar</span><span>Mai</span><span>Jul</span><span>Set</span><span>Nov</span>
      </div>
      <div className="heatmap" aria-label="Calendário anual de treinos">
        {cells.map((level, index) => (
          <span className={`heat-cell level-${level}`} key={index} title={`${level ? "Treino concluído" : "Sem treino"} · dia ${index + 1}`} />
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Menos</span>
        {[0, 1, 2, 3, 4].map((level) => <i className={`heat-cell level-${level}`} key={level} />)}
        <span>Mais</span>
      </div>
    </div>
  );
}

function CreateWorkout({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (workout: Workout) => void;
}) {
  const [name, setName] = useState("");
  const [exercise, setExercise] = useState("");
  const [exercises, setExercises] = useState<Workout["exercises"]>([]);

  function addExercise() {
    if (!exercise.trim()) return;
    setExercises([...exercises, { name: exercise.trim(), sets: 3, reps: "10–12" }]);
    setExercise("");
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim() || !exercises.length) return;
    onCreate({
      id: Date.now(),
      name: name.trim(),
      focus: `${exercises.length} exercícios`,
      duration: exercises.length * 10,
      exercises,
    });
  }

  return (
    <div className="overlay" role="presentation" onMouseDown={onClose}>
      <form className="sheet" onMouseDown={(event) => event.stopPropagation()} onSubmit={submit}>
        <div className="sheet-handle" />
        <div className="sheet-heading">
          <div>
            <span className="eyebrow dark">NOVA ROTINA</span>
            <h2>Criar treino</h2>
          </div>
          <button className="icon-button muted" onClick={onClose} type="button" aria-label="Fechar">
            <Icon name="x" />
          </button>
        </div>
        <label className="field">
          <span>Nome do treino</span>
          <input autoFocus placeholder="Ex: Push day" value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <div className="field">
          <span>Exercícios</span>
          <div className="input-action">
            <input
              placeholder="Adicionar exercício"
              value={exercise}
              onChange={(event) => setExercise(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addExercise();
                }
              }}
            />
            <button type="button" onClick={addExercise} aria-label="Adicionar exercício"><Icon name="plus" size={20} /></button>
          </div>
        </div>
        <div className="new-exercises">
          {exercises.map((item, index) => (
            <div className="new-exercise" key={`${item.name}-${index}`}>
              <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.name}</strong>
              <span>3 × 10–12</span>
            </div>
          ))}
          {!exercises.length && <p>Adicione pelo menos um exercício para salvar.</p>}
        </div>
        <button className="primary full" type="submit" disabled={!name.trim() || !exercises.length}>
          Salvar treino <Icon name="arrow" size={19} />
        </button>
      </form>
    </div>
  );
}

function ActiveWorkout({ workout, onClose }: { workout: Workout; onClose: () => void }) {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const exercise = workout.exercises[current];
  const progress = Math.round((completed.length / workout.exercises.length) * 100);

  function complete() {
    if (!completed.includes(current)) setCompleted([...completed, current]);
    if (current < workout.exercises.length - 1) setCurrent(current + 1);
  }

  return (
    <div className="active-screen">
      <header className="active-header">
        <button className="icon-button dark-button" onClick={onClose} aria-label="Fechar treino"><Icon name="x" /></button>
        <div><span>EM ANDAMENTO</span><strong>{workout.name}</strong></div>
        <span className="timer">18:42</span>
      </header>
      <div className="active-progress"><i style={{ width: `${progress}%` }} /></div>
      <main className="active-content">
        <div className="active-count">{String(current + 1).padStart(2, "0")}<span>/ {String(workout.exercises.length).padStart(2, "0")}</span></div>
        <span className="eyebrow dark">EXERCÍCIO ATUAL</span>
        <h1>{exercise.name}</h1>
        <div className="prescription">
          <div><span>SÉRIES</span><strong>{exercise.sets}</strong></div>
          <i />
          <div><span>REPETIÇÕES</span><strong>{exercise.reps}</strong></div>
        </div>
        <div className="sets">
          {Array.from({ length: exercise.sets }, (_, index) => (
            <button className={index === 0 ? "set done" : "set"} key={index}>
              <span>Série {index + 1}</span><strong>{index === 0 ? "80 kg" : "— kg"}</strong>
              <i>{index === 0 ? <Icon name="check" size={17} /> : index + 1}</i>
            </button>
          ))}
        </div>
        <button className="primary full workout-next" onClick={complete}>
          {current === workout.exercises.length - 1 ? "Finalizar treino" : "Concluir e avançar"} <Icon name="arrow" size={19} />
        </button>
      </main>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("Início");
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [creating, setCreating] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [accountStatus, setAccountStatus] = useState<AccountStatus>("logged-out");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const showAds = accountStatus !== "premium";

  function createWorkout(workout: Workout) {
    setWorkouts([...workouts, workout]);
    setCreating(false);
    setTab("Treinos");
  }

  function login(event: FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setAccountStatus("free");
    setPassword("");
  }

  function logout() {
    setAccountStatus("logged-out");
    setEmail("");
    setPassword("");
  }

  if (activeWorkout) {
    return (
      <div className={theme === "dark" ? "theme-dark" : ""}>
        <ActiveWorkout workout={activeWorkout} onClose={() => setActiveWorkout(null)} />
      </div>
    );
  }

  return (
    <div className={`app ${theme === "dark" ? "theme-dark" : ""}`}>
      <header className="topbar">
        <div className="brand"><span><Icon name="activity" size={18} /></span> REP</div>
        <button className="profile" onClick={() => setTab("Perfil")} aria-label="Abrir perfil">
          <span>{accountStatus === "premium" ? "PREMIUM" : accountStatus === "free" ? "FREE" : "ENTRAR"}</span>
          <div><Icon name="user" size={19} /></div>
        </button>
      </header>

      <main className="content">
        {tab === "Início" && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">QUINTA, 22 DE MAIO</span>
                <h1>Pronto para<br /><em>ir além?</em></h1>
                <p>Consistência transforma esforço em resultado.</p>
              </div>
              <div className="streak"><Icon name="flame" size={18} /><strong>8</strong><span>dias<br />seguidos</span></div>
            </section>

            <section className="next-workout">
              <div className="section-heading">
                <div><span className="eyebrow dark">PRÓXIMO TREINO</span><h2>Upper Power</h2></div>
                <div className="duration"><Icon name="clock" size={17} /> 52 min</div>
              </div>
              <div className="exercise-preview">
                {initialWorkouts[0].exercises.slice(0, 3).map((item, index) => (
                  <div key={item.name}>
                    <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
                    <p><strong>{item.name}</strong><span>{item.sets} séries · {item.reps} reps</span></p>
                  </div>
                ))}
                <span className="more">+1</span>
              </div>
              <button className="primary full" onClick={() => setActiveWorkout(workouts[0])}>
                Iniciar treino <Icon name="arrow" size={19} />
              </button>
            </section>

            {showAds && <AdBanner screen="Início" />}

            <section className="year-section">
              <div className="section-heading">
                <div><span className="eyebrow dark">SEU RITMO</span><h2>Um ano em movimento</h2></div>
                <strong className="year-count">94 <span>treinos</span></strong>
              </div>
              <Heatmap />
              <div className="stats-row">
                <div><Icon name="flame" size={20} /><p><strong>8 dias</strong><span>Sequência atual</span></p></div>
                <div><Icon name="calendar" size={20} /><p><strong>12 treinos</strong><span>Este mês</span></p></div>
              </div>
            </section>
          </>
        )}

        {tab === "Treinos" && (
          <section className="page-section">
            <span className="eyebrow dark">SUAS ROTINAS</span>
            <div className="page-title"><h1>Meus treinos</h1><button className="round-add" onClick={() => setCreating(true)}><Icon name="plus" /></button></div>
            <p className="page-subtitle">Escolha uma rotina e comece a se mover.</p>
            <div className="workout-list">
              {workouts.map((workout, index) => (
                <article className="workout-card" key={workout.id}>
                  <div className={`workout-index color-${index % 3}`}>{String(index + 1).padStart(2, "0")}</div>
                  <div className="workout-info">
                    <h2>{workout.name}</h2>
                    <p>{workout.focus}</p>
                    <span><Icon name="dumbbell" size={16} /> {workout.exercises.length} exercícios <i /> <Icon name="clock" size={16} /> {workout.duration} min</span>
                  </div>
                  <button className="card-arrow" onClick={() => setActiveWorkout(workout)} aria-label={`Iniciar ${workout.name}`}><Icon name="arrow" /></button>
                </article>
              ))}
            </div>
            {showAds && <AdBanner screen="Treinos" />}
          </section>
        )}

        {tab === "Progresso" && (
          <section className="page-section">
            <span className="eyebrow dark">CONSISTÊNCIA</span>
            <div className="page-title"><h1>Seu progresso</h1></div>
            <p className="page-subtitle">Cada quadrado conta uma parte da sua história.</p>
            <div className="progress-hero">
              <div><span>TREINOS EM 2025</span><strong>94</strong></div>
              <div><span>MELHOR SEQUÊNCIA</span><strong>16 <small>dias</small></strong></div>
            </div>
            <div className="progress-card">
              <div className="section-heading"><h2>Atividade anual</h2><span className="status-pill">+18% este ano</span></div>
              <Heatmap />
            </div>
            <div className="milestone">
              <div><Icon name="flame" /></div>
              <p><span>PRÓXIMO MARCO</span><strong>100 treinos no ano</strong><small>Faltam apenas 6 treinos. Continue assim.</small></p>
              <strong>94%</strong>
            </div>
            {showAds && <AdBanner screen="Progresso" />}
          </section>
        )}

        {tab === "Perfil" && (
          <section className="page-section profile-page">
            <span className="eyebrow dark">SUA CONTA</span>
            <div className="page-title"><h1>Perfil</h1></div>
            <div className="theme-setting">
              <div className="theme-setting-icon">
                <Icon name={theme === "dark" ? "moon" : "sun"} size={21} />
              </div>
              <div>
                <strong>Tema do aplicativo</strong>
                <span>{theme === "dark" ? "Escuro" : "Claro"}</span>
              </div>
              <button
                aria-label={`Ativar tema ${theme === "dark" ? "claro" : "escuro"}`}
                aria-pressed={theme === "dark"}
                className={`theme-toggle ${theme === "dark" ? "is-dark" : ""}`}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                type="button"
              >
                <i />
              </button>
            </div>
            {accountStatus === "logged-out" ? (
              <>
                <div className="login-intro">
                  <div className="login-icon"><Icon name="user" size={27} /></div>
                  <div>
                    <span>REP MEMBER</span>
                    <h2>Seu treino, sempre com você.</h2>
                    <p>Entre para manter suas rotinas e acompanhar sua evolução.</p>
                  </div>
                </div>
                <form className="login-form" onSubmit={login}>
                  <label className="field">
                    <span>E-MAIL</span>
                    <input
                      autoComplete="email"
                      type="email"
                      placeholder="voce@email.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>SENHA</span>
                    <input
                      autoComplete="current-password"
                      type="password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </label>
                  <button className="primary full" type="submit" disabled={!email.trim() || !password.trim()}>
                    Entrar na conta <Icon name="arrow" size={19} />
                  </button>
                  <button className="text-button" type="button">Esqueci minha senha</button>
                </form>
                <div className="login-note">
                  <strong>Ambiente de demonstração</strong>
                  <span>Use qualquer e-mail e senha para entrar no plano Free.</span>
                </div>
              </>
            ) : (
              <>
                <div className="account-card">
                  <div className="account-avatar"><Icon name="user" size={29} /></div>
                  <div>
                    <span>MEMBRO REP</span>
                    <h2>{email.split("@")[0] || "Atleta"}</h2>
                    <p>{email || "atleta@rep.fit"}</p>
                  </div>
                  <span className={`plan-badge ${accountStatus}`}>{accountStatus === "premium" ? "PREMIUM" : "FREE"}</span>
                </div>

                <div className={`plan-card ${accountStatus === "premium" ? "is-premium" : ""}`}>
                  <div className="plan-heading">
                    <div>
                      <span>SEU PLANO</span>
                      <h2>{accountStatus === "premium" ? "REP Premium" : "REP Free"}</h2>
                    </div>
                    <Icon name={accountStatus === "premium" ? "flame" : "activity"} size={25} />
                  </div>
                  <ul>
                    <li><Icon name="check" size={16} /> Rotinas de treino personalizadas</li>
                    <li><Icon name="check" size={16} /> Histórico anual de atividade</li>
                    <li className={accountStatus === "free" ? "unavailable" : ""}>
                      <Icon name={accountStatus === "premium" ? "check" : "x"} size={16} />
                      Experiência sem anúncios
                    </li>
                  </ul>
                  <button
                    className={accountStatus === "premium" ? "secondary full" : "primary premium-action full"}
                    onClick={() => setAccountStatus(accountStatus === "premium" ? "free" : "premium")}
                    type="button"
                  >
                    {accountStatus === "premium" ? "Voltar para o plano Free" : "Experimentar Premium"}
                  </button>
                </div>

                <div className="account-actions">
                  <button type="button"><span><Icon name="user" size={19} /> Dados da conta</span><Icon name="arrow" size={18} /></button>
                  <button type="button"><span><Icon name="activity" size={19} /> Preferências</span><Icon name="arrow" size={18} /></button>
                  <button className="logout-button" onClick={logout} type="button">Sair da conta</button>
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        {[
          ["Início", "home"],
          ["Treinos", "dumbbell"],
          ["Progresso", "stats"],
          ["Perfil", "user"],
        ].map(([label, icon]) => (
          <button className={tab === label ? "active" : ""} onClick={() => setTab(label)} key={label}>
            <Icon name={icon as IconName} size={21} /><span>{label}</span>
          </button>
        ))}
      </nav>
      {creating && <CreateWorkout onClose={() => setCreating(false)} onCreate={createWorkout} />}
    </div>
  );
}
