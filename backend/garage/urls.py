from rest_framework.routers import DefaultRouter
from .views import (
    MarcaViewSet, PropietarioViewSet, AutoDeportivoViewSet, MantenimientoViewSet,
    ConsultaViewSet,
)

router = DefaultRouter()
router.register(r'marcas', MarcaViewSet, basename='marca')
router.register(r'propietarios', PropietarioViewSet, basename='propietario')
router.register(r'autos', AutoDeportivoViewSet, basename='auto')
router.register(r'mantenimientos', MantenimientoViewSet, basename='mantenimiento')
router.register(r'consulta', ConsultaViewSet, basename='consulta')

urlpatterns = router.urls