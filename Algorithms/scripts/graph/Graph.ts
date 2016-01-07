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

        public adjacencyMatrix: number[][] = null;

        constructor();
        constructor(matrix: number[][]);
        constructor(matrix?: number[][]) {
            this.adjacencyMatrix = matrix || null;
            if (this.adjacencyMatrix == null) {
                this.adjacencyMatrix = this.getAdjacencyMatrix();
            } else {
                this._nodes = this.getNodesFromMatrix();
                this._edges = this.getEdgesFromMatrix();
            }
        }

        private getAdjacencyMatrix() {
            var matrix = [];
            for (var i = 0; i < this._nodes.length; i++) {
                matrix[i] = [];
                for (var j = 0; j < this._nodes.length; j++) {
                    var source = this._nodes[i];
                    var sink = this._nodes[j];

                    var edge = this.getEdgeByNames(source.name, sink.name);
                    if (edge != null) {
                        matrix[i][j] = edge.value;
                    } else {
                        matrix[i][j] = 0;
                    }
                }
            }

            return matrix;
        }

        private getNodesFromMatrix(): Node[] {
            var nodes = [];
            for (var i = 0; i < this.adjacencyMatrix.length; i++) {
                var node = new Node(i.toString());
                node.order = i;
                nodes.push(node);
            }
            return nodes;
        }

        private getEdgesFromMatrix(): Edge[] {
            var edges = [];
            var edgesNames = [];

            for (var i = 0; i < this.adjacencyMatrix.length; i++) {
                for (var j = 0; j < this.adjacencyMatrix.length; j++) {
                    if (i != j || this.adjacencyMatrix[i][j] != 0) {
                        var node1 = this._nodes[i];
                        var node2 = this._nodes[j];

                        if (this.orientated) {
                            if (this.adjacencyMatrix[i][j] != 0) {
                                edges.push(new Edge(node1, node2, this.adjacencyMatrix[i][j]));
                            }
                        } else {
                            if (this.adjacencyMatrix[i][j] != 0) {
                                if (edgesNames.indexOf("edge-" + node1.name + node2.name) < 0 && edgesNames.indexOf("edge-" + node2.name + node1.name) < 0) {
                                    edges.push(new Edge(node1, node2, this.adjacencyMatrix[i][j]));
                                    edgesNames.push("edge-" + node1.name + node2.name);
                                }
                            }
                        }
                    }
                }
            }

            return edges;
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
            this.adjacencyMatrix = this.getAdjacencyMatrix();
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
            this.adjacencyMatrix = this.getAdjacencyMatrix();
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

        preOrder(start: Node, edges: any[]): string[] {
            var graph = this.getGraphFromEdges(edges);
            var nodesTraversal = [start.name];
            var traversal = [start.name];
            this.preOrderInner(start.name, graph, traversal);
            return traversal;
        }

        private preOrderInner(node: string, graph: any, traversal: string[]) {
            var arr = graph[node];
            for (var i = 0; i < arr.length; i++) {
                var c = arr[i];
                if (traversal.indexOf(c) < 0) {
                    traversal.push(c);
                    this.preOrderInner(c, graph, traversal);
                }
            }
        }

        private getEdge(edges: any[], sourceName: string, sinkName: string) {
            var edge = Enumerable.from(edges).firstOrDefault((e: any, i) => {
                return e.source == sourceName && e.target == sinkName;
            }, null);

            return edge;
        }

        private getGraphFromEdges(edges: any[]): any {
            var graph = {};
            for (var i = 0; i < edges.length; i++) {
                var edge = edges[i];

                if (!graph.hasOwnProperty(edge.source)) {
                    graph[edge.source] = []
                }
                if (graph[edge.source].indexOf(edge.target) < 0) {
                    graph[edge.source].push(edge.target);
                }

                if (!graph.hasOwnProperty(edge.target)) {
                    graph[edge.target] = []
                }
                if (graph[edge.target].indexOf(edge.source) < 0) {
                    graph[edge.target].push(edge.source);
                }
            }
            return graph;
        }

        getPathAndScore(preorder: any[]): any {
            var score = 0;
            var path = [];

            for (var i = 0; i < preorder.length; i++) {
                var p1 = preorder[i];
                var p2 = preorder[i < preorder.length - 1 ? i + 1 : 0];
                path.push({ source: p1, target: p2 });

                var edge = this.getEdgeByNames(p1, p2);
                if (edge != null) {
                    console.log(edge);
                    score += edge.value;
                }
            }

            return { score: score, path: path };
        }
    }
}