type EventCallback<T extends any[] = any[]> = (...args: T) => void

type EventNameOrArray = string | string[]

function normalizeEventArray (event: EventNameOrArray): Set<string> {
  return new Set(Array.isArray(event) ? event : [event])
}

class InkEmitter {
  private events: Map<string, Set<EventCallback>>

  constructor () {
    this.events = new Map()
  }

  /**
   * Register a listener for one or more events.
   *
   * @param event - The name of the event or an array of event names.
   * @param listener - The callback function to be called when the event is emitted.
   * @returns A function to unregister the listener.
   */
  receive<T extends any[] = any[]> (
    event: EventNameOrArray,
    listener: EventCallback<T>
  ): () => void {
    const events = normalizeEventArray(event)

    for (const eventName of events) {
      const eventListeners =
        this.events.get(eventName) || new Set<EventCallback<T[]>>()
      eventListeners.add(listener as EventCallback<T[]>)
      this.events.set(eventName, eventListeners)
    }

    return () => {
      for (const eventName of events) {
        const eventListeners = this.events.get(eventName)
        eventListeners?.delete(listener as EventCallback<T[]>)
      }
    }
  }

  /**
   * Emit one or more events with the provided arguments.
   *
   * @param event - The name of the event or an array of event names.
   * @param args - The arguments to be passed to the listeners.
   */
  emit (event: EventNameOrArray, ...args: any[]): void {
    const events = normalizeEventArray(event)

    const emitEvent = (event: string) => {
      this.events.get(event)?.forEach(callback => callback(...args))
    }

    events.forEach(emitEvent)
  }

  /**
   * Unsubscribe all listeners for one or more events.
   *
   * @param event - The name of the event or an array of event names.
   */
  unsubscribes (event: EventNameOrArray) {
    const events = normalizeEventArray(event)

    for (const eventName of events) {
      if (this.events.has(eventName)) {
        this.events.delete(eventName)
      }
    }
  }

  /**
   * Clear all events and their listeners.
   */
  clear (): void {
    this.events.clear()
  }
}

export const inkEmitter = new InkEmitter()
