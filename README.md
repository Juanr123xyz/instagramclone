# 📱 Clon de Instagram (Evaluación Parcial V2)

Un clon funcional y robusto estilo Instagram desarrollado en **React Native + TypeScript + Expo**, diseñado priorizando la ingeniería de cliente, arquitectura limpia, rendimiento a 60 FPS, almacenamiento Offline-First y comunicación en tiempo real.

---

## 🚀 Módulos Obligatorios Implementados

### 1. Feed Principal y Sistema de Publicaciones
- **Barra de navegación inferior persistente**: Cada pestaña tiene su propio Stack Navigator independiente.
- **Acciones Core**: Likes instantáneos, comentarios anidados en tiempo real, creación de publicaciones e intercambio de enlaces.
- **Privacidad de Cuentas**: Gestión de perfiles públicos y privados. En cuentas privadas, el acceso al contenido requiere solicitud y aprobación formal (`FollowRequest`).

### 2. Motor de Caché de Imágenes y Rendimiento (60 FPS)
- **Caché Propietaria de 2 Niveles**: Nivel 1 en Memoria RAM (`LRUCache.ts`) con política de desalojo **LRU (Least Recently Used)** y Nivel 2 en Disco Local (`ImageCacheManager.ts`). Sin librerías automáticas opacas.
- **Cancelación en Viewport**: Cancelación automática de peticiones con `AbortController` cuando una celda sale del viewport (`onViewableItemsChanged`), previniendo Memory Leaks y errores de OutOfMemory (OOM).

### 3. UI Optimista y Arquitectura Offline-First
- **Acciones Instantáneas**: Latencia percibida de 0 ms en likes y comentarios.
- **Cola de Sincronización en Background**: Encapsulamiento de peticiones en SQLite local (`LocalDatabase.ts`). Al perder la conexión a internet, las acciones se almacenan y se procesan secuencialmente en segundo plano al restablecer la conectividad.

### 4. Mensajería Directa (DMs) en Tiempo Real
- **Comunicación Bidireccional**: Integración con canal de WebSockets (`WebSocketService.ts`).
- **Indicadores Avanzados**: Sincronización de eventos de typing ("Escribiendo..."), confirmación de visto ("✓✓ Visto") y reordenamiento automático de la bandeja de entrada según cronología.

### 5. Navegación Anidada, Deep Linking e Historias
- **Navegación por Pestañas Independientes**: Cada sección (Home, Explorar, Actividad, Perfil) posee su propia pila de navegación.
- **Deep Linking Profundo**: Soporte para esquemas de URL `instagramclone://post/{uuid}`.
- **Historias Efímeras 24h**: Visualización horizontal con barras de progreso, avance automático, pausa táctil interactiva (`onPressIn` / `onPressOut`) y estado "visto" persistido localmente.

---

## 🛠️ Ejecución del Proyecto

### Requisitos previos
- Node.js (v18+)
- npm / yarn

### Pasos de ejecución
```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo de Expo
npm start

# 3. Probar en Web, Android o iOS
npm run web
```

---

## 📄 Guía de Defensa Técnica
Para revisar la preparación técnica de las **5 preguntas aleatorias** de la evaluación presencial, consulta el documento adjunto:
👉 [DEFENSA_TECNICA.md](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/instagram-clone-mobile/DEFENSA_TECNICA.md)
