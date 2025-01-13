<script setup lang="ts">
import { VNetworkGraph } from "v-network-graph";
import { useGraphStore } from "@/stores/graph";
const graphStore = useGraphStore();

</script>

<template>
	<v-network-graph 
	class="graph" 
	:nodes="graphStore.nodes" 
	:edges="graphStore.edges" 
	:layouts="graphStore.layouts" 
	:configs="graphStore.configs"
	:event-handlers=graphStore.eventHandlers
	/>
</template>

<style scoped>
.graph {
	width:99vw;
	height: 80vh;
	border: 1px solid;
}
</style>