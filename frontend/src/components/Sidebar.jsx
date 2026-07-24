const ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: '🗂️' },
  { key: 'consulta', label: 'Consulta relacionada', icon: '🔎' },
]

export default function Sidebar({ active, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">🏎️</span>
        <div>
          <div className="brand-title">Colección de Autos</div>
          <div className="brand-sub">Deportivos</div>
        </div>
      </div>
      <nav>
        {ITEMS.map((item) => (
          <button
            key={item.key}
            className={`nav-item ${active === item.key ? 'active' : ''}`}
            onClick={() => onSelect(item.key)}
          >
            <span>{item.icon}</span> {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}