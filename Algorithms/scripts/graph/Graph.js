/// <reference path="../linq/linq.js.d.ts"/>
var Algorithms;
(function (Algorithms) {
    var Graph = (function () {
        function Graph() {
            this.orientated = false;
            this.weighted = false;
            this._nodes = [];
            this._edges = [];
            this.adjacencyMatrix = null;
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
                        }
                        else {
                            this.adjacencyMatrix[i][j] = 0;
                        }
                    }
                }
            }
            return this.adjacencyMatrix;
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
        return Graph;
    })();
    Algorithms.Graph = Graph;
})(Algorithms || (Algorithms = {}));
//# sourceMappingURL=Graph.js.map