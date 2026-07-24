export const CATEGORIAS = [
  { value: 'SUP', label: 'Superdeportivo' },
  { value: 'GT', label: 'Gran Turismo' },
  { value: 'CLA', label: 'Clásico' },
  { value: 'HYP', label: 'Hypercar' },
]

export const TIPOS_SERVICIO = [
  { value: 'AFI', label: 'Afinación' },
  { value: 'ACE', label: 'Cambio de aceite' },
  { value: 'FRE', label: 'Frenos' },
  { value: 'CAR', label: 'Carrocería / pintura' },
  { value: 'REV', label: 'Revisión general' },
  { value: 'OTR', label: 'Otro' },
]

export const money = (value) => {
  const n = Number(value)
  if (Number.isNaN(n)) return value
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 })
}