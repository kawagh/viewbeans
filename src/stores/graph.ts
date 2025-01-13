import { defineStore } from "pinia";
import * as vNG from "v-network-graph";
import { reactive } from "vue";
import type BeanMetadata from "@/types/BeanMetadata";
// @ts-ignore
import dagre from "dagre/dist/dagre.min.js";
import { ForceLayout } from "v-network-graph/lib/force-layout";

export interface TreeNode extends vNG.Node {
	children?: string[];
}
export type TreeNodes = Record<string, TreeNode>;

export const useGraphStore = defineStore("graph", () => {
	const nodes: TreeNodes = reactive({});

	const edges: vNG.Edges = reactive({});

	const layouts: vNG.Layouts = reactive({
		nodes: {
			node1: { x: 0, y: 0 },
			node2: { x: 50, y: 50 },
			node3: { x: 100, y: 0 },
			node4: { x: 150, y: 50 },
		},
	});

	const configs: vNG.Config = vNG.defineConfigs<TreeNode>({
		view: {
			layoutHandler: new ForceLayout(),
		},
		node: {
			normal: {
				color: (node) => (node.name?.includes("deleted") ? "red" : "blue"),
			},
		},
		edge: {
			marker: {
				target: {
					type: "arrow",
				},
			},
		},
	});

	const eventHandlers: vNG.EventHandlers = {
		"node:click": ({ node }) => {
			traverseNodes(node);
		},
	};
	const traverseNodes = (nodeId: string) => {
		const chidlren = nodes[nodeId]?.children;
		if (chidlren === undefined) {
			return;
		}
		for (const node of Object.entries(chidlren)) {
			if (nodes[node[1]] !== undefined) {
				traverseNodes(node[1]);
				nodes[node[1]].name = "deleted";

				// delete nodes
				// delete nodes[node[1]];
			}
		}
	};

	const clearGraph = () => {
		for (const edge of Object.keys(edges)) {
			delete edges[edge];
		}
		for (const node of Object.keys(nodes)) {
			delete nodes[node];
		}
	};

	const loadGraphFromBeansObject = (data: { [key: string]: BeanMetadata }) => {
		clearGraph();
		for (const item of Object.entries(data)) {
			const name = item[0] as string;
			const dependencies = item[1].dependencies;
			console.log("type", item[1].type);
			const type = item[1].type;

			if (!name.includes(".")) {
				nodes[name] = { name: name, children: dependencies };
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

	const loadExampleGraph = () => {
		clearGraph();
		nodes.ExampleController = {
			name: "ExampleController",
			children: ["ExampleService"],
		};
		nodes.ExampleService = {
			name: "ExampleService",
			children: ["ExampleRepository", "ExternalApi"],
		};
		nodes.ExternalApi = {
			name: "ExternalApi",
		};
		nodes.ExampleRepository = {
			name: "ExampleRepository",
			children: ["ExampleMapper"],
		};
		nodes.ExampleMapper = { name: "ExampleMapper" };

		// add edges from TreeNode.children
		for (const node of Object.entries(nodes)) {
			const children = node[1].children;
			if (children === undefined) {
				continue;
			}
			for (const child of children) {
				console.log(node, child);
				const edgeName = `${node[0]}_${child}`;
				edges[edgeName] = { source: node[0], target: child };
			}
		}
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
		for (const [nodeId, node] of Object.entries(nodes)) {
			g.setNode(nodeId, {
				label: node.name,
				width: nodeSize,
				height: nodeSize,
			});
		}

		// Add edges to the graph.
		for (const edge of Object.values(edges)) {
			g.setEdge(edge.source, edge.target);
		}
		dagre.layout(g);

		for (const nodeId of g.nodes()) {
			// update node position
			const x = g.node(nodeId)?.x;
			const y = g.node(nodeId)?.y;
			if (x && y) {
				layouts.nodes[nodeId] = { x, y };
			}
		}
	};

	return {
		nodes,
		edges,
		layouts,
		configs,
		eventHandlers,
		loadExampleGraph,
		clearGraph,
		loadGraphFromBeansObject,
		layout,
	};
});
