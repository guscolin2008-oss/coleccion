import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Consulta from './pages/Consulta'

export default function App() {
  const [section, setSection] = useState('dashboard')

  return (
    <div className="layout">
      <Sidebar active={section} onSelect={setSection} />
      <main className="content">
        <header className="content-header">
          <h1>{section === 'dashboard' ? 'Dashboard de la colección' : 'Consulta relacionada'}</h1>
          <p className="muted">
            {section === 'dashboard'
              ? 'Administra marcas, propietarios, autos y mantenimientos.'
              : 'Vista de las 4 tablas relacionadas entre sí, con filtros.'}
          </p>
        </header>
        {section === 'dashboard' ? <Dashboard /> : <Consulta />}
      </main>
    </div>
  )
}