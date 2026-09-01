// M5 Seller - CRDT Yjs provider (frontend)
// For demo: simple y-websocket provider mock, in prod use y-websocket + Hocuspocus
export function createYjsProvider(draftId: string) {
  const wsUrl = `ws://localhost:8080/ws/seller/${draftId}`;
  return {
    wsUrl,
    connect: () => console.log(`[Yjs] connect ${wsUrl}`),
    disconnect: () => console.log(`[Yjs] disconnect`),
    // In real: new Y.Doc(), new WebsocketProvider(wsUrl, draftId, doc)
  };
}
