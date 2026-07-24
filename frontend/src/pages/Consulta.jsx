import { Fragment, useEffect, useMemo, useState } from 'react'
import { listAll } from '../api'
import { CATEGORIAS, money } from '../constants'

export default function Consulta() {
  const [rows, setRows] = useState([])
  const [marcas, setMarcas] = useState([])
  const [propietarios, setPropietarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [expanded, setExpanded] = useState(() => new Set())

  const [filtros, setFiltros] = useState({
    marca: '', propietario: '', categoria: '', ciudad: '', search: '',
  })

  useEffect(() => {
    (async () => {
      const [m, p] = await Promise.all([listAll('marcas'), listAll('propietarios')])
      setMarcas(m); setPropietarios(p)
    })()
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErr('')
    const params = {}
    if (filtros.marca) params.marca = filtros.marca
    if (filtros.propietario) params.propietario = filtros.propietario
    if (filtros.categoria) params.categoria = filtros.categoria
    if (filtros.ciudad) params.propietario__ciudad__icontains = filtros.ciudad
    if (filtros.search) params.search = filtros.search

    listAll('consulta', params)
      .then((data) => { if (!cancelled) setRows(data) })
      .catch(() => { if (!cancelled) setErr('No se pudo cargar la consulta. Revisa que el backend esté corriendo.') })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [filtros])

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const totales = useMemo(() => {
    const valorAutos = rows.reduce((acc, r) => acc + Number(r.precio || 0), 0)
    const costoMant = rows.reduce((acc, r) => acc + Number(r.costo_total_mantenimiento || 0), 0)
    const numMant = rows.reduce((acc, r) => acc + Number(r.total_mantenimientos || 0), 0)
    return { valorAutos, costoMant, numMant, valorTotal: valorAutos + costoMant }
  }, [rows])

  return (
    <div>
      <div className="page-intro">
        <h2>Consulta relacionada</h2>
        <p className="muted">
          Une <strong>marca</strong>, <strong>propietario</strong>, <strong>auto</strong> y su historial de{' '}
          <strong>mantenimientos</strong> en una sola vista, con filtros combinables.
        </p>
      </div>

      <div className="filters card">
        <label>
          <span>Marca</span>
          <select value={filtros.marca} onChange={(e) => setFiltros((f) => ({ ...f, marca: e.target.value }))}>
            <option value="">Todas</option>
            {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </label>
        <label>
          <span>Propietario</span>
          <select value={filtros.propietario} onChange={(e) => setFiltros((f) => ({ ...f, propietario: e.target.value }))}>
            <option value="">Todos</option>
            {propietarios.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
        </label>
        <label>
          <span>Categoría</span>
          <select value={filtros.categoria} onChange={(e) => setFiltros((f) => ({ ...f, categoria: e.target.value }))}>
            <option value="">Todas</option>
            {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </label>
        <label>
          <span>Ciudad del propietario</span>
          <input value={filtros.ciudad} onChange={(e) => setFiltros((f) => ({ ...f, ciudad: e.target.value }))} placeholder="p. ej. Guadalajara" />
        </label>
        <label className="wide">
          <span>Buscar (modelo, marca, propietario, color)</span>
          <input value={filtros.search} onChange={(e) => setFiltros((f) => ({ ...f, search: e.target.value }))} placeholder="Buscar…" />
        </label>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <span className="summary-label">Autos encontrados</span>
          <span className="summary-value">{rows.length}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Valor de autos</span>
          <span className="summary-value">{money(totales.valorAutos)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Costo en mantenimientos</span>
          <span className="summary-value">{money(totales.costoMant)} <small>({totales.numMant} servicios)</small></span>
        </div>
        <div className="summary-card highlight">
          <span className="summary-label">Valor total (auto + mantenimiento)</span>
          <span className="summary-value">{money(totales.valorTotal)}</span>
        </div>
      </div>

      {err && <div className="form-error">{err}</div>}

      <div className="card">
        {loading ? (
          <p className="muted">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="muted">No hay resultados con estos filtros.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Auto</th>
                  <th>Marca</th>
                  <th>Propietario</th>
                  <th>Ciudad</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Mantenimientos</th>
                  <th>Costo mant.</th>
                  <th>Valor total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <Fragment key={r.id}>
                    <tr>
                      <td>
                        <button className="icon-btn" onClick={() => toggle(r.id)}>
                          {expanded.has(r.id) ? '▾' : '▸'}
                        </button>
                      </td>
                      <td>{r.modelo} ({r.anio})</td>
                      <td>{r.marca?.nombre} <span className="muted-inline">— {r.marca?.pais_origen}</span></td>
                      <td>{r.propietario?.nombre ?? 'Sin propietario'}</td>
                      <td>{r.propietario?.ciudad ?? '—'}</td>
                      <td>{r.categoria_display}</td>
                      <td>{money(r.precio)}</td>
                      <td>{r.total_mantenimientos}</td>
                      <td>{money(r.costo_total_mantenimiento)}</td>
                      <td><strong>{money(r.costo_total_propiedad)}</strong></td>
                    </tr>
                    {expanded.has(r.id) && (
                      <tr className="detail-row">
                        <td></td>
                        <td colSpan={9}>
                          {r.mantenimientos.length === 0 ? (
                            <span className="muted">Sin mantenimientos registrados.</span>
                          ) : (
                            <table className="nested-table">
                              <thead>
                                <tr>
                                  <th>Fecha</th><th>Tipo</th><th>Taller</th><th>Costo</th><th>Notas</th>
                                </tr>
                              </thead>
                              <tbody>
                                {r.mantenimientos.map((m) => (
                                  <tr key={m.id}>
                                    <td>{m.fecha_servicio}</td>
                                    <td>{m.tipo_servicio_display}</td>
                                    <td>{m.taller}</td>
                                    <td>{money(m.costo)}</td>
                                    <td>{m.notas || '—'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}