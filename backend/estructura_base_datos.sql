-- Estructura de referencia de la base de datos "coleccion_autos"
-- Django genera estas tablas automaticamente con:
--   python manage.py makemigrations
--   python manage.py migrate
-- Este script se incluye solo como documentacion de la estructura relacional.

CREATE DATABASE IF NOT EXISTS coleccion_autos
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE coleccion_autos;

-- Tabla 1: Marca
CREATE TABLE garage_marca (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    nombre          VARCHAR(80)  NOT NULL UNIQUE,
    pais_origen     VARCHAR(60)  NOT NULL,
    anio_fundacion  INT          NOT NULL
);

-- Tabla 2: AutoDeportivo (relacionada con Marca mediante FK)
CREATE TABLE garage_autodeportivo (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    marca_id            INT            NOT NULL,
    modelo              VARCHAR(100)   NOT NULL,
    anio                INT            NOT NULL,
    precio              DECIMAL(12,2)  NOT NULL,
    fecha_adquisicion   DATE           NOT NULL,
    color               VARCHAR(40)    NOT NULL,
    categoria           VARCHAR(3)     NOT NULL DEFAULT 'SUP',
    imagen_url          VARCHAR(200),
    notas               TEXT,
    CONSTRAINT fk_auto_marca FOREIGN KEY (marca_id)
        REFERENCES garage_marca(id) ON DELETE CASCADE
);

-- Tipos de datos usados: VARCHAR, INT, DECIMAL, DATE, TEXT (5 tipos distintos)
