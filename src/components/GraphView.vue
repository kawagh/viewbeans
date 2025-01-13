<script setup lang="ts">
import { VNetworkGraph } from "v-network-graph";
import { useGraphStore } from "@/stores/graph";
import type BeanMetaData from "@/types/BeanMetadata";
const graphStore = useGraphStore();

const onCall = async () => {
	const response = await fetch("http://localhost:8080/actuator/beans");
	const data = await response.json();
	console.log(data["contexts"]["application"]["beans"]);
	const beans = data["contexts"]["application"]["beans"];
	Object.entries(beans).forEach((bean, index) => {
		// console.log(index);
		const beanName = bean[0];
		const beanMetaData: BeanMetaData = bean[1] as BeanMetaData;
		// console.log(beanName);
		// console.log(beanMetaData);
	});
	graphStore.loadGraphFromApiResponse(beans);
};
</script>

<template>
	<button @click="onCall">call</button>
	<button @click="graphStore.layout('TB')">TB layout</button>
	<button @click="graphStore.layout('LR')">LR layout</button>
	<button @click="graphStore.loadGraph">load</button>
	<button @click="graphStore.clearGraph">clear</button>
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