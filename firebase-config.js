// ============================================================
//  INSTRUCCIONES PARA CONFIGURAR FIREBASE
// ============================================================
//  1. Ve a https://console.firebase.google.com
//  2. Crea un proyecto nuevo (o usa uno existente)
//  3. En el proyecto: Configuracion (engranaje) > Configuracion del proyecto
//  4. Baja hasta "Tus apps" > Agrega una app Web ( </> )
//  5. Dale un nombre (ej: "WebPiezas") y da clic en Registrar app
//  6. Copia los valores del objeto firebaseConfig y pegalos abajo
//
//  7. En el proyecto Firebase activa:
//     - Firestore Database (modo produccion, luego ajusta las reglas)
//     - Authentication > Metodo de inicio de sesion > Correo/Contrasena
//
//  8. Crea tu usuario admin:
//     Authentication > Usuarios > Agregar usuario
//     Email: ibigio@medinaauto.com  |  Contrasena: (la que elijas)
//
//  9. Reglas de Firestore recomendadas (Firestore > Reglas):
// ─────────────────────────────────────────────────────────────
//  rules_version = '2';
//  service cloud.firestore {
//    match /databases/{database}/documents {
//      // Solo admin puede leer y escribir cotizaciones
//      match /cotizaciones/{id} {
//        allow create: if true;
//        allow read, update, delete: if request.auth != null;
//      }
//      // Chats: clientes pueden crear/leer su propio chat
//      match /chats/{chatId} {
//        allow create, read: if true;
//        allow update, delete: if request.auth != null;
//        match /mensajes/{msgId} {
//          allow create, read: if true;
//          allow update, delete: if request.auth != null;
//        }
//      }
//    }
//  }
// ─────────────────────────────────────────────────────────────
//
// 10. Reglas de Firebase Storage (Storage > Reglas):
// ─────────────────────────────────────────────────────────────
//  rules_version = '2';
//  service firebase.storage {
//    match /b/{bucket}/o {
//      match /cotizaciones/{fileName} {
//        allow write: if true;                   // clientes pueden subir
//        allow read:  if request.auth != null;   // solo admin puede descargar
//      }
//    }
//  }
// ─────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            "AIzaSyDuDqxJ53NhQqZe67nFgEphN4CWyvwIT-I",
  authDomain:        "webpiezas.firebaseapp.com",
  projectId:         "webpiezas",
  storageBucket:     "webpiezas.firebasestorage.app",
  messagingSenderId: "1000876711268",
  appId:             "1:1000876711268:web:f236d8178f38c33e122e71"
};

firebase.initializeApp(firebaseConfig);

const db   = firebase.firestore();
const auth = firebase.auth();
// storage se inicializa solo en cotizacion.html (requiere Firebase Storage activado)
