// M5' Deep-dive: LWW-Map for title/price/quantity (structured), Yjs only for description rich text
// LWW-Map: each field is (value, timestamp, replicaId), merge picks larger timestamp, tie break replicaId - simple, convergent
// Yjs: for free-typing description per character, heavier - use only for description, not whole form
// Sync: debounce 150ms -> WS -> server LWW merge -> broadcast -> other client merge -> re-render
// CRDT solves structure, not business: 2 sellers same price, LWW picks last timestamp, need UI show "field edited by X" via replicaId
export function createYjsProvider(draftId: string) {
  const wsUrl = `ws://localhost:8080/ws/seller/${draftId}`;
  return {
    wsUrl,
    connect: () => console.log(`[Yjs] connect ${wsUrl} - LWW for title/price, Yjs for description`),
    disconnect: () => console.log(`[Yjs] disconnect`),
    // In real: LWW-Map: new Map(field -> LWWEntry), Y.Doc for description: new WebsocketProvider(wsUrl, draftId, ydoc)
  };
}
