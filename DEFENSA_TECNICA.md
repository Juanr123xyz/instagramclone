# 📘 Guía Completa de Defensa Técnica y Arquitectura
## Evaluación Parcial de Desarrollo Móvil (V2): Instagram Clone

Este documento está diseñado específicamente para garantizar la calificación de **100% (Respondió Perfecto)** en la sesión de defensa técnica y preguntas aleatorias del parcial.

---

### 🧱 Arquitectura General (Clean Architecture & Layering)
El proyecto implementa la arquitectura en capas con separación estricta de responsabilidades:
- **Presentation Layer (`src/screens`, `src/components`)**: Vistas puras en React Native con renderizado fluido a 60 FPS.
- **Domain & State Layer (`src/types`, `src/mock`)**: Definiciones de entidades como `Post`, `User`, `Comment`, `ChatMessage`, `Story` y `FollowRequest`.
- **Data & Storage Layer (`src/database`, `src/cache`)**: Base de datos local embebida (SQLite) y Motor de Caché LRU de 2 niveles.
- **Infrastructure & Sync (`src/offline`, `src/realtime`)**: Monitor de red, cola de sincronización en segundo plano con tolerancia a fallos y WebSockets en tiempo real.

---

## 🎯 Desglose de Preguntas Frecuentes de Evaluación Oral (Escala 100%)

---

### 1️⃣ PREGUNTA 1: Motor de Caché LRU de 2 Niveles y Rendimiento 60 FPS (Módulo 2)
**Pregunta:** *¿Cómo funciona internamente el motor de caché de imágenes propio, cómo implementa LRU (Least Recently Used) y cómo previene Memory Leaks y OutOfMemory (OOM) al scrollear a 60 FPS?*

**Respuesta Técnica (100% de Nota):**
> "Implementamos un motor de caché de dos niveles (`ImageCacheManager.ts`) sin depender de librerías automáticas opacas:
> 
> 1. **Nivel 1 (RAM):** La clase `LRUCache.ts` utiliza la estructura de datos `Map` de JavaScript. Aprovechamos que un `Map` mantiene el orden de inserción de las llaves. Cada vez que una imagen es leída mediante `.get(key)`, eliminamos la llave y la reinsertamos al final del `Map` para actualizar su frescura. Cuando la caché alcanza la capacidad máxima (MBs o ítems), el método `evictLeastRecentlyUsed()` elimina el primer elemento del `Map` (el menos recientemente usado).
> 2. **Nivel 2 (Disco Local):** Si la imagen no está en RAM, se busca en la memoria persistente del dispositivo. Si existe, se promueve al Nivel 1 en RAM.
> 3. **Cancelación en Viewport (60 FPS & Prevención OOM):** Para garantizar 60 FPS y evitar desbordamiento de memoria (OOM), el componente `DynamicImage.tsx` se conecta al evento `onViewableItemsChanged` del `FlatList`. Tan pronto como una celda se desplaza fuera de la pantalla (fuera del viewport), el `AbortController` asociado a la petición se aborta inmediatamente (`abortController.abort()`), cancelando la descarga de red en progreso y liberando de inmediato los buffers de memoria antes de que saturen el motor de JavaScript."

---

### 2️⃣ PREGUNTA 2: Arquitectura Offline-First y UI Optimista (Módulo 3)
**Pregunta:** *¿Cómo logras latencia percibida de 0 ms en acciones como dar Like o Comentar y cómo se procesa la cola cuando no hay conexión a internet?*

**Respuesta Técnica (100% de Nota):**
> "Aplicamos el patrón de **UI Optimista (Optimistic UI updates)** combinado con **Offline-First Storage**:
> 
> 1. **Latencia 0 ms:** Cuando el usuario presiona 'Like' o añade un comentario, la UI actualiza el estado local inmediatamente en el hilo principal sin esperar la respuesta del servidor.
> 2. **Cola en Background (SQLite):** En paralelo, la acción se encapsula como un objeto `OfflineSyncAction` con tipo, payload y `timestamp` cronológico, y se almacena de forma persistente en una tabla local de la base de datos embebida (`LocalDatabase.ts`).
> 3. **Procesamiento y Reconexión:** El servicio `NetworkMonitor.ts` escucha los cambios de conectividad del sistema operativo. Cuando la red se restablece, `OfflineSyncQueue.ts` despierta un worker en segundo plano que procesa la cola en riguroso orden cronológico (`ORDER BY timestamp ASC`).
> 4. **Resolución de Conflictos:** Si la acción falla o encuentra un conflicto (por ejemplo, el post fue eliminado en el servidor), la transacción maneja retribuciones exponenciales (máximo 3 reintentos) y en caso de fallo crítico realiza un rollback controlado de la UI para no corromper la base de datos remota ni la local."

---

### 3️⃣ PREGUNTA 3: Mensajería Directa en Tiempo Real y WebSockets (Módulo 4)
**Pregunta:** *¿Cómo se gestiona el envío/recepción bidireccional de DMs, la confirmación de visto y el indicador de "Escribiendo..."?*

**Respuesta Técnica (100% de Nota):**
> "La mensajería en tiempo real se estructura sobre `WebSocketService.ts` mediante comunicación bidireccional continua:
> 
> 1. **Indicadores de Estado ("Escribiendo..."):** Mientras el usuario tipea en el `TextInput`, se emite un evento ligero por el canal WebSocket `sendTypingEvent(chatId, true)`. En el cliente receptor, se activa el indicador visual en el encabezado del chat y se configura un temporizador de auto-limpieza (debounce timeout) para apagar el estado si el usuario deja de escribir.
> 2. **Confirmación de Entrega y Lectura ("Visto"):** Cada mensaje posee un ciclo de estados finito (`sending` ➔ `sent` ➔ `delivered` ➔ `read`). Cuando el destinatario recibe el frame en tiempo real, envía un ACK de vuelta por el WebSocket actualizando el estado visual a doble check '✓✓ Visto'.
> 3. **Reordenamiento Dinámico de la Bandeja:** En `DirectMessagesScreen.tsx`, al recibir un nuevo mensaje, el array de conversaciones se reordena dinámicamente según la marca de tiempo del último mensaje recibido (`lastMessage.timestamp`), manteniendo la bandeja de entrada siempre ordenada cronológicamente."

---

### 4️⃣ PREGUNTA 4: Privacidad de Cuentas y Seguridad de Contenido (Módulo 1)
**Pregunta:** *¿Cómo se aplican las reglas de privacidad para cuentas públicas vs privadas?*

**Respuesta Técnica (100% de Nota):**
> "La lógica de dominio en `ProfileScreen.tsx` y `ActivityScreen.tsx` valida el flag `isPrivate` y la relación `isFollowing`:
> 
> 1. **Perfiles Públicos:** Toda la información multimedia (grid de fotos) y listas de seguidores son accesibles inmediatamente.
> 2. **Perfiles Privados:** Si `isPrivate === true` y `isFollowing === false`, la vista aplica una restricción de seguridad que bloquea la descarga de publicaciones y lista de seguidores.
> 3. **Flujo Formal de Solicitud:** Al presionar 'Seguir', no se otorga acceso directo. En su lugar se crea un `FollowRequest` con estado `pending` en la base de datos local/backend. El usuario propietario de la cuenta privada recibe una notificación en `ActivityScreen.tsx` con opciones para **Aprobar (`approved`)** o **Rechazar (`rejected`)**. Al aprobar la solicitud, las reglas de seguridad desbloquean el contenido en el backend."

---

### 5️⃣ PREGUNTA 5: Navegación Anidada, Deep Linking e Historias 24h (Módulo 5)
**Pregunta:** *¿Cómo funciona la navegación independiente por pestañas, el esquema de Deep Link `instagramclone://post/{uuid}` y la pausa interactiva en las Historias?*

**Respuesta Técnica (100% de Nota):**
> "1. **Pestañas Independientes:** Utilizamos una arquitectura de navegación anidada en `RootNavigator.tsx`. Cada pestaña del `BottomTabNavigator` contiene su propia pila independiente de pantallas (`NativeStackNavigator`). Esto garantiza que navegar en la pestaña 'Explorar' o 'Perfil' no corrompa el historial o estado del feed principal en 'Home'.
> 2. **Deep Linking Profundo:** Configuramos el esquema de URL personalizado `instagramclone://`. Mediante la propiedad `linking` en `NavigationContainer`, las URLs del tipo `instagramclone://post/{uuid}` son interceptadas por el sistema operativo y ruteadas directamente a `PostDetailScreen`, abstrayendo el parámetro `postId`.
> 3. **Historias Efímeras (Pausa y Avance):** En `StoriesViewerScreen.tsx`, la barra de progreso se anima con `Animated.timing`. Implementamos interacción táctil mediante `TouchableWithoutFeedback`: al ejecutar `onPressIn`, se detiene la animación (`setIsPaused(true)`), permitiendo al usuario pausar la reproducción de la historia manteniendo presionada la pantalla. Al soltar (`onPressOut`), la reproducción se reanuda desde la misma posición."

---

## 🛠️ Resumen de Archivos Clave del Código Fuente

- [LRUCache.ts](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/instagram-clone-mobile/src/cache/LRUCache.ts) — Implementación del algoritmo LRU para memoria RAM.
- [ImageCacheManager.ts](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/instagram-clone-mobile/src/cache/ImageCacheManager.ts) — Caché de 2 Niveles y cancelación con AbortController.
- [OfflineSyncQueue.ts](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/instagram-clone-mobile/src/offline/OfflineSyncQueue.ts) — Procesamiento de cola de sincronización en background.
- [WebSocketService.ts](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/instagram-clone-mobile/src/realtime/WebSocketService.ts) — Comunicación bidireccional en tiempo real para DMs.
- [RootNavigator.tsx](file:///C:/Users/Lenovo/.gemini/antigravity/scratch/instagram-clone-mobile/src/navigation/RootNavigator.tsx) — Navegación por pestañas independientes y ruteo de Deep Links.
