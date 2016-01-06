/// <reference path="../linq/linq.js.d.ts"/>

module Algorithms {
    export class Graph {
        public orientated = false;
        public weighted = false;

        private _nodes: Node[] = [];
        get nodes(): Node[] {
            return this._nodes;
        }

        private _edges: Edge[] = [];
        get edges(): Edge[] {
            return this._edges;
        }

        get nodesCount(): number {
            return this._nodes.length;
        }

        private adjacencyMatrix: number[][] = null;

        getAdjacencyMatrix() {
            if (this.adjacencyMatrix == null) {
                console.log(this._nodes);
                this.adjacencyMatrix = [];
                for (var i = 0; i < this._nodes.length; i++) {
                    this.adjacencyMatrix[i] = [];
                    for (var j = 0; j < this._nodes.length; j++) {
                        var source = this._nodes[i];
                        var sink = this._nodes[j];

                        var edge = this.getEdgeByNames(source.name, sink.name);
                        if (edge != null) {
                            this.adjacencyMatrix[i][j] = edge.value;
                        } else {
                            this.adjacencyMatrix[i][j] = 0;
                        }
                    }
                }
            }

            return this.adjacencyMatrix;
        }

        getEdges() {
            if (this.adjacencyMatrix != null && this._edges.length == 0) {
                var adjacencyMatrix = this.adjacencyMatrix.slice();
                for (var i = 0; i < adjacencyMatrix.length; i++) {
                    for (var j = 0; j < adjacencyMatrix.length; j++) {
                        if (adjacencyMatrix[i][j] != Number.MAX_VALUE && i != j) {
                            adjacencyMatrix[j][i] = Number.MAX_VALUE;

                            var source = new Node(i.toString());
                            var sink = new Node(j.toString());

                            var edge = new Edge(source, sink, adjacencyMatrix[i][j]);
                            this._edges.push(edge);
                        }
                    }
                }
            }

            return this._edges;
        }

        // Add a node to the graph
        addNode(name: string);
        addNode(name: string, value: string, label: string);
        addNode(name: string, value?: string, label?: string) {
            this.adjacencyMatrix = null;
            var node = new Node(name, value, label);
            this._nodes.push(node);
        }

        // Add an edge from source to sink with capacity
        addEdge(sourceName: string, sinkName: string);
        addEdge(sourceName: string, sinkName: string, value: number);
        addEdge(sourceName: string, sinkName: string, value?: number) {
            this.adjacencyMatrix = null;

            var edge = this.getEdgeByNames(sourceName, sinkName);

            if (edge != null) {
                throw new Error("Edge (" + sourceName + "->" + sinkName + ") already exists.");
            }

            var source = Enumerable.from(this._nodes).firstOrDefault((n: Node, i) => { return n.name == sourceName; }, null);
            var sink = Enumerable.from(this._nodes).firstOrDefault((n: Node, i) => { return n.name == sinkName; }, null);

            edge = new Edge(source, sink, value, this.orientated);
            this._edges.push(edge);
        }

        getNodeByName(name: string): Node {
            var edge = Enumerable.from(this._nodes).firstOrDefault((n: Node, i) => {
                return n.name == name;
            }, null);

            return edge;
        }

        getEdgeByNames(sourceName: string, sinkName: string): Edge {
            var edge = null;

            if (this.orientated) {
                edge = Enumerable.from(this._edges).firstOrDefault((e: Edge, i) => {
                    return e.source.name == sourceName && e.sink.name == sinkName && e.orientated;
                }, null);
            } else {
                edge = Enumerable.from(this._edges).firstOrDefault((e: Edge, i) => {
                    return ((e.source.name == sourceName && e.sink.name == sinkName) ||
                        (e.source.name == sinkName && e.sink.name == sourceName)) &&
                        !e.orientated;
                }, null);

            }

            if (edge != null) {
                return edge;
            }

            return null;
        }

        getEdgeByOrder(sourceOrder: number, sinkOrder: number): Edge {
            var edge = null;

            if (this.orientated) {
                edge = Enumerable.from(this._edges).firstOrDefault((e: Edge, i) => {
                    return e.source.order != null && e.sink.order != null &&
                        e.source.order == sourceOrder && e.sink.order == sinkOrder &&
                        e.orientated;
                }, null);
            } else {
                edge = Enumerable.from(this._edges).firstOrDefault((e: Edge, i) => {
                    return e.source.order != null && e.sink.order != null &&
                        ((e.source.order == sourceOrder && e.sink.order == sinkOrder) ||
                            (e.source.order == sinkOrder && e.sink.order == sourceOrder)) &&
                        !e.orientated;
                }, null);

            }

            if (edge != null) {
                return edge;
            }

            return null;
        }
    }
}