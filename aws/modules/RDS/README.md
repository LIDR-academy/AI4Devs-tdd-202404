# RDS Module

Este módulo provisiona una instancia de AWS RDS.

## Uso


## Entradas

| Nombre         | Descripción                       | Tipo   | Requerido |
|----------------|-----------------------------------|--------|-----------|
| instance_class | El tipo de instancia para la RDS. | string | Sí        |
| environment    | El entorno de despliegue.         | string | Sí        |

## Salidas

| Nombre             | Descripción                          |
|--------------------|--------------------------------------|
| db_instance_endpoint | El endpoint de la instancia RDS.    |
| db_instance_id     | El ID de la instancia RDS.           |
