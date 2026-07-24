from rest_framework import serializers
from .models import Marca, Propietario, AutoDeportivo, Mantenimiento


class MarcaSerializer(serializers.ModelSerializer):
    total_autos = serializers.IntegerField(source='autos.count', read_only=True)

    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'pais_origen', 'anio_fundacion', 'total_autos']


class PropietarioSerializer(serializers.ModelSerializer):
    total_autos = serializers.IntegerField(source='autos.count', read_only=True)

    class Meta:
        model = Propietario
        fields = ['id', 'nombre', 'telefono', 'email', 'ciudad', 'total_autos']


class AutoDeportivoSerializer(serializers.ModelSerializer):
    marca_nombre = serializers.CharField(source='marca.nombre', read_only=True)
    propietario_nombre = serializers.CharField(
        source='propietario.nombre', read_only=True, default=None
    )
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)
    total_mantenimientos = serializers.IntegerField(source='mantenimientos.count', read_only=True)

    class Meta:
        model = AutoDeportivo
        fields = [
            'id', 'marca', 'marca_nombre', 'propietario', 'propietario_nombre',
            'modelo', 'anio', 'precio', 'fecha_adquisicion', 'color', 'categoria',
            'categoria_display', 'imagen_url', 'notas', 'total_mantenimientos',
        ]


class MantenimientoSerializer(serializers.ModelSerializer):
    auto_descripcion = serializers.CharField(source='auto.__str__', read_only=True)
    tipo_servicio_display = serializers.CharField(source='get_tipo_servicio_display', read_only=True)

    class Meta:
        model = Mantenimiento
        fields = [
            'id', 'auto', 'auto_descripcion', 'fecha_servicio', 'tipo_servicio',
            'tipo_servicio_display', 'costo', 'taller', 'notas',
        ]


# ---------------------------------------------------------------------------
# Consulta general: une las 4 tablas (marca, propietario, auto, mantenimiento)
# en una sola vista de solo lectura, pensada para la sección "Consulta" del
# dashboard.
# ---------------------------------------------------------------------------

class MantenimientoAnidadoSerializer(serializers.ModelSerializer):
    """Version reducida de Mantenimiento para anidar dentro de la consulta."""
    tipo_servicio_display = serializers.CharField(source='get_tipo_servicio_display', read_only=True)

    class Meta:
        model = Mantenimiento
        fields = [
            'id', 'fecha_servicio', 'tipo_servicio', 'tipo_servicio_display',
            'costo', 'taller', 'notas',
        ]


class MarcaAnidadaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = ['id', 'nombre', 'pais_origen', 'anio_fundacion']


class PropietarioAnidadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propietario
        fields = ['id', 'nombre', 'telefono', 'email', 'ciudad']


class ConsultaAutoSerializer(serializers.ModelSerializer):
    """
    Serializer de la consulta relacionada: por cada auto muestra su marca
    completa, su propietario completo y el listado de mantenimientos, además
    de un par de totales calculados (join lógico de las 4 tablas).
    """
    marca = MarcaAnidadaSerializer(read_only=True)
    propietario = PropietarioAnidadoSerializer(read_only=True)
    categoria_display = serializers.CharField(source='get_categoria_display', read_only=True)
    mantenimientos = MantenimientoAnidadoSerializer(many=True, read_only=True)
    total_mantenimientos = serializers.SerializerMethodField()
    costo_total_mantenimiento = serializers.SerializerMethodField()
    costo_total_propiedad = serializers.SerializerMethodField()

    class Meta:
        model = AutoDeportivo
        fields = [
            'id', 'modelo', 'anio', 'precio', 'fecha_adquisicion', 'color',
            'categoria', 'categoria_display', 'imagen_url', 'notas',
            'marca', 'propietario', 'mantenimientos',
            'total_mantenimientos', 'costo_total_mantenimiento', 'costo_total_propiedad',
        ]

    def get_total_mantenimientos(self, obj):
        return obj.mantenimientos.count()

    def get_costo_total_mantenimiento(self, obj):
        total = sum((m.costo for m in obj.mantenimientos.all()), start=0)
        return total

    def get_costo_total_propiedad(self, obj):
        total_mant = sum((m.costo for m in obj.mantenimientos.all()), start=0)
        return obj.precio + total_mant