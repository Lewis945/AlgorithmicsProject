module Algorithms {
    export class Kruskal {
        private graph: Graph;

        private vertexGroups = [];

        public edges: Edge[] = [];
        public total: number = 0;

        constructor(graph: Graph) {
            this.graph = graph;
        }

        private getVertexGroup(nodeName: string): string[] {
            for (var i = 0; i < this.vertexGroups.length; i++) {
                if (this.vertexGroups[i].indexOf(nodeName) > -1) {
                    return this.vertexGroups[i];
                }
            }
            
            return null;
        }

        /**
         * The edge to be inserted has 2 vertices - A and B
         * We maintain a vector that contains groups of vertices.
         * We first check if either A or B exists in any group
         * If neither A nor B exists in any group
         *     We create a new group containing both the vertices.
         * If one of the vertices exists in a group and the other does not
         *     We add the vertex that does not exist to the group of the other vertex
         * If both vertices exist in different groups
         *     We merge the two groups into one
         * All of the above scenarios mean that the edge is a valid Kruskal edge
         * In that scenario, we will add the edge to the Kruskal edges    
         * However, if both vertices exist in the same group
         *     We do not consider the edge as a valid Kruskal edge
         */
        private insertEdge(edge: Edge) {
            var vertexGroupA = this.getVertexGroup(edge.source.name);
            var vertexGroupB = this.getVertexGroup(edge.sink.name);

            if (vertexGroupA == null) {
                this.edges.push(edge);
                if (vertexGroupB == null) {
                    var htNewVertexGroup = [];
                    htNewVertexGroup.push(edge.source.name);
                    htNewVertexGroup.push(edge.sink.name);
                    this.vertexGroups.push(htNewVertexGroup);
                }
                else {
                    vertexGroupB.push(edge.source.name);
                }
            }
            else {
                if (vertexGroupB == null) {
                    vertexGroupA.push(edge.sink.name);
                    this.edges.push(edge);
                }
                else if (vertexGroupA != vertexGroupB) {
                    Array.prototype.push.apply(vertexGroupA, vertexGroupB);

                    // remove vertexGroupB form vertexGroups
                    var index = this.vertexGroups.indexOf(vertexGroupB);
                    if (index > -1) {
                        this.vertexGroups.splice(index, 1);
                    }

                    this.edges.push(edge);
                }
            }
        }

        findMinimalSpanningTree(): any {
            var edges = this.graph.getEdges();
            for (var i = 0; i < edges.length; i++) {
                this.insertEdge(edges[i]);
            }

            this.total = 0;
            for (var i = 0; i < this.edges.length; i++) {
                this.total += this.edges[i].value;
            }
        }
    }
}