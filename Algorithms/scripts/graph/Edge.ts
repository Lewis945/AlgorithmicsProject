module Algorithms {
    export class Edge {
        public source: Node;
        public sink: Node;
        public value: number;
        public orientated: boolean;

        constructor(source: Node, sink: Node);
        constructor(source: Node, sink: Node, value: number);
        constructor(source: Node, sink: Node, value: number, orientated: boolean);
        constructor(source: Node, sink: Node, value?: number, orientated?: boolean) {
            this.source = source;
            this.sink = sink;
            this.value = value;
            this.orientated = orientated || false;
        }
    }
}