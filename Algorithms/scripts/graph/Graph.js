/// <reference path="../linq/linq.js.d.ts"/>
var Algorithms;
(function (Algorithms) {
    var Graph = (function () {
        function Graph(matrix) {
            this.orientated = false;
            this.weighted = false;
            this._nodes = [];
            this._edges = [];
            this.adjacencyMatrix = null;
            this.adjacencyMatrix = matrix || null;
            if (this.adjacencyMatrix == null) {
                this.adjacencyMatrix = this.getAdjacencyMatrix();
            }
            else {
                this._nodes = this.getNodesFromMatrix();
                this._edges = this.getEdgesFromMatrix();
            }
        }
        Object.defineProperty(Graph.prototype, "nodes", {
            get: function () {
                return this._nodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Graph.prototype, "edges", {
            get: function () {
                return this._edges;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Graph.prototype, "nodesCount", {
            get: function () {
                return this._nodes.length;
            },
            enumerable: true,
            configurable: true
        });
        Graph.prototype.getAdjacencyMatrix = function () {
            var matrix = [];
            for (var i = 0; i < this._nodes.length; i++) {
                matrix[i] = [];
                for (var j = 0; j < this._nodes.length; j++) {
                    var source = this._nodes[i];
                    var sink = this._nodes[j];
                    var edge = this.getEdgeByNames(source.name, sink.name);
                    if (edge != null) {
                        matrix[i][j] = edge.value;
                    }
                    else {
                        matrix[i][j] = 0;
                    }
                }
            }
            return matrix;
        };
        Graph.prototype.getNodesFromMatrix = function () {
            var nodes = [];
            for (var i = 0; i < this.adjacencyMatrix.length; i++) {
                var node = new Algorithms.Node(i.toString());
                node.order = i;
                nodes.push(node);
            }
            return nodes;
        };
        Graph.prototype.getEdgesFromMatrix = function () {
            var edges = [];
            var edgesNames = [];
            for (var i = 0; i < this.adjacencyMatrix.length; i++) {
                for (var j = 0; j < this.adjacencyMatrix.length; j++) {
                    if (i != j || this.adjacencyMatrix[i][j] != 0) {
                        var node1 = this._nodes[i];
                        var node2 = this._nodes[j];
                        if (this.orientated) {
                            if (this.adjacencyMatrix[i][j] != 0) {
                                edges.push(new Algorithms.Edge(node1, node2, this.adjacencyMatrix[i][j]));
                            }
                        }
                        else {
                            if (this.adjacencyMatrix[i][j] != 0) {
                                if (edgesNames.indexOf("edge-" + node1.name + node2.name) < 0 && edgesNames.indexOf("edge-" + node2.name + node1.name) < 0) {
                                    edges.push(new Algorithms.Edge(node1, node2, this.adjacencyMatrix[i][j]));
                                    edgesNames.push("edge-" + node1.name + node2.name);
                                }
                            }
                        }
                    }
                }
            }
            return edges;
        };
        Graph.prototype.getEdges = function () {
            if (this.adjacencyMatrix != null && this._edges.length == 0) {
                var adjacencyMatrix = this.adjacencyMatrix.slice();
                for (var i = 0; i < adjacencyMatrix.length; i++) {
                    for (var j = 0; j < adjacencyMatrix.length; j++) {
                        if (adjacencyMatrix[i][j] != Number.MAX_VALUE && i != j) {
                            adjacencyMatrix[j][i] = Number.MAX_VALUE;
                            var source = new Algorithms.Node(i.toString());
                            var sink = new Algorithms.Node(j.toString());
                            var edge = new Algorithms.Edge(source, sink, adjacencyMatrix[i][j]);
                            this._edges.push(edge);
                        }
                    }
                }
            }
            return this._edges;
        };
        Graph.prototype.addNode = function (name, value, label) {
            this.adjacencyMatrix = null;
            var node = new Algorithms.Node(name, value, label);
            this._nodes.push(node);
            this.adjacencyMatrix = this.getAdjacencyMatrix();
        };
        Graph.prototype.addEdge = function (sourceName, sinkName, value) {
            this.adjacencyMatrix = null;
            var edge = this.getEdgeByNames(sourceName, sinkName);
            if (edge != null) {
                throw new Error("Edge (" + sourceName + "->" + sinkName + ") already exists.");
            }
            var source = Enumerable.from(this._nodes).firstOrDefault(function (n, i) { return n.name == sourceName; }, null);
            var sink = Enumerable.from(this._nodes).firstOrDefault(function (n, i) { return n.name == sinkName; }, null);
            edge = new Algorithms.Edge(source, sink, value, this.orientated);
            this._edges.push(edge);
            this.adjacencyMatrix = this.getAdjacencyMatrix();
        };
        Graph.prototype.getNodeByName = function (name) {
            var edge = Enumerable.from(this._nodes).firstOrDefault(function (n, i) {
                return n.name == name;
            }, null);
            return edge;
        };
        Graph.prototype.getEdgeByNames = function (sourceName, sinkName) {
            var edge = null;
            if (this.orientated) {
                edge = Enumerable.from(this._edges).firstOrDefault(function (e, i) {
                    return e.source.name == sourceName && e.sink.name == sinkName && e.orientated;
                }, null);
            }
            else {
                edge = Enumerable.from(this._edges).firstOrDefault(function (e, i) {
                    return ((e.source.name == sourceName && e.sink.name == sinkName) ||
                        (e.source.name == sinkName && e.sink.name == sourceName)) &&
                        !e.orientated;
                }, null);
            }
            if (edge != null) {
                return edge;
            }
            return null;
        };
        Graph.prototype.getEdgeByOrder = function (sourceOrder, sinkOrder) {
            var edge = null;
            if (this.orientated) {
                edge = Enumerable.from(this._edges).firstOrDefault(function (e, i) {
                    return e.source.order != null && e.sink.order != null &&
                        e.source.order == sourceOrder && e.sink.order == sinkOrder &&
                        e.orientated;
                }, null);
            }
            else {
                edge = Enumerable.from(this._edges).firstOrDefault(function (e, i) {
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
        };
        Graph.prototype.preOrder = function (start, edges) {
            var graph = this.getGraphFromEdges(edges);
            var nodesTraversal = [start.name];
            var traversal = [start.name];
            this.preOrderInner(start.name, graph, traversal);
            return traversal;
        };
        Graph.prototype.preOrderInner = function (node, graph, traversal) {
            var arr = graph[node];
            for (var i = 0; i < arr.length; i++) {
                var c = arr[i];
                if (traversal.indexOf(c) < 0) {
                    traversal.push(c);
                    this.preOrderInner(c, graph, traversal);
                }
            }
        };
        Graph.prototype.getEdge = function (edges, sourceName, sinkName) {
            var edge = Enumerable.from(edges).firstOrDefault(function (e, i) {
                return e.source == sourceName && e.target == sinkName;
            }, null);
            return edge;
        };
        Graph.prototype.getGraphFromEdges = function (edges) {
            var graph = {};
            for (var i = 0; i < edges.length; i++) {
                var edge = edges[i];
                if (!graph.hasOwnProperty(edge.source)) {
                    graph[edge.source] = [];
                }
                if (graph[edge.source].indexOf(edge.target) < 0) {
                    graph[edge.source].push(edge.target);
                }
                if (!graph.hasOwnProperty(edge.target)) {
                    graph[edge.target] = [];
                }
                if (graph[edge.target].indexOf(edge.source) < 0) {
                    graph[edge.target].push(edge.source);
                }
            }
            return graph;
        };
        Graph.prototype.getPathAndScore = function (preorder) {
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
        };
        return Graph;
    })();
    Algorithms.Graph = Graph;
})(Algorithms || (Algorithms = {}));
//# sourceMappingURL=Graph.js.map