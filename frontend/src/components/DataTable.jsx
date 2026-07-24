import { useEffect, useState, useCallback } from 'react'
import { listAll, createItem, updateItem, deleteItem } from '../api'
import Modal from './Modal'
import RecordForm from './RecordForm'

export default function DataTable({ resource, title, columns, fields, emptyLabel, onChanged }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [modalMode, setModalMode] = useState(null)
  const [editingRow, setEditingRow] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      const data = await listAll(resource)
      setRows(data)
    } catch (e) {
      setErr('No se pudo conectar con la API. Revisa que el backend Django esté corriendo.')
    } finally {
      setLoading(false)
    }
  }, [resource])

  useEffect(() => { load() }, [load])

  const handleCreate = async (payload) => {
    await createItem(resource, payload)
    setModalMode(null)
    await load()
    onChanged?.()
  }

  const handleEdit = async (payload) => {
    await updateItem(resource, editingRow.id, payload)
    setModalMode(null)
    setEditingRow(null)
    await load()
    onChanged?.()
  }

  const handleDelete = async (row) => {
    if (!window.confirm(`¿Eliminar este registro de ${title.toLowerCase()}? Esta acción no se puede deshacer.`)) return
    try {
      await deleteItem(resource, row.id)
      await load()
      onChanged?.()
    } catch (e) {
      alert('No se pudo eliminar el registro.')
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
        <button className="btn btn-primary" onClick={() => setModalMode('create')}>+ Agregar</button>
      </div>

      {err && <div className="form-error">{err}</div>}
      {loading ? (
        <p className="muted">Cargando…</p>
      ) : rows.length === 0 ? (
        <p className="muted">{emptyLabel || 'Sin registros todavía.'}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                <th className="col-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  {columns.map((c) => (
                    <td key={c.key}>{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>
                  ))}
                  <td className="col-actions">
                    <button className="btn btn-small" onClick={() => { setEditingRow(row); setModalMode('edit') }}>Editar</button>
                    <button className="btn btn-small btn-danger" onClick={() => handleDelete(row)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalMode === 'create' && (
        <Modal title={`Agregar ${title.toLowerCase()}`} onClose={() => setModalMode(null)}>
          <RecordForm fields={fields} onSubmit={handleCreate} onCancel={() => setModalMode(null)} submitLabel="Agregar" />
        </Modal>
      )}
      {modalMode === 'edit' && editingRow && (
        <Modal title={`Editar ${title.toLowerCase()}`} onClose={() => { setModalMode(null); setEditingRow(null) }}>
          <RecordForm
            fields={fields}
            initialValues={editingRow}
            onSubmit={handleEdit}
            onCancel={() => { setModalMode(null); setEditingRow(null) }}
            submitLabel="Guardar cambios"
          />
        </Modal>
      )}
    </div>
  )
}