import { defineStore } from "pinia";
import * as vNG from "v-network-graph";
import { reactive } from "vue";
import type BeanMetadata from "@/types/BeanMetadata";
// @ts-ignore
import dagre from "dagre/dist/dagre.min.js";

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

	const configs: vNG.Config = vNG.defineConfigs({
		edge: {
			marker: {
				target: {
					type: "arrow",
				},
			},
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

	const loadGraphFromApiResponse = (data: { [key: string]: BeanMetadata }) => {
		clearGraph();
		for (const item of Object.entries(data)) {
			const name = item[0] as string;
			const dependencies = item[1].dependencies;
			console.log("type", item[1].type);
			const type = item[1].type;

			if (!name.includes(".") && type.includes("kawagh")) {
				nodes[name] = { name: name };
			}

			if (dependencies) {
				console.log(dependencies);
				for (const to of dependencies) {
					if (!String(to).includes(".")) {
						const edgeName = `${name}_${to}`;
						edges[edgeName] = { source: name, target: to };
					}
				}
			}
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

	const layout = (direction: "TB" | "LR") => {
		const nodeSize = 40;
		// convert graph
		// ref: https://github.com/dagrejs/dagre/wiki
		const g = new dagre.graphlib.Graph();
		// Set an object for the graph label
		g.setGraph({
			rankdir: direction,
			nodesep: nodeSize * 2,
			edgesep: nodeSize,
			ranksep: nodeSize * 2,
		});
		// Default to assigning a new object as a label for each new edge.
		g.setDefaultEdgeLabel(() => ({}));

		// Add nodes to the graph. The first argument is the node id. The second is
		// metadata about the node. In this case we're going to add labels to each of
		// our nodes.
		Object.entries(nodes).forEach(([nodeId, node]) => {
			g.setNode(nodeId, {
				label: node.name,
				width: nodeSize,
				height: nodeSize,
			});
		});

		// Add edges to the graph.
		Object.values(edges).forEach((edge) => {
			g.setEdge(edge.source, edge.target);
		});

		dagre.layout(g);

		g.nodes().forEach((nodeId: string) => {
			// update node position
			const x = g.node(nodeId)?.x;
			const y = g.node(nodeId)?.y;
			if (x && y) {
				layouts.nodes[nodeId] = { x, y };
			}
		});
	};

	return {
		nodes,
		edges,
		layouts,
		configs,
		loadGraph,
		clearGraph,
		loadGraphFromApiResponse,
		layout,
	};
});
