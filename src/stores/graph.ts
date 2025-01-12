import { defineStore } from "pinia";
import type * as vNG from "v-network-graph";
import { reactive } from "vue";

export const useGraphStore = defineStore("graph", () => {
	const nodes: vNG.Nodes = reactive({});

	const edges: vNG.Edges = reactive({});

	const layouts: vNG.Layouts = reactive({
		nodes: {
			node1: { x: 0, y: 0 },
			node2: { x: 50, y: 50 },
			node3: { x: 100, y: 0 },
			node4: { x: 150, y: 50 },
		},
	});

	const clearGraph = () => {
		for (const edge of Object.keys(edges)) {
			delete edges[edge];
		}
		for (const node of Object.keys(nodes)) {
			delete nodes[node];
		}
	};

	const loadGraph = () => {
		clearGraph();
		nodes["node1"] = { name: "Node 1" };
		nodes["node2"] = { name: "Node 2" };
		nodes["node3"] = { name: "Node 3" };
		nodes["node4"] = { name: "Node 4" };

		edges["edge1"] = { source: "node1", target: "node2" };
		edges["edge2"] = { source: "node2", target: "node3" };
		edges["edge3"] = { source: "node3", target: "node4" };
	};

	return { nodes, edges, layouts, loadGraph, clearGraph };
});
