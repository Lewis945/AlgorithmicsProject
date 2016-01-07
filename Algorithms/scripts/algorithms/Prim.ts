module Algorithms.Prim {

    export function findMinimalSpanningTree(graph: Graph): any {
        var result = [];

        var source = []; // i-th element contains number of source vertex for the edge with the lowest cost from tree T to vertex i
        var dist = [];//i-th element contains weight of minimal edge connecting i with source[i] 
        var indicators = [];  //if true, vertex i is in tree T

        // Mark all vertices as NOT being in the minimum spanning tree
        for (var i = 0; i < graph.nodesCount; i++)
        {
            indicators[i] = false;
            dist[i] = Number.MAX_VALUE;
        }

        //we start with vertex number 0
        indicators[0] = true;
        dist[0] = 0;
        var bestNeighbour = 0;// lastly added vertex to the tree T 
        var minDist;

        for (var i = 0; i < graph.nodesCount - 1; i++)
        {
            minDist = Number.MAX_VALUE;

            for (var j = 0; j < graph.nodesCount; j++) // fill dist[] based on distance to bestNeighbour vertex
            {
                if (!indicators[j]) {
                    var weight = graph.adjacencyMatrix[bestNeighbour][j];

                    if (weight < dist[j]) {
                        source[j] = bestNeighbour;
                        dist[j] = weight;
                    }
                }
            }

            for (var j = 0; j < graph.nodesCount; j++) // find index of min in dist[]
            {
                if (!indicators[j]) {
                    if (dist[j] < minDist) {
                        bestNeighbour = j;
                        minDist = dist[j];
                    }
                }
            }

            if (bestNeighbour != 0) {//add the edge (bestNeighbour, dist[bestNeighbour]) to tree T
                var sourceNode = graph.nodes[source[bestNeighbour]];
                var sinkNode = graph.nodes[bestNeighbour];

                result.push({ source: sourceNode.name, target: sinkNode.name, weight: dist[bestNeighbour] });
                indicators[bestNeighbour] = true;
            }

        }

        return result;
    };
}