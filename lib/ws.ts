import { useEffect, useState } from "react";

function getWebSocketStateString(readyState: Number) {
  switch (readyState) {
    case WebSocket.CONNECTING:
      return 'CONNECTING';
    case WebSocket.OPEN:
      return 'OPEN';
    case WebSocket.CLOSING:
      return 'CLOSING';
    case WebSocket.CLOSED:
      return 'CLOSED';
    default:
      return 'UNKNOWN';
  }
}

export interface IWebsocketManagerSubscription {
  state: string,
  send: (data: string) => void,
  reconnect: () => void,
  connectionCtr: number,
  readyState: () => number,
}

interface IWebsocketInternalSubscription {
  stateCb: (state: string) => void,
  connectionCtrCb: (ctr: number) => void,
}

export class WebsocketManager {
  private url: string
  private ws?: WebSocket
  private connectionCtr: number;
  private subscriberCtr: number;

  private subscribers: {[id: number]: IWebsocketInternalSubscription}

  constructor(url: string) {
    this.url = url
    this.connectionCtr = 0;
    this.subscriberCtr = 1;
    this.subscribers = {};
    this.reconnect()
  }

  connectionStateChange(ws: WebSocket) {
    // tolerate reconnect races
    if (ws !== this.ws) {
      return;
    }
    this.notifySubscribers();
  }

  notifySubscribers() {
    const state = getWebSocketStateString(this.ws!.readyState);
    console.log(state);
    Object.values(this.subscribers).forEach((sub) => {sub.stateCb(state); sub.connectionCtrCb(this.connectionCtr)})
  }

  reconnect() {
    if (this.ws) {
      this.ws.close();
    }
    const ws = new WebSocket(this.url);
    this.ws = ws;
    const stateChangeCb = () => this.connectionStateChange(ws);
    stateChangeCb();
    ws.onopen = stateChangeCb;
    ws.onerror = stateChangeCb;
    ws.onclose = stateChangeCb;
    this.connectionCtr += 1;
  }

  send(data: string) {
    this.ws!.send(data);
  }

  subscribeReact(): IWebsocketManagerSubscription {
    const [state,  setState] = useState("NULL");
    const [reconnectCtr, setReconnectCtr] = useState(0);
    const [connectionCtr, setConnectionCtr] = useState(0);
    useEffect(() => {
      const id = this.subscriberCtr;
      this.subscriberCtr += 1;

      this.subscribers[id] = {
        stateCb: setState,
        connectionCtrCb: setConnectionCtr,
      }

      setState(getWebSocketStateString(this.ws!.readyState))
      setConnectionCtr(this.connectionCtr);

      return () => {
        delete this.subscribers[id]
      }
    }, [])
    useEffect(() => {
      if (reconnectCtr == 0) {
        return
      }
      this.reconnect();
    }, [reconnectCtr])
    return {
      state: state,
      send: this.send.bind(this),
      reconnect: () => {setReconnectCtr(old => old += 1)},
      connectionCtr: connectionCtr,
      readyState: () => this.ws!.readyState,
    }
  }
}

const websocketManagers: {[key: string]: WebsocketManager} = {}

export function getWebsocketManager(url: string): WebsocketManager {
  if (!(url in websocketManagers)) {
    websocketManagers[url] = new WebsocketManager(url);
  }
  return websocketManagers[url];
}