<script setup lang="ts">
import { VNetworkGraph, type VNetworkGraphInstance } from "v-network-graph";
import { useGraphStore } from "@/stores/graph";
import { ref } from "vue";
const graphStore = useGraphStore();
const graphInstance = ref<VNetworkGraphInstance>();
const focusToSpecificNode = (nodeId: string) => {
	graphStore.layouts.nodes.ExampleService.x;
	graphInstance.value?.setViewBox({
		left: graphStore.layouts.nodes[nodeId].x - 500,
		right: graphStore.layouts.nodes[nodeId].x + 500,
		top: graphStore.layouts.nodes[nodeId].y - 500,
		bottom: graphStore.layouts.nodes[nodeId].y + 500,
	});
};
</script>

<template>
	<button @click="focusToSpecificNode('ExampleService')">focus</button>
	<v-network-graph 
		class="graph"
		ref="graphInstance"
		:nodes="graphStore.nodes"
		:edges="graphStore.edges"
		:layouts="graphStore.layouts"
		:configs="graphStore.configs"
		:event-handlers=graphStore.eventHandlers
	>
	</v-network-graph>
</template>

<style scoped>
.graph {
	width:99vw;
	height: 80vh;
	border: 1px solid;
}
</style>