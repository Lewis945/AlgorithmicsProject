module Algorithms.Prim {

    // A utility function to find the vertex with minimum key
    // value, from the set of vertices not yet included in MST
    function minKey(nodesCount: number, key: number[], mstSet: boolean[]): number {
        // Initialize min value
        var min = Number.MAX_VALUE;
        var minIndex = -1;

        for (var v = 0; v < nodesCount; v++)
            if (mstSet[v] == false && key[v] < min) {
                min = key[v];
                minIndex = v;
            }

        return minIndex;
    }

    export function findMinimalSpanningTree(graph: Graph): any {
        var adjacencyMatrix = graph.getAdjacencyMatrix().slice();
        console.log(adjacencyMatrix);
        // Array to store constructed MST
        var parent = [];
 
        // Key values used to pick minimum weight edge in cut
        var key = [];
 
        // To represent set of vertices not yet included in MST
        var mstSet = [];
 
        // Initialize all keys as INFINITE
        for (var i = 0; i < graph.nodesCount; i++) {
            key[i] = Number.MAX_VALUE;
            mstSet[i] = false;
        }
 
        // Always include first 1st vertex in MST.
        key[0] = 0;     // Make key 0 so that this vertex is
        // picked as first vertex
        parent[0] = -1; // First node is always root of MST
 
        // The MST will have V vertices
        for (var count = 0; count < graph.nodesCount - 1; count++) {
            // Pick thd minimum key vertex from the set of vertices
            // not yet included in MST
            var u = minKey(graph.nodesCount, key, mstSet);
 
            // Add the picked vertex to the MST Set
            mstSet[u] = true;
 
            // Update key value and parent index of the adjacent
            // vertices of the picked vertex. Consider only those
            // vertices which are not yet included in MST
            for (var v = 0; v < graph.nodesCount; v++) {
                // graph[u][v] is non zero only for adjacent vertices of m
                // mstSet[v] is false for vertices not yet included in MST
                // Update the key only if graph[u][v] is smaller than key[v]
                if (adjacencyMatrix[u][v] != 0 && mstSet[v] == false && adjacencyMatrix[u][v] < key[v]) {
                    parent[v] = u;
                    key[v] = adjacencyMatrix[u][v];
                }
            }
        }

        var t = [];
        for (var i = 1; i < graph.nodesCount; i++) {
            t.push(parent[i] + " - " + i + "    " + adjacencyMatrix[i][parent[i]]);
        }

        return t;
    }
}