# Implementación de una interfaz de seguimiento de órdenes en tiempo real

El equipo de desarrollo necesita una funcionalidad que permita a los usuarios visualizar el estado de las órdenes en tiempo real. Para lograrlo, se utilizará Apache Kafka como sistema de mensajería. El sistema debe publicar eventos en un topic de Kafka y consumirlos para reflejar los cambios en la interfaz de usuario.

## Informacion General

| Campo | Valor |
|-------|-------|
| **Tema** | Consumo de eventos en tiempo real con Kafka |
| **Nivel** | advanced-l2 |
| **Tipo** | practical |
| **Tiempo estimado** | 8 horas |

## Fases del Reto

### Fase 0: Configuración del Proyecto

**Objetivo:** Obtener el proyecto base funcional enviando el Código Base a un asistente de IA, que lo analizará, corregirá errores y entregará cada archivo con su ruta.

**Tiempo estimado:** 15-30 minutos

**Instrucciones:**

- Asegúrate de tener instalado para ejecutar el proyecto: Node.js 18+, npm, VS Code o similar.
- Copia todo el contenido del campo **Código Base** de este reto — incluyendo el texto de instrucciones que aparece al inicio.
- Abre un asistente de IA (Claude en claude.ai, ChatGPT o Gemini — se recomienda Claude), pega el contenido copiado en el chat y envíalo.
- El asistente analizará los archivos, corregirá errores y entregará cada archivo con su ruta. Guárdalos en la carpeta donde quieras trabajar, respetando las rutas.
- Ejecuta `npm install && npm run build` (o `npm start`). Si no hay errores, estás listo.

**Entregable:** El proyecto compila/arranca sin errores.

<details>
<summary>Pistas de conocimiento</summary>

- Copia el Código Base completo incluyendo el texto de instrucciones al inicio — esas instrucciones le indican al asistente exactamente qué hacer con los archivos.
- Si el asistente no entrega todos los archivos al terminar el análisis, escríbele: "entrégame todos los archivos con su ruta".
- Si el proyecto tiene errores al arrancar, comparte el mensaje de error con el mismo asistente para que lo corrija.

</details>

### Fase 1: Configuración del entorno de Kafka

**Objetivo:** Preparar el entorno para la publicación y consumo de eventos en Kafka.

**Tiempo estimado:** 2 horas

**Instrucciones:**

- Configurar un broker de Kafka y crear un topic para las órdenes.
- Verificar que el broker esté funcionando correctamente y que el topic se haya creado.

**Entregable:** Entorno de Kafka configurado y topic de órdenes creado.

<details>
<summary>Pistas de conocimiento</summary>

- Configuración básica de Kafka.
- Creación y verificación de topics en Kafka.

</details>

### Fase 2: Publicación de eventos en Kafka

**Objetivo:** Implementar la funcionalidad para publicar eventos de órdenes en el topic de Kafka.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Desarrollar un servicio que publique eventos de órdenes en el topic de Kafka.
- Asegurar que los eventos se publiquen correctamente y se puedan consumir.

**Entregable:** Servicio que publica eventos de órdenes en Kafka.

<details>
<summary>Pistas de conocimiento</summary>

- Uso de la API de Kafka para publicar mensajes.
- Manejo de errores en la publicación de mensajes.

</details>

### Fase 3: Consumo de eventos y actualización de la interfaz

**Objetivo:** Consumir eventos de Kafka y reflejar los cambios en la interfaz de usuario en tiempo real.

**Tiempo estimado:** 3 horas

**Instrucciones:**

- Desarrollar un consumidor de eventos de Kafka que actualice la interfaz de usuario con el estado de las órdenes.
- Asegurar que los cambios se reflejen en tiempo real y manejar posibles errores de consumo.

**Entregable:** Consumidor de eventos de Kafka que actualiza la interfaz de usuario.

<details>
<summary>Pistas de conocimiento</summary>

- Uso de la API de Kafka para consumir mensajes.
- Actualización de la interfaz de usuario en tiempo real.

</details>

## Dimensiones Evaluadas

- **queEs**: ¿Qué es Apache Kafka y cómo se utiliza en este reto?
- **comoSeUsa**: ¿Cómo se publican y consumen eventos en Kafka en este escenario?
- **erroresComunes**: ¿Qué errores comunes pueden ocurrir al publicar y consumir eventos en Kafka y cómo se manejan?

## Criterios de Evaluacion

- Configuración correcta del entorno de Kafka.
- Publicación exitosa de eventos de órdenes en Kafka.
- Consumo de eventos de Kafka y actualización en tiempo real de la interfaz de usuario.
- Manejo de errores en la publicación y consumo de eventos.

## Como trabajar con un asistente de IA

Hay dos caminos, elegi uno:

- **AGENTS.md** (recomendado) — instrucciones nativas del repo. Abri esta carpeta con tu agente local (Claude Code, Cursor, Codex, Copilot, Gemini) y las carga solo. Sabe que archivos faltan y con que comando se verifica, y completa el scaffold escribiendo en disco.
- **PROMPT_MEJORA.md** — para copiar y pegar en un chat (claude.ai, ChatGPT) si no tenes un agente en el IDE. Declara lo mismo que AGENTS.md; los archivos que te devuelva el chat los guardas en esta carpeta respetando las rutas.

Ninguno de los dos resuelve las fases del reto: eso es tu trabajo.

## Mapa de componentes

El repo tiene una carpeta por componente. Cada uno se instala y verifica dentro de la suya.

| Componente | Carpeta | Rol | Capa | Track | Tecnologias |
|---|---|---|---|---|---|
| `api` | `api/` | practice | server | Node | Apache Kafka |
| `client` | `client/` | chapter, support | client | Angular | Angular |
| `infra-local` | (raiz) | support | infra | Compose local | Apache Kafka |

## Orden de arranque

1. `docker compose up -d` (en la raiz) — levanta la infraestructura local.
2. `cd api && npm install && npm run build` — componente `api` (practice).
3. `cd client && npm install && npm run build` — componente `client` (chapter, support).

### Contratos entre componentes

- `api` expone http (api: http://localhost:3000):
  - `GET /api/orders/events`
  - `POST /api/orders/events`

## Verificacion

El proyecto esta listo para trabajar cuando este comando corre sin errores:

```bash
(cd api && npm install && npm run build) && (cd client && npm install && npm run build) && docker compose config -q
```

---

*Reto generado automaticamente por Challenge Generator - Pragma*
