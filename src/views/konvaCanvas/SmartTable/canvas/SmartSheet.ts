import { Core } from "./core/Core";

export class SmartSheet {
  readonly core: Core;
  readonly outEvent: OutEvent;
  constructor(config: any, container: string) {
    this.core = new Core(config, container);
    this.outEvent = new OutEvent(this.core)
  }
}

class OutEvent {
  constructor(private readonly core: Core) { }
}