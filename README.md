# Sistema de Gestión de Estrategias de Respaldo Oracle

## Objetivo General

Diseñar e implementar un software full-stack con interfaz gráfica (GUI) que permita a los administradores de bases de datos (DBAs) crear, programar, ejecutar y monitorear estrategias de respaldo de bases de datos Oracle. El sistema busca automatizar completamente el ciclo de vida del respaldo, garantizando la personalización, la trazabilidad y la notificación automática de eventos importantes o errores.

## Descripción General del Sistema

El sistema centraliza la gestión de las operaciones críticas de respaldo. Permite al DBA definir estrategias flexibles, detallando el tipo de respaldo (completo, parcial, incremental), la prioridad de los objetos y el calendario de ejecución.

Utiliza Oracle Scheduler para la programación automática y RMAN para la ejecución de los comandos de respaldo. Toda la actividad se registra en una bitácora centralizada, y se utiliza un servicio SMTP configurable para notificar al equipo en tiempo real sobre el éxito o el fracaso de las tareas.

### Tipos de Estrategias Soportadas:

- **Completo**: Copia total de la base de datos.
- **Parcial**: Selección manual de tablas o esquemas específicos.
- **Incremental**: Copia solo de los cambios realizados desde el último respaldo.
- **Personalizado**: Otros modos avanzados definidos por el usuario.

## Funciones Principales

### 1. Diseño y Catálogo de Estrategias
- Interfaz gráfica intuitiva para la creación, edición y catalogación de estrategias.
- Asignación de prioridad o criticidad a cada estrategia.
- Validación y advertencia sobre el modo ARCHIVELOG del servidor Oracle.

### 2. Ejecución Automatizada y RMAN
- Integración directa con Oracle Scheduler para calendarización.
- Configuración granular de la frecuencia (diaria, semanal, mensual, por ciclo) y hora exacta de ejecución.
- Ejecución automática de comandos RMAN generados a partir de la estrategia definida.

### 3. Bitácora, Evidencias y Auditoría
- Generación automática de un registro detallado por cada ejecución (fecha, duración, tipo, resultado).
- Almacenamiento de las bitácoras en una base de datos interna (LOGS_BACKUP).
- Exportación de logs a formatos PDF o CSV para fines de auditoría.

### 4. Notificaciones y Alertas
- Envío de correos electrónicos automático mediante SMTP configurable.
- Alerta por fallo, interrupción o finalización exitosa del respaldo.
- Registro histórico de todas las notificaciones enviadas.

### 5. Gestión de Configuración del Servidor
- Panel para configurar credenciales y parámetros de conexión de la base de datos Oracle.
- Visualización y advertencias sobre el estado del modo ARCHIVELOG.

## Requerimientos del Sistema

### Requerimientos Funcionales

| Código | Descripción |
|--------|-------------|
| RF01 | Permitir al usuario definir estrategias de respaldo personalizadas. |
| RF02 | Permitir seleccionar tipo de respaldo: completo, parcial, incremental. |
| RF03 | Asignar prioridad a cada respaldo. |
| RF04 | Permitir seleccionar tablas/esquemas específicos en respaldos parciales. |
| RF05 | Configurar tareas programadas mediante Oracle Scheduler. |
| RF06 | Generar bitácora automática con evidencias de ejecución. |
| RF07 | Enviar correo de notificación ante fallos o finalización. |
| RF08 | Verificar y activar modo ARCHIVELOG de Oracle (si es posible). |
| RF09 | Mostrar advertencia si el modo ARCHIVELOG no está habilitado. |

### Requerimientos No Funcionales

| Tipo | Descripción |
|------|-------------|
| Rendimiento | El sistema debe ejecutar tareas programadas sin intervención manual. |
| Usabilidad | Interfaz clara y moderna, con asistentes ("wizards") para configurar estrategias. |
| Fiabilidad | Debe garantizar el registro y la notificación ante cualquier error de ejecución. |
| Portabilidad | Compatible con sistemas operativos Windows y Linux. |
| Seguridad | Uso de autenticación para acceso y cifrado de contraseñas de conexión a Oracle. |

## Arquitectura y Tecnología

El proyecto sigue una arquitectura Cliente-Servidor (Full Stack), dividida en un frontend SPA (Single Page Application) y un backend dedicado a la lógica de negocio y la orquestación de RMAN.

### Backend (Lógica y Servicios)

El backend es la capa de orquestación, responsable de la comunicación con Oracle, la gestión del scheduler y el envío de notificaciones.

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| Lenguaje/Framework | Python (FastAPI) | Desarrollo rápido de API RESTful, scripts de automatización RMAN/Shell, y tareas cron-like. |
| Arquitectura | Arquitectura en Capas / Clean Architecture | Separación clara de la API, Lógica (Service) y Acceso a Datos (Repository). |
| Base de Datos | Tabla interna LOGS_BACKUP (en una DB auxiliar o en la propia Oracle) | Almacenamiento de registros y bitácoras. |
| Automatización | Oracle Scheduler + RMAN | Programación y ejecución de respaldos. |

### Frontend (Interfaz de Usuario)

El frontend proporciona una interfaz moderna y reactiva para la configuración y el monitoreo.

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| Framework | React.js | Construcción de una interfaz de usuario modular, interactiva y con gestión de estado avanzada. |
| Arquitectura | Arquitectura modular / basada en componentes | Organización del código en componentes reutilizables (components/), pantallas (pages/) y estado global (context/). |

### Base de Datos de Destino

- **Servidor**: Oracle 19c o superior.
