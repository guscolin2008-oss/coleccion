import { useState } from 'react'

export default function RecordForm({ fields, initialValues, onSubmit, onCancel, submitLabel = 'Guardar' }) {
  const [values, setValues] = useState(() => {
    const base = {}
    fields.forEach((f) => {
      base[f.name] = initialValues?.[f.name] ?? (f.type === 'select' ? '' : '')
    })
    return base
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = {}
      fields.forEach((f) => {
        let v = values[f.name]
        if ((f.type === 'number' || (f.type === 'select' && f.numeric)) && v !== '') v = Number(v)
        if (f.optional && v === '') v = null
        payload[f.name] = v
      })
      await onSubmit(payload)
    } catch (err) {
      const data = err?.response?.data
      if (data && typeof data === 'object') {
        const msg = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')
        setError(msg || 'No se pudo guardar el registro.')
      } else {
        setError('No se pudo guardar el registro. Verifica los datos e intenta de nuevo.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="record-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      <div className="form-grid">
        {fields.map((f) => (
          <label key={f.name} className={`form-field ${f.wide ? 'wide' : ''}`}>
            <span>{f.label}{f.required && <span className="req">*</span>}</span>
            {f.type === 'select' ? (
              <select
                required={f.required}
                value={values[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
              >
                <option value="">{f.placeholder || 'Selecciona…'}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea
                rows={3}
                value={values[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                placeholder={f.placeholder}
              />
            ) : (
              <input
                type={f.type || 'text'}
                required={f.required}
                step={f.step}
                min={f.min}
                max={f.max}
                value={values[f.name] ?? ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                placeholder={f.placeholder}
              />
            )}
          </label>
        ))}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando…' : submitLabel}</button>
      </div>
    </form>
  )
}