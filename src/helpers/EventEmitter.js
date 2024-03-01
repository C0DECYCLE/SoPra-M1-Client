/**
 * Copyright (C) - All Rights Reserved
 * Written by Noah Mattia Bussinger, October 2023
 */

import { UUIDv4 } from "helpers/utils";

export default class EventEmitter {
  constructor() {
    this.listeners = new Map();
    this.isClosed = false;
    this.isDestroyed = false;
  }

  once(listener) {
    if (this.isDestroyed) {
      throw new Error("EventEmitter: Is destroyed.");
    }
    const uuid = this.on((data) => {
      listener(data);
      this.off(uuid);
    });
  }

  on(listener) {
    if (this.isDestroyed) {
      throw new Error("AbstractEventEmitter: Is destroyed.");
    }
    if (this.isClosed) {
      throw new Error("AbstractEventEmitter: Is closed.");
    }
    const uuid = UUIDv4();
    this.listeners.set(uuid, listener);
    return uuid;
  }

  off(uuid) {
    if (this.isDestroyed) {
      throw new Error("AbstractEventEmitter: Is destroyed.");
    }
    this.listeners.delete(uuid);
  }

  clear() {
    if (this.isDestroyed) {
      throw new Error("AbstractEventEmitter: Is destroyed.");
    }
    this.listeners.clear();
  }

  emit(data) {
    if (this.isDestroyed) {
      throw new Error("EventEmitter: Is destroyed.");
    }
    for (const [_uuid, listener] of this.listeners) {
      listener(data);
    }
  }

  close() {
    if (this.isDestroyed) {
      throw new Error("AbstractEventEmitter: Is destroyed.");
    }
    this.isClosed = true;
  }

  destroy() {
    if (this.isDestroyed) {
      throw new Error("AbstractEventEmitter: Is destroyed.");
    }
    this.clear();
    this.close();
    this.isDestroyed = true;
  }
}
