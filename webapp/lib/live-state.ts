import type { WebSocket } from 'ws';

const clients = new Set<WebSocket>();
let streamStatus: 'live' | 'offline' = 'offline';

export const LiveState = {
  getStatus: () => streamStatus,
  setStatus: (status: 'live' | 'offline') => { streamStatus = status },
  getClients: () => clients,
  addClient: (ws: WebSocket) => clients.add(ws),
  removeClient: (ws: WebSocket) => clients.delete(ws),
  broadcastStatus: () => {
    const payload = JSON.stringify({ status: streamStatus });

    console.log("Broadcasting to", clients.size, "clients:", payload);

    for (const client of clients) {
      if (client.readyState === client.OPEN) {
        client.send(payload);
      }
    }
  }
};