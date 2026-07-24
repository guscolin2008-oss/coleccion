import { useCallback, useEffect, useState } from 'react'
import { listAll } from '../api'
import DataTable from '../components/DataTable'
import { CATEGORIAS, TIPOS_SERVICIO, money } from '../constants'

const TABS = [
  { key: 'marcas', label: 'Marcas' },
  { key: 'propietarios', label: 'Propietarios' },
  { key: 'autos', label: 'Autos' },
  { key: 'mantenimientos', label: 'Mantenimientos' },
]

export default function Dashboard() {
  const [tab, setTab] = useState('marcas')
  const [marcas, setMarcas] = useState([])
  const [propietarios, setPropietarios] = useState([])
  const [autos, setAutos] = useState([])

  const loadOptions = useCallback(async () => {
    const [m, p, a] = await Promise.all([
      listAll('marcas'), listAll('propietarios'), listAll('autos'),
    ])
    setMarcas(m); setPropietarios(p); setAutos(a)
  }, [])

  useEffect(() => { loadOptions() }, [loadOptions])

  const marcaOptions = marcas.map((m) => ({ value: m.id, label: m.nombre }))
  const propietarioOptions = propietarios.map((p) => ({ value: p.id, label: p.nombre }))
  const autoOptions = autos.map((a) => ({ value: a.id, label: `${a.marca_nombre ?? ''} ${a.modelo} (${a.anio})` }))

  return (
    <div>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'marcas' && (
        <DataTable
          resource="marcas"
          title="Marcas"
          onChanged={loadOptions}
          columns={[
            { key: 'nombre', label: 'Nombre' },
            { key: 'pais_origen', label: 'País de origen' },
            { key: 'anio_fundacion', label: 'Año de fundación' },
            { key: 'total_autos', label: 'Autos' },
          ]}
          fields={[
            { name: 'nombre', label: 'Nombre', required: true },
            { name: 'pais_origen', label: 'País de origen', required: true },
            { name: 'anio_fundacion', label: 'Año de fundación', type: 'number', required: true },
          ]}
        />
      )}

      {tab === 'propietarios' && (
        <DataTable
          resource="propietarios"
          title="Propietarios"
          onChanged={loadOptions}
          columns={[
            { key: 'nombre', label: 'Nombre' },
            { key: 'telefono', label: 'Teléfono' },
            { key: 'email', label: 'Email' },
            { key: 'ciudad', label: 'Ciudad' },
            { key: 'total_autos', label: 'Autos' },
          ]}
          fields={[
            { name: 'nombre', label: 'Nombre', required: true },
            { name: 'telefono', label: 'Teléfono' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'ciudad', label: 'Ciudad' },
          ]}
        />
      )}

      {tab === 'autos' && (
        <DataTable
          resource="autos"
          title="Autos deportivos"
          onChanged={loadOptions}
          columns={[
            { key: 'modelo', label: 'Modelo' },
            { key: 'marca_nombre', label: 'Marca' },
            { key: 'propietario_nombre', label: 'Propietario' },
            { key: 'anio', label: 'Año' },
            { key: 'precio', label: 'Precio', render: (r) => money(r.precio) },
            { key: 'fecha_adquisicion', label: 'Adquirido' },
            { key: 'categoria_display', label: 'Categoría' },
            { key: 'total_mantenimientos', label: 'Mant.' },
          ]}
          fields={[
            { name: 'marca', label: 'Marca', type: 'select', numeric: true, required: true, options: marcaOptions },
            { name: 'propietario', label: 'Propietario', type: 'select', numeric: true, optional: true, options: propietarioOptions, placeholder: 'Sin propietario' },
            { name: 'modelo', label: 'Modelo', required: true },
            { name: 'anio', label: 'Año', type: 'number', required: true },
            { name: 'precio', label: 'Precio (MXN)', type: 'number', step: '0.01', required: true },
            { name: 'fecha_adquisicion', label: 'Fecha de adquisición', type: 'date', required: true },
            { name: 'color', label: 'Color', required: true },
            { name: 'categoria', label: 'Categoría', type: 'select', required: true, options: CATEGORIAS },
            { name: 'imagen_url', label: 'URL de imagen', optional: true },
            { name: 'notas', label: 'Notas', type: 'textarea', optional: true, wide: true },
          ]}
        />
      )}

      {tab === 'mantenimientos' && (
        <DataTable
          resource="mantenimientos"
          title="Mantenimientos"
          onChanged={loadOptions}
          columns={[
            { key: 'auto_descripcion', label: 'Auto' },
            { key: 'fecha_servicio', label: 'Fecha' },
            { key: 'tipo_servicio_display', label: 'Tipo de servicio' },
            { key: 'costo', label: 'Costo', render: (r) => money(r.costo) },
            { key: 'taller', label: 'Taller' },
          ]}
          fields={[
            { name: 'auto', label: 'Auto', type: 'select', numeric: true, required: true, options: autoOptions },
            { name: 'fecha_servicio', label: 'Fecha de servicio', type: 'date', required: true },
            { name: 'tipo_servicio', label: 'Tipo de servicio', type: 'select', required: true, options: TIPOS_SERVICIO },
            { name: 'costo', label: 'Costo (MXN)', type: 'number', step: '0.01', required: true },
            { name: 'taller', label: 'Taller', required: true },
            { name: 'notas', label: 'Notas', type: 'textarea', optional: true, wide: true },
          ]}
        />
      )}
    </div>
  )
}