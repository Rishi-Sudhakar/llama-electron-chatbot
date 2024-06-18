const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendMessage: (message) => ipcRenderer.send('chat-message', message),
  onReply: (callback) => ipcRenderer.on('chat-reply', (event, response) => callback(response))
});
