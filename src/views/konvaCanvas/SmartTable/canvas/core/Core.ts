import { Config } from "./config/config";
import { Graph } from "./draw/Graph";

export class Core {
   readonly config: Config;
   readonly graph: Graph;
  constructor(config: any, container: string) {
    this.config = new Config(config);
    this.graph = new Graph(this.config);
  }
}