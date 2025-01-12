<script setup lang="ts">
import { VNetworkGraph } from "v-network-graph";
import { useGraphStore } from "@/stores/graph";
const graphStore = useGraphStore();
</script>

<template>
	<button @click="graphStore.loadGraph">load</button>
	<button @click="graphStore.clearGraph">clear</button>
	<v-network-graph class="graph" :nodes="graphStore.nodes" :edges="graphStore.edges" :layouts="graphStore.layouts"/>
</template>

<style scoped>
.graph {
	width:800px;
	height: 600px;
	border: 1px solid;
}
</style>