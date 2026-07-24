from django.db import models


class Marca(models.Model):
    """Tabla 1: fabricante del auto deportivo."""
    nombre = models.CharField(max_length=80, unique=True)
    pais_origen = models.CharField(max_length=60)
    anio_fundacion = models.IntegerField(help_text="Año en que se fundó la marca")

    class Meta:
        db_table = 'garage_marca'
        ordering = ['nombre']
        verbose_name = 'Marca'
        verbose_name_plural = 'Marcas'

    def __str__(self):
        return self.nombre


class Propietario(models.Model):
    """Tabla 2: dueño/coleccionista al que pertenece el auto."""
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    ciudad = models.CharField(max_length=80, blank=True)

    class Meta:
        db_table = 'garage_propietario'
        ordering = ['nombre']
        verbose_name = 'Propietario'
        verbose_name_plural = 'Propietarios'

    def __str__(self):
        return self.nombre


class AutoDeportivo(models.Model):
    """Tabla 3: auto de la colección, relacionado con Marca y Propietario (FK)."""

    class Categoria(models.TextChoices):
        SUPERDEPORTIVO = 'SUP', 'Superdeportivo'
        GRAN_TURISMO = 'GT', 'Gran Turismo'
        CLASICO = 'CLA', 'Clásico'
        HYPERCAR = 'HYP', 'Hypercar'

    marca = models.ForeignKey(
        Marca, on_delete=models.CASCADE, related_name='autos'
    )
    propietario = models.ForeignKey(
        Propietario, on_delete=models.SET_NULL, related_name='autos',
        null=True, blank=True,
    )
    modelo = models.CharField(max_length=100)
    anio = models.IntegerField(help_text="Año del modelo")
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_adquisicion = models.DateField()
    color = models.CharField(max_length=40)
    categoria = models.CharField(
        max_length=3, choices=Categoria.choices, default=Categoria.SUPERDEPORTIVO
    )
    imagen_url = models.URLField(blank=True, null=True)
    notas = models.TextField(blank=True)

    class Meta:
        db_table = 'garage_autodeportivo'
        ordering = ['-fecha_adquisicion']
        verbose_name = 'Auto deportivo'
        verbose_name_plural = 'Autos deportivos'

    def __str__(self):
        return f"{self.marca.nombre} {self.modelo} ({self.anio})"


class Mantenimiento(models.Model):
    """Tabla 4: historial de servicios/mantenimiento de un auto (FK a AutoDeportivo)."""

    class TipoServicio(models.TextChoices):
        AFINACION = 'AFI', 'Afinación'
        CAMBIO_ACEITE = 'ACE', 'Cambio de aceite'
        FRENOS = 'FRE', 'Frenos'
        CARROCERIA = 'CAR', 'Carrocería / pintura'
        REVISION = 'REV', 'Revisión general'
        OTRO = 'OTR', 'Otro'

    auto = models.ForeignKey(
        AutoDeportivo, on_delete=models.CASCADE, related_name='mantenimientos'
    )
    fecha_servicio = models.DateField()
    tipo_servicio = models.CharField(
        max_length=3, choices=TipoServicio.choices, default=TipoServicio.REVISION
    )
    costo = models.DecimalField(max_digits=10, decimal_places=2)
    taller = models.CharField(max_length=100)
    notas = models.TextField(blank=True)

    class Meta:
        db_table = 'garage_mantenimiento'
        ordering = ['-fecha_servicio']
        verbose_name = 'Mantenimiento'
        verbose_name_plural = 'Mantenimientos'

    def __str__(self):
        return f"{self.auto} — {self.get_tipo_servicio_display()} ({self.fecha_servicio})"