// Chat widget — requires db & firebase globals (firebase-config.js)
// Calls window.notifyAdminChat if defined (emailjs-config.js)

function fmtTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString('es', { hour:'2-digit', minute:'2-digit' });
}

const CHAT_ID_KEY = 'wb_chat_id';
const CHAT_NM_KEY = 'wb_chat_name';

let chatId      = localStorage.getItem(CHAT_ID_KEY) || null;
let chatName    = localStorage.getItem(CHAT_NM_KEY) || '';
let chatOpen    = false;
let unsubChat   = null;
let newMsgCount = 0;

const toggle      = document.getElementById('chat-toggle');
const chatWin     = document.getElementById('chat-window');
const closeBtn    = document.getElementById('chat-close');
const nameInput   = document.getElementById('chat-name-input');
const msgsDiv     = document.getElementById('chat-msgs');
const msgInput    = document.getElementById('chat-msg-input');
const sendBtn     = document.getElementById('chat-send-btn');
const badge       = document.getElementById('chat-badge');
const nameSection = document.getElementById('chat-name-section');

if (chatName) {
  nameInput.value = chatName;
  nameSection.style.display = 'none';
}

toggle.addEventListener('click', () => {
  chatOpen = !chatOpen;
  if (chatOpen) {
    chatWin.classList.add('open');
    newMsgCount = 0;
    badge.style.display = 'none';
    if (chatId) subscribeChat();
    setTimeout(() => msgInput.focus(), 200);
  } else {
    chatWin.classList.remove('open');
    if (unsubChat) { unsubChat(); unsubChat = null; }
  }
});

closeBtn.addEventListener('click', () => {
  chatOpen = false;
  chatWin.classList.remove('open');
  if (unsubChat) { unsubChat(); unsubChat = null; }
});

msgInput.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
  const txt  = msgInput.value.trim();
  const name = nameInput.value.trim() || chatName;
  if (!txt) return;
  if (!name) { nameInput.focus(); nameInput.style.borderColor = 'var(--accent)'; return; }

  if (!chatName) {
    chatName = name;
    localStorage.setItem(CHAT_NM_KEY, chatName);
    nameSection.style.display = 'none';
  }

  msgInput.value = '';

  if (!chatId) {
    const ref = await db.collection('chats').add({
      nombre:        chatName,
      timestamp:     firebase.firestore.FieldValue.serverTimestamp(),
      ultimoMensaje: txt,
      leido:         false
    });
    chatId = ref.id;
    localStorage.setItem(CHAT_ID_KEY, chatId);
    subscribeChat();
  } else {
    await db.collection('chats').doc(chatId).update({
      ultimoMensaje: txt,
      timestamp:     firebase.firestore.FieldValue.serverTimestamp(),
      leido:         false
    });
  }

  await db.collection('chats').doc(chatId).collection('mensajes').add({
    texto:     txt,
    de:        'cliente',
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  if (!localStorage.getItem('wb_notified_' + chatId)) {
    if (typeof window.notifyAdminChat === 'function') window.notifyAdminChat(chatName, txt);
    localStorage.setItem('wb_notified_' + chatId, '1');
  }
}

function subscribeChat() {
  if (!chatId || unsubChat) return;
  unsubChat = db.collection('chats').doc(chatId).collection('mensajes')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snap => { renderMessages(snap.docs); });
}

function renderMessages(docs) {
  msgsDiv.innerHTML = '';
  if (!docs.length) {
    msgsDiv.innerHTML = '<p class="chat-empty">Escribe tu primer mensaje.</p>';
    return;
  }
  docs.forEach(doc => {
    const d    = doc.data();
    const wrap = document.createElement('div');
    wrap.style.display       = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems    = d.de === 'cliente' ? 'flex-end' : 'flex-start';
    const bubble = document.createElement('div');
    bubble.className  = 'chat-bubble ' + (d.de === 'cliente' ? 'bubble-cliente' : 'bubble-admin');
    bubble.textContent = d.texto;
    const time = document.createElement('div');
    time.className  = 'bubble-time';
    time.textContent = fmtTime(d.timestamp);
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    msgsDiv.appendChild(wrap);
  });
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
  if (!chatOpen) {
    const last = docs[docs.length - 1];
    if (last && last.data().de === 'admin') {
      newMsgCount++;
      badge.textContent    = newMsgCount;
      badge.style.display  = 'flex';
    }
  }
}
