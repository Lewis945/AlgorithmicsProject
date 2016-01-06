module Algorithms {
    export class _Kruskal {

        private graph: Graph;

        private edges: Edge[] = [];
        private visited: number[] = [];
        private spanningTree: number[] = [];

        constructor(graph: Graph) {
            this.graph = graph;
        }

        findMinimalSpanningTree(): any {
            var adjacencyMatrix = this.graph.getAdjacencyMatrix().slice();
            console.log(adjacencyMatrix);

            var finished = false;

            var sortedEdges: Edge[] = this.graph.getEdges().sort((edge1, edge2) => {
                if (edge1.value > edge2.value) {
                    return 1;
                }

                if (edge1.value < edge2.value) {
                    return -1;
                }

                return 0;
            });

            for (var edge in sortedEdges) {
                this.spanningTree[edge.sorce][edge.sink] = edge.value;
                this.spanningTree[edge.sink][edge.sorce] = edge.value;

                if (checkCycle.checkCycle(this.spanningTree, edge.sorce)) {
                    this.spanningTree[edge.sorce][edge.sink] = 0;
                    this.spanningTree[edge.sink][edge.sorce] = 0;
                    edge.value = -1;
                    continue;
                }

                this.visited[edge.sorce] = 1;
                this.visited[edge.sink] = 1;

                for (var i = 0; i < this.visited.length; i++)
                {
                    if (this.visited[i] == 0) {
                        finished = false;
                        break;
                    } else {
                        finished = true;
                    }
                }

                if (finished) {
                    break;
                }
            }
        }

        checkCycle(spanningTreeMatrix: number[][], source: number): any {
            var cyclepresent = false;
            var number_of_nodes = this.graph.nodesCount - 1;

            var adjacencyMatrix = [];
            for (var i = 1; i <= number_of_nodes; i++)
            {
                for (var j = 1; j <= number_of_nodes; j++)
                {
                    adjacencyMatrix[i][j] = spanningTreeMatrix[i][j];
                }
            }

            var visited = [];

            var element = source;
            var i = source;

            visited[source] = 1;
            stack.push(source);

            while (!stack.isEmpty()) {
                element = stack.peek();
                i = element;
                while (i <= number_of_nodes) {
                    if (adjacencyMatrix[element][i] >= 1 && visited[i] == 1) {
                        if (stack.contains(i)) {
                            cyclepresent = true;
                            return cyclepresent;
                        }
                    }
                    if (adjacencyMatrix[element][i] >= 1 && visited[i] == 0) {
                        stack.push(i);
                        visited[i] = 1;
                        adjacencyMatrix[element][i] = 0;// mark as labelled;
                        adjacencyMatrix[i][element] = 0;
                        element = i;
                        i = 1;
                        continue;
                    }
                    i++;
                }
                stack.pop();
            }
            return cyclepresent;
        }
    }
}