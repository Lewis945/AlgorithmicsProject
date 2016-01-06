var Algorithms;
(function (Algorithms) {
    var Edge = (function () {
        function Edge(source, sink, value, orientated) {
            this.source = source;
            this.sink = sink;
            this.value = value;
            this.orientated = orientated || false;
        }
        return Edge;
    })();
    Algorithms.Edge = Edge;
})(Algorithms || (Algorithms = {}));
//# sourceMappingURL=Edge.js.map