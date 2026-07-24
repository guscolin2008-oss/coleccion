from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Marca, Propietario, AutoDeportivo, Mantenimiento
from .serializers import (
    MarcaSerializer, PropietarioSerializer,
    AutoDeportivoSerializer, MantenimientoSerializer,
    ConsultaAutoSerializer,
)


class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'pais_origen']


class PropietarioViewSet(viewsets.ModelViewSet):
    queryset = Propietario.objects.all()
    serializer_class = PropietarioSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'ciudad', 'email']


class AutoDeportivoViewSet(viewsets.ModelViewSet):
    queryset = AutoDeportivo.objects.select_related('marca', 'propietario').all()
    serializer_class = AutoDeportivoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['marca', 'propietario', 'categoria']
    search_fields = ['modelo', 'marca__nombre', 'color']
    ordering_fields = ['anio', 'precio', 'fecha_adquisicion']


class MantenimientoViewSet(viewsets.ModelViewSet):
    queryset = Mantenimiento.objects.select_related('auto', 'auto__marca').all()
    serializer_class = MantenimientoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['auto', 'tipo_servicio']
    search_fields = ['taller', 'auto__modelo']
    ordering_fields = ['fecha_servicio', 'costo']


class ConsultaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Consulta relacionada de las 4 tablas: por cada auto se incluye su marca,
    su propietario y su historial completo de mantenimientos, con totales
    calculados. Solo lectura (GET) — pensada para la sección "Consulta".
    """
    queryset = (
        AutoDeportivo.objects
        .select_related('marca', 'propietario')
        .prefetch_related('mantenimientos')
        .all()
    )
    serializer_class = ConsultaAutoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'marca': ['exact'],
        'propietario': ['exact'],
        'categoria': ['exact'],
        'propietario__ciudad': ['icontains'],
    }
    search_fields = ['modelo', 'marca__nombre', 'propietario__nombre', 'color']
    ordering_fields = ['anio', 'precio', 'fecha_adquisicion']