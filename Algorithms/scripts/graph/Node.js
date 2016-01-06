var Algorithms;
(function (Algorithms) {
    var Node = (function () {
        function Node(name, value, label, order) {
            this.name = name;
            this.value = value || name;
            this.label = label || name;
            this.order = order || null;
        }
        return Node;
    })();
    Algorithms.Node = Node;
})(Algorithms || (Algorithms = {}));
//# sourceMappingURL=Node.js.map