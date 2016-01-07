/// <reference path="./typings/jquery/jquery.d.ts"/>

interface JQuery {
    tab(): JQuery;
    tab(settings: any): JQuery;

    modal(): JQuery;
    modal(settings: any): JQuery;
}

interface HTMLElement {
    files: any;
}

interface EventTarget {
    readyState: any;
    result: any;
}

declare var CY: any;
declare var refreshCY: any;

var App = {
    Graph: {
        current: {
            graph: null,
            getGraph: function (): Algorithms.Graph {
                return App.Graph.current.graph;
            },
            mst: null
        },

        algorithms: {
            prim: function () {
                var graph = App.Graph.current.getGraph();
                var result = Algorithms.Prim.findMinimalSpanningTree(graph);
                console.log('Prim');
                console.log(result);
                highlightPath(result, 'mst');
                App.Graph.current.mst = result;
            },
            kruscal: function () {
                var graph = App.Graph.current.getGraph();
                var kr = new Algorithms.Kruskal(graph);
                kr.findMinimalSpanningTree();
                console.log('Kruscal');
                console.log(kr.edges);
                highlightPath(kr.edges, 'mst');
                App.Graph.current.mst = kr.edges;
            },
            tsp: function () {
                var preorder = App.Graph.current.getGraph().preOrder(App.Graph.current.getGraph().nodes[0], App.Graph.current.mst);
                console.log('Preorder');
                console.log(preorder);

                var ps = App.Graph.current.getGraph().getPathAndScore(preorder);
                console.log('Path');
                console.log(ps.path);
                console.log('Score: ' + ps.score);

                alert('Score: ' + ps.score);

                highlightPath(ps.path, 'tsp');
            }
        },

        selectedNodeName: null,

        selectedEdgeName: null,

        action: null,
        createEditNodeName: null,
        createEditEdgeName: null,

        createNode: function (name: string, opts?: any) {
            var graph = App.Graph.current.getGraph();
            graph.addNode(name);

            //console.log({ x: opts != undefined ? opts.x : 50, y: opts != undefined ? opts.y : 50 });
            CY.add([
                { group: "nodes", data: { id: name }, position: { x: opts != undefined ? opts.x : 100, y: opts != undefined ? opts.y : 100 }, renderedPosition: { x: opts != undefined ? opts.x : 100, y: opts != undefined ? opts.y : 100 } }
            ]);
        },
        editNode: function (name: string) {
            var graph = App.Graph.current.getGraph();

            var node = graph.getNodeByName(App.Graph.selectedNodeName);
            if (node != null) {
                node.name = name;
            }
            var cyNode = CY.getElementById(App.Graph.selectedNodeName);
            cyNode.data('id', name);
            App.Graph.selectedNodeName = name;
        },
        removeNode: function () {
            var graph = App.Graph.current.getGraph();

        },

        createEdge: function (node1: string, node2: string, value: number) {
            var graph = App.Graph.current.getGraph();
            graph.addEdge(node1, node2, value);
            
            CY.add([
                { group: "edges", data: { id: "edge-" + node1 + node2, weight: value, source: node1, target: node2 } }
            ]);
        },
        editEdge: function (value: number) {
            var graph = App.Graph.current.getGraph();

            var cyEdge = CY.getElementById(App.Graph.selectedEdgeName);
            cyEdge.data('weight', value);

            var edge = graph.getEdgeByNames(cyEdge.data("source"), cyEdge.data("target"));
            if (edge != null) {
                edge.value = value;
            }
        },
        removeEdge: function () {
            var graph = App.Graph.current.getGraph();

        },

        onNodeClick: function (e) {
            var graph = App.Graph.current.getGraph();
            var id = e.data('id');

            //console.log('clicked ' + e.data('id'));

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

            //console.log('clicked ' + e.data('id'));

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

        processFile: function (content: string) {
            var matrix = [];

            var lines = content.split("\n");
            for (var i = 0; i < lines.length; i++) {
                matrix[i] = [];
                var line = lines[i].trim();
                var numbers = line.split(" ");
                for (var j = 0; j < numbers.length; j++) {
                    var number = parseFloat(numbers[j]);
                    matrix[i][j] = number;
                }
            }

            App.Graph.current.graph = new Algorithms.Graph(matrix);
            App.Graph.current.graph.orientated = false;
            App.Graph.current.graph.weighted = true;

            var g: Algorithms.Graph = App.Graph.current.graph;
            var cyData = [];

            for (var i = 0; i < g.nodesCount; i++) {
                var x = Math.floor((Math.random() * CY.width()) + 1);
                var y = Math.floor((Math.random() * CY.height()) + 1);

                var node = g.nodes[i];
                cyData.push({ group: "nodes", data: { id: node.name }, position: { x: x, y: y }, renderedPosition: { x: x, y: y } });
            }

            for (var i = 0; i < g.edges.length; i++) {
                var edge = g.edges[i];
                cyData.push({ group: "edges", data: { id: "edge-" + edge.source.name + edge.sink.name, weight: edge.value, source: edge.source.name, target: edge.sink.name } });
            }

            CY.add(cyData);
            CY.forceRender();
        },
    }
};

// Events
$(document).ready(function () {
    $("#node-create-edit-btn").on("click", function () {
        if (App.Graph.action == "create-node") {
            $('#node-create-edit-modal').modal('hide');
        } else if (App.Graph.action == "edit-node") {
            App.Graph.editNode($('#node-name-input').val());
            $('#node-create-edit-modal').modal('hide');
            App.Graph.action = null;
        }
    });
    $("#node-remove-btn").on("click", function () {
        App.Graph.removeNode();
    });

    $("#edge-create-edit-btn").on("click", function () {
        if (App.Graph.action == "create-edge") {
            $('#edge-create-edit-modal').modal('hide');
        } else if (App.Graph.action == "edit-edge") {
            App.Graph.editEdge(parseFloat($('#edge-value-input').val()));
            $('#edge-create-edit-modal').modal('hide');
            App.Graph.action = null;
        }
    });
    $("#edge-remove-btn").on("click", function () {
        App.Graph.removeEdge();
    });

    CY.on('click', 'node', function (evt) {
        if (App.Graph.action == "create-edge" && App.Graph.selectedNodeName != null) {
            App.Graph.createEdge(App.Graph.selectedNodeName, this.data('id'), parseFloat($('#edge-value-input').val()));
            App.Graph.action = null;
        }

        //console.log(this);

        App.Graph.onNodeClick(this);
    });
    CY.on('click', 'edge', function (evt) {
        App.Graph.onEdgeClick(this);
    });

    $('.settings-panel .nav-pills a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('.settings-panel .list-group.actions .list-group-item').click(function (e) {
        e.preventDefault();
        App.Graph.action = $(this).data('act');
        if (App.Graph.action == "create-node") {
            $('#node-name-input').val("");
        } else if (App.Graph.action == "create-edge") {
            $('#edge-value-input').val("");
        } else if (App.Graph.action == "edit-node") {
            var graph = App.Graph.current.getGraph();
            var node = graph.getNodeByName(App.Graph.selectedNodeName);
            if (node != null) {
                $('#node-name-input').val(node.name);
            }
        } else if (App.Graph.action == "edit-edge") {
            var graph = App.Graph.current.getGraph();
            var cyEdge = CY.getElementById(App.Graph.selectedEdgeName);
            $('#edge-value-input').val(cyEdge.data('weight'));
        }
    });

    CY.on('tap', function (event) {
        var evtTarget = event.cyTarget;
        if (evtTarget === CY) {
            //console.log('tap on background');
            
            if (App.Graph.action == "create-node") {
                //console.log(event.cyPosition);
                //console.log(CY.pan());
                App.Graph.createNode($('#node-name-input').val(), { x: event.cyPosition.x + CY.pan().x, y: event.cyPosition.y + CY.pan().y });
                App.Graph.action = null;
            }

        } else {
            //console.log('tap on some element');
        }
    });

    $('#node-name-input').on("change paste keyup", function () {
        App.Graph.createEditNodeName = $(this).val();
    });

    $('#edge-value-input').on("change paste keyup", function () {
        App.Graph.createEditEdgeName = $(this).val();
    });

    $('#algorithms .list-group.algorithms .prim').click(function (e) {
        e.preventDefault();
        App.Graph.algorithms.prim();
    });

    $('#algorithms .list-group.algorithms .kruscal').click(function (e) {
        e.preventDefault();
        App.Graph.algorithms.kruscal();
    });

    $('#algorithms .list-group.algorithms .hamiltonian').click(function (e) {
        e.preventDefault();
        App.Graph.algorithms.tsp();
    });

    $(document).on('change', '.btn-file :file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
            label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
        input.trigger('fileselect', [numFiles, label]);
    });

    $('#file-process').click(function (e) {
        e.preventDefault();

        var files = document.getElementById('file-graph').files;
        if (!files.length) {
            alert('Please select a file!');
            return;
        }

        var file = files[0];
        var start = 0;
        var stop = file.size - 1;

        var reader = new FileReader();

        // If we use onloadend, we need to check the readyState.
        reader.onloadend = function (evt) {
            if (evt.target.readyState == 2) {
                App.Graph.processFile(evt.target.result);
            }
        };

        var blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);
    });
});

$(document).ready(function () {
    
    // --------------------------------------------
    var g = new Algorithms.Graph();
    g.orientated = false;
    g.weighted = true;
    App.Graph.current.graph = g;

    //g.addNode("a");
    //g.addNode("b");
    //g.addNode("c");
    //g.addNode("d");
    //g.addNode("e");
    //g.addNode("f");

    //for (var k = 0; k < g.nodesCount; k++) {
    //    g.nodes[k].order = k;
    //}

    //g.addEdge("a", "b", 4);
    //g.addEdge("a", "f", 2);
    //g.addEdge("b", "f", 5);
    //g.addEdge("b", "c", 6);
    //g.addEdge("c", "f", 1);
    //g.addEdge("c", "d", 3);
    //g.addEdge("d", "e", 2);
    //g.addEdge("e", "f", 4);

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

    //console.log("Edges");
    //console.log(g.getEdges());
});

function highlightPath(edges: { source: string, target: string, weight: number }[], className: string) {
    var cyPath = [];

    for (var i = 0; i < edges.length; i++) {
        var edge = edges[i];

        var source = CY.getElementById(edge.source);
        if (cyPath.indexOf(source) < 0) {
            cyPath.push(source);
        }

        var sourceTargetEdge = CY.getElementById("edge-" + edge.target + edge.source);
        var targetSourceEdge = CY.getElementById("edge-" + edge.source + edge.target);

        if (sourceTargetEdge.length > 0 && targetSourceEdge.length > 0) {
            if (cyPath.indexOf(sourceTargetEdge) < 0 && cyPath.indexOf(targetSourceEdge) < 0) {
                cyPath.push(sourceTargetEdge);
            }
        } else if (sourceTargetEdge.length > 0) {
            cyPath.push(sourceTargetEdge);
        } else if (targetSourceEdge.length > 0) {
            cyPath.push(targetSourceEdge);
        }

        var target = CY.getElementById(edge.target);
        if (cyPath.indexOf(target) < 0) {
            cyPath.push(target);
        }
    }
    console.log(cyPath);
    var i = 0;
    var highlightNextElement = function () {
        if (i < cyPath.length) {
            cyPath[i].addClass(className);
            i++;
            setTimeout(highlightNextElement, 1000);
        } else {
            alert('Done!');
        }
    };
    highlightNextElement();
};