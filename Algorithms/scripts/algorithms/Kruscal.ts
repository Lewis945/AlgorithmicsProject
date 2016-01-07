module Algorithms {
    export class Kruskal {
        private graph: Graph;

        public edges: { source: string, target: string, weight: number }[] = [];
        public total: number = 0;

        constructor(graph: Graph) {
            this.graph = graph;
        }

        // A utility function to find set of an element i
        // (uses path compression technique)
        find(subsets: any[], i: number): number {
            // find root and make root as parent of i (path compression)
            if (subsets[i].parent != i) {
                subsets[i].parent = this.find(subsets, subsets[i].parent);
            }
            return subsets[i].parent;
        }
 
        // A function that does union of two sets of x and y
        // (uses union by rank)
        union(subsets: any[], x: number, y: number) {
            var xroot = this.find(subsets, x);
            var yroot = this.find(subsets, y);
 
            // Attach smaller rank tree under root of high rank tree
            // (Union by Rank)
            if (subsets[xroot].rank < subsets[yroot].rank) {
                subsets[xroot].parent = yroot;
            } else if (subsets[xroot].rank > subsets[yroot].rank) {
                subsets[yroot].parent = xroot;
            }
 
            // If ranks are same, then make one as root and increment
            // its rank by one
            else {
                subsets[yroot].parent = xroot;
                subsets[xroot].rank++;
            }
        }
        
        // The main function to construct MST using Kruskal's algorithm
        findMinimalSpanningTree(): any {
            // Step 1:  Sort all the edges in non-decreasing order of their
            // weight.  If we are not allowed to change the given graph, we
            // can create a copy of array of edges
            var sortedEdges = this.graph.edges.sort((a: Edge, b: Edge) => {
                if (a.value < b.value) {
                    return -1;
                } else if (a.value > b.value) {
                    return 1;
                }
                // a должно быть равным b
                return 0;
            });
            
            // Allocate memory for creating V ssubsets
            var subsets = [];
 
            // Create V subsets with single elements
            for (var v = 0; v < this.graph.nodesCount; v++) {
                subsets[v] = {
                    parent: v,
                    rank: 0
                };
            }

            var e = 0;  // An index variable, used for result[]
            var i = 0;  // An index variable, used for sorted edges
 
            // Number of edges to be taken is equal to V-1
            while (e < this.graph.nodesCount - 1) {
                // Step 2: Pick the smallest edge. And increment the index
                // for next iteration
                var nextEdge = sortedEdges[i++];
                var x = this.find(subsets, nextEdge.source.order);
                var y = this.find(subsets, nextEdge.sink.order);
 
                // If including this edge does't cause cycle, include it
                // in result and increment the index of result for next edge
                if (x != y) {
                    this.edges[e++] = { source: nextEdge.source.name, target: nextEdge.sink.name, weight: nextEdge.value };
                    this.union(subsets, x, y);
                }
                // Else discard the nextEdge
            }
        }
    }
}