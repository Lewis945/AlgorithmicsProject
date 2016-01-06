/// <reference path="./typings/jquery/jquery.d.ts"/>

declare var CY: any;
declare var refreshCY: any;

var App = {
    Graph: {
        current: {
            graph: null,
            getGraph: function (): Algorithms.Graph {
                return App.Graph.current.graph;
            },
        },

        selectedNodeName: null,
        selectedSinkNodeName: null,

        selectedEdgeName: null,

        createNode: function () {
            var graph = App.Graph.current.getGraph();

        },
        editNode: function () {
            var graph = App.Graph.current.getGraph();

        },
        removeNode: function () {
            var graph = App.Graph.current.getGraph();

        },

        createEdge: function () {
            var graph = App.Graph.current.getGraph();

        },
        editEdge: function () {
            var graph = App.Graph.current.getGraph();

        },
        removeEdge: function () {
            var graph = App.Graph.current.getGraph();

        },

        onNodeClick: function (e) {
            var graph = App.Graph.current.getGraph();
            var id = e.data('id');

            console.log('clicked ' + e.data('id'));

            if (App.Graph.selectedNodeName != null) {
                if (App.Graph.selectedNodeName == id) {
                    e.removeClass('selected');
                    App.Graph.selectedNodeName = null;
                } else {
                    var prev = CY.getElementById(App.Graph.selectedNodeName);
                    prev.removeClass('selected');
                    e.addClass('selected');
                    App.Graph.selectedNodeName = id;
                }
            } else {
                e.addClass('selected');
                App.Graph.selectedNodeName = id;
            }

            //App.Graph.selectedNodeName
            //App.Graph.selectedSinkNodeName
            //CY.getElementById(e.data('id')).addClass('selected');

        },
        onEdgeClick: function (e) {
            var graph = App.Graph.current.getGraph();
            var id = e.data('id');

            console.log('clicked ' + e.data('id'));

            if (App.Graph.selectedEdgeName != null) {
                if (App.Graph.selectedEdgeName == id) {
                    e.removeClass('selected');
                    App.Graph.selectedEdgeName = null;
                } else {
                    var prev = CY.getElementById(App.Graph.selectedEdgeName);
                    prev.removeClass('selected');
                    e.addClass('selected');
                    App.Graph.selectedEdgeName = id;
                }
            } else {
                e.addClass('selected');
                App.Graph.selectedEdgeName = id;
            }
        },
    }
};

// Events
$(document).ready(function () {
    $("#node-create-btn").on("click", function () {
        App.Graph.createNode();
    });
    $("#node-edit-btn").on("click", function () {
        App.Graph.editNode();
    });
    $("#node-remove-btn").on("click", function () {
        App.Graph.removeNode();
    });

    $("#edge-create-btn").on("click", function () {
        App.Graph.createEdge();
    });
    $("#edge-edit-btn").on("click", function () {
        App.Graph.editEdge();
    });
    $("#edge-remove-btn").on("click", function () {
        App.Graph.removeEdge();
    });

    CY.on('click', 'node', function (evt) {
        App.Graph.onNodeClick(this);
    });
    CY.on('click', 'edge', function (evt) {
        App.Graph.onEdgeClick(this);
    });
});

$(document).ready(function () {
    
    // --------------------------------------------
    var g = new Algorithms.Graph();
    g.orientated = false;
    g.weighted = true;

    g.addNode("0");
    g.addNode("1");
    g.addNode("2");
    g.addNode("3");
    g.addNode("4");
    g.addNode("5");

    for (var k = 0; k < g.nodesCount; k++) {
        g.nodes[k].order = k;
    }

    g.addEdge("0", "1", 2);
    g.addEdge("0", "3", 1);
    g.addEdge("1", "2", 3);
    g.addEdge("2", "3", 5);
    g.addEdge("2", "4", 7);
    g.addEdge("3", "4", 6);
    g.addEdge("4", "5", 4);
    // --------------------------------------------

    // --------------------------------------------

    //refreshCY({ directed: false });
    //refreshCY({ directed: true });

    //CY.add([
    //    { group: "nodes", data: { id: "0" } },
    //    { group: "nodes", data: { id: "1" } },
    //    { group: "nodes", data: { id: "2" } },
    //    { group: "nodes", data: { id: "3" } },
    //    { group: "nodes", data: { id: "4" } },
    //    { group: "nodes", data: { id: "5" } },

    //    { group: "edges", data: { id: "01", weight: 2, source: "0", target: "1" } },
    //    { group: "edges", data: { id: "03", weight: 1, source: "0", target: "3" } },
    //    { group: "edges", data: { id: "12", weight: 3, source: "1", target: "2" } },
    //    { group: "edges", data: { id: "23", weight: 5, source: "2", target: "3" } },
    //    { group: "edges", data: { id: "24", weight: 7, source: "2", target: "4" } },
    //    { group: "edges", data: { id: "34", weight: 6, source: "3", target: "4" } },
    //    { group: "edges", data: { id: "45", weight: 4, source: "4", target: "5" } },

    //]);

    //0: "0 - 1    2"
    //1: "1 - 2    3"
    //2: "0 - 3    1"
    //3: "3 - 4    6"
    //4: "4 - 5    4"

    //var mst = [
    //    CY.getElementById('0'),
    //    CY.getElementById('01'),
    //    CY.getElementById('1'),
    //    CY.getElementById('12'),
    //    CY.getElementById('2'),
    //    CY.getElementById('03'),
    //    CY.getElementById('3'),
    //    CY.getElementById('34'),
    //    CY.getElementById('4'),
    //    CY.getElementById('45'),
    //    CY.getElementById('5'),
    //];

    //var i = 0;
    //var highlightNextEle = function () {
    //    if (i < mst.length) {
    //        mst[i].addClass('highlighted');

    //        i++;
    //        setTimeout(highlightNextEle, 2000);
    //    }
    //};
    
    //setTimeout(highlightNextEle, 5000)

    // --------------------------------------------

    console.log("Edges");
    console.log(g.getEdges());

    var result = Algorithms.Prim.findMinimalSpanningTree(g);
    console.log('Prim');
    console.log(result);

    var kr = new Algorithms.Kruskal(g);
    kr.findMinimalSpanningTree();
    console.log('Kruscal');
    console.log(kr.edges.map((v, i, arr) => { return v.source.name + " - " + v.sink.name + "    " + v.value }));
});