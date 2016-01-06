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
            .selector('.highlighted')
            .css({
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc',
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

        elements: {
            nodes: [
                { data: { id: '0' } },
                { data: { id: '1' } },
                { data: { id: '2' } },
                { data: { id: '3' } },
                { data: { id: '4' } },
                { data: { id: '5' } }
            ],

            edges: [
                { data: { id: '01', weight: 2, source: '0', target: '1' } },
                { data: { id: '03', weight: 1, source: '0', target: '3' } },
                { data: { id: '12', weight: 3, source: '1', target: '2' } },
                { data: { id: '23', weight: 5, source: '2', target: '3' } },
                { data: { id: '24', weight: 7, source: '2', target: '4' } },
                { data: { id: '34', weight: 6, source: '3', target: '4' } },
                { data: { id: '45', weight: 4, source: '4', target: '5' } }
            ]
        },

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