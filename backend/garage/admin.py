from django.contrib import admin
from .models import Marca, Propietario, AutoDeportivo, Mantenimiento


@admin.register(Marca)
class MarcaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'pais_origen', 'anio_fundacion']
    search_fields = ['nombre', 'pais_origen']


@admin.register(Propietario)
class PropietarioAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'telefono', 'email', 'ciudad']
    search_fields = ['nombre', 'ciudad', 'email']


@admin.register(AutoDeportivo)
class AutoDeportivoAdmin(admin.ModelAdmin):
    list_display = ['modelo', 'marca', 'propietario', 'anio', 'precio', 'categoria', 'fecha_adquisicion']
    list_filter = ['categoria', 'marca']
    search_fields = ['modelo', 'marca__nombre']


@admin.register(Mantenimiento)
class MantenimientoAdmin(admin.ModelAdmin):
    list_display = ['auto', 'tipo_servicio', 'fecha_servicio', 'costo', 'taller']
    list_filter = ['tipo_servicio']
    search_fields = ['taller', 'auto__modelo']