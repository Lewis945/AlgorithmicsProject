var CY = null;

var optionsCY

$(function () {
    optionsCY = {
        container: document.getElementById('cy'),

        boxSelectionEnabled: false,
        autounselectify: true,
        wheelSensitivity: 0.1,

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(id)',
                "text-valign": "center",
                "text-halign": "center"
            })
            .selector('edge')
            .css({
                'content': 'data(weight)',
                'width': 4,
                'line-color': '#ddd',
                'target-arrow-color': '#ddd'
            })
            .selector('.mst')
            .css({
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            })
            .selector('.tsp')
            .css({
                'background-color': 'green',
                'line-color': 'green',
                'target-arrow-color': 'green',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            })
            .selector('.selected')
            .css({
                'background-color': 'red',
                'line-color': 'red',
                'target-arrow-color': 'red',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }),

        //elements: {
        //    nodes: [
        //        { data: { id: 'a' } },
        //        { data: { id: 'b' } },
        //        { data: { id: 'c' } },
        //        { data: { id: 'd' } },
        //        { data: { id: 'e' } }
        //    ],

        //    edges: [
        //        { data: { id: 'ae', weight: 1, source: 'a', target: 'e' } },
        //        { data: { id: 'ab', weight: 3, source: 'a', target: 'b' } },
        //        { data: { id: 'be', weight: 4, source: 'b', target: 'e' } },
        //        { data: { id: 'bc', weight: 5, source: 'b', target: 'c' } },
        //        { data: { id: 'ce', weight: 6, source: 'c', target: 'e' } },
        //        { data: { id: 'cd', weight: 2, source: 'c', target: 'd' } },
        //        { data: { id: 'de', weight: 7, source: 'd', target: 'e' } }
        //    ]
        //},

        //elements: {
        //    nodes: [
        //        { data: { id: 'a' } },
        //        { data: { id: 'b' } },
        //        { data: { id: 'c' } },
        //        { data: { id: 'd' } },
        //        { data: { id: 'e' } },
        //        { data: { id: 'f' } }
        //    ],

        //    edges: [
        //        { data: { id: 'edge-ab', weight: 4, source: 'a', target: 'b' } },
        //        { data: { id: 'edge-af', weight: 2, source: 'a', target: 'f' } },
        //        { data: { id: 'edge-bf', weight: 5, source: 'b', target: 'f' } },
        //        { data: { id: 'edge-bc', weight: 6, source: 'b', target: 'c' } },
        //        { data: { id: 'edge-cf', weight: 1, source: 'c', target: 'f' } },
        //        { data: { id: 'edge-cd', weight: 3, source: 'c', target: 'd' } },
        //        { data: { id: 'edge-de', weight: 2, source: 'd', target: 'e' } },
        //        { data: { id: 'edge-ef', weight: 4, source: 'e', target: 'f' } }
        //    ]
        //},

        layout: {
            name: 'breadthfirst',
            directed: false,
            fit: false,
            //roots: '#a',
            padding: 10,
            ready: function () {
                //$('#cy > div').height($('.cy-container').height() + 30);
            }
        }
    };

    CY = cytoscape(optionsCY);

    CY.zoom({
        level: 1.0,
        position: { x: 600, y: 350 }
    });
    CY.zoomingEnabled(false);

    //cy.on('tap', 'node', function (e) {
    //    var node = e.cyTarget;
    //    var directlyConnected = node.neighborhood();
    //    directlyConnected.nodes().addClass('connectednodes');

    //});

    //cy.getElementById('d').addClass('highlighted');;
    //cy.getElementById('de').addClass('highlighted');;
    //cy.getElementById('e').addClass('highlighted');;

    //cy.destroy();
    //cy = cytoscape(options);

    //cy.on('click', 'node', function (evt) {
    //    console.log('clicked ' + this.data('id'));
    //});

    //cy.on('click', 'edge', function (evt) {
    //    console.log('clicked ' + this.data('id'));
    //});

    //var bfs = cy.elements().bfs('#a', function () { }, true);

    //var i = 0;
    //var highlightNextEle = function () {
    //    if (i < bfs.path.length) {
    //        bfs.path[i].addClass('highlighted');

    //        i++;
    //        setTimeout(highlightNextEle, 1000);
    //    }
    //};

    //// kick off first highlight
    //highlightNextEle();

    $('#cy > div').height($('.cy-container').height() + 30);
    $('#cy > div').css('padding-left', 16);
    $('#cy > div').width($('#cy > div').width() - 16);

});

function setDirectedCY() {
    optionsCY.layout.directed = true;
    optionsCY.style
        .selector('edge')
        .css({
            'target-arrow-shape': 'triangle',
        });
};

function setUnDirectedCY() {
    optionsCY.layout.directed = false;
    optionsCY.style
        .selector('edge')
        .css({
            'target-arrow-shape': 'none',
        });
};

function refreshCY(opts) {
    CY.destroy();

    if (opts.directed) {
        setDirectedCY();
    } else {
        setUnDirectedCY();
    }

    CY = cytoscape(optionsCY);
};