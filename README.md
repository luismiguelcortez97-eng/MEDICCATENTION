# Consultorio Médico CC

Sistema de gestión para consultorios médicos y servicios de laboratorio.

## Cómo ejecutarlo (Windows)

1. Extraiga el archivo ZIP en cualquier carpeta.
2. Abra **PowerShell** o **CMD** dentro de la carpeta del programa.
3. Ejecute:

```bash
python -m http.server 8080
```

4. Abra su navegador y vaya a:

```
http://localhost:8080
```

> **Requisito:** Python 3 instalado (viene preinstalado en la mayoría de Windows 10/11 o se descarga de python.org).

### Alternativa sin Python
Puede abrir el archivo `index.html` directamente haciendo doble clic.  
**Nota:** Algunas funciones de IndexedDB funcionan mejor con un servidor local.

## Credenciales de acceso

| Usuario | Contraseña |
|---------|------------|
| `admin` | `cc2024`  |

## Códigos de protección financiera

| Módulo                | Código   |
|-----------------------|----------|
| Cobros y Laboratorios | `202503` |
| Balance general       | `1973`   |

## Módulos incluidos

- **Médicos** – Registro con especialidad, cédulas, domicilio y teléfono
- **Pacientes y expedientes** – Vinculados a un médico
- **Consultas médicas** – Motivo, interrogatorio, cuadro clínico, exploración, tratamiento + signos vitales obligatorios
- **Medicamentos** – Catálogo + prescripción (dosis, vía, frecuencia, duración)
- **Estudios de laboratorio** – Catálogo + inclusión en indicaciones
- **Cobros del día** – Con auditoría de modificaciones (protegido por NIP)
- **Balance general** – Desglose por médico + impresión (protegido por código)
- **Respaldos** – Exportar / Importar todos los datos en JSON

## Documentos generables

- Receta médica / Hoja de indicaciones (impresión directa del navegador)
- Reporte financiero de balance
- Respaldo completo en JSON

## Tecnología

- HTML5 + CSS3 + JavaScript (vanilla)
- IndexedDB (almacenamiento local en el navegador)
- Sin dependencias externas (funciona offline una vez cargado)

## Importante

- Este es un **sistema de gestión local**. No sustituye el criterio médico ni es una certificación normativa.
- Las recetas y documentos deben ser revisados por el profesional responsable.
- Realice respaldos JSON de forma periódica. Los datos se guardan solo en este navegador/equipo.
- Los códigos NIP son controles de interfaz, no seguridad de servidor.

---

**Consultorio Médico CC** · Gracias por confiarnos tu salud.
