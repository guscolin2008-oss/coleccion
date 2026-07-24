from django.core.management.base import BaseCommand
from garage.models import Marca, Propietario, AutoDeportivo, Mantenimiento
import datetime


class Command(BaseCommand):
    help = "Carga datos de ejemplo para la colección de autos deportivos."

    def handle(self, *args, **options):
        marcas_data = [
            {"nombre": "Ferrari", "pais_origen": "Italia", "anio_fundacion": 1947},
            {"nombre": "Porsche", "pais_origen": "Alemania", "anio_fundacion": 1931},
            {"nombre": "Lamborghini", "pais_origen": "Italia", "anio_fundacion": 1963},
            {"nombre": "McLaren", "pais_origen": "Reino Unido", "anio_fundacion": 1963},
        ]
        marcas = {}
        for m in marcas_data:
            obj, _ = Marca.objects.get_or_create(nombre=m["nombre"], defaults=m)
            marcas[m["nombre"]] = obj

        propietarios_data = [
            {"nombre": "Gustavo Contreras", "telefono": "55-1234-5678",
             "email": "gustavo@example.com", "ciudad": "Ciudad de México"},
            {"nombre": "Redline Collector Group", "telefono": "55-8765-4321",
             "email": "contacto@redline.com", "ciudad": "Guadalajara"},
        ]
        propietarios = {}
        for p in propietarios_data:
            obj, _ = Propietario.objects.get_or_create(nombre=p["nombre"], defaults=p)
            propietarios[p["nombre"]] = obj

        autos_data = [
            dict(marca=marcas["Ferrari"], propietario=propietarios["Gustavo Contreras"],
                 modelo="488 GTB", anio=2019, precio=265000,
                 fecha_adquisicion=datetime.date(2022, 3, 15), color="Rojo Corsa",
                 categoria="SUP"),
            dict(marca=marcas["Porsche"], propietario=propietarios["Gustavo Contreras"],
                 modelo="911 Turbo S", anio=2021, precio=230000,
                 fecha_adquisicion=datetime.date(2023, 6, 1), color="Gris GT",
                 categoria="GT"),
            dict(marca=marcas["Lamborghini"], propietario=propietarios["Redline Collector Group"],
                 modelo="Huracán EVO", anio=2020, precio=280000,
                 fecha_adquisicion=datetime.date(2021, 11, 20), color="Verde Mantis",
                 categoria="SUP"),
            dict(marca=marcas["McLaren"], propietario=propietarios["Redline Collector Group"],
                 modelo="720S", anio=2022, precio=310000,
                 fecha_adquisicion=datetime.date(2024, 1, 10), color="Naranja Papaya",
                 categoria="HYP"),
        ]
        autos = {}
        for a in autos_data:
            obj, _ = AutoDeportivo.objects.get_or_create(
                marca=a["marca"], modelo=a["modelo"], anio=a["anio"], defaults=a
            )
            autos[a["modelo"]] = obj

        mantenimientos_data = [
            dict(auto=autos["488 GTB"], fecha_servicio=datetime.date(2023, 4, 10),
                 tipo_servicio="ACE", costo=4500, taller="Ferrari CDMX",
                 notas="Cambio de aceite y filtros de rutina."),
            dict(auto=autos["911 Turbo S"], fecha_servicio=datetime.date(2024, 1, 5),
                 tipo_servicio="FRE", costo=12000, taller="Porsche Center Guadalajara",
                 notas="Cambio de discos y balatas delanteras."),
            dict(auto=autos["Huracán EVO"], fecha_servicio=datetime.date(2022, 8, 20),
                 tipo_servicio="REV", costo=8000, taller="Lambo Service MX",
                 notas="Revisión general de 20,000 km."),
        ]
        for m in mantenimientos_data:
            Mantenimiento.objects.get_or_create(
                auto=m["auto"], fecha_servicio=m["fecha_servicio"],
                tipo_servicio=m["tipo_servicio"], defaults=m,
            )

        self.stdout.write(self.style.SUCCESS(
            f"Listo: {Marca.objects.count()} marcas, {Propietario.objects.count()} propietarios, "
            f"{AutoDeportivo.objects.count()} autos y {Mantenimiento.objects.count()} mantenimientos cargados."
        ))
