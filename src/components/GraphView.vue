<script setup lang="ts">
import { VNetworkGraph, type VNetworkGraphInstance } from "v-network-graph";
import { useGraphStore, type TreeNode } from "@/stores/graph";
import { ref } from "vue";
import { computed } from "vue";
import type { ComputedRef } from "vue";

const searchQuery = ref("");
const graphStore = useGraphStore();
const graphInstance = ref<VNetworkGraphInstance>();
const focusToSpecificNode = (nodeId: string) => {
	graphInstance.value?.setViewBox({
		left: graphStore.layouts.nodes[nodeId].x - 500,
		right: graphStore.layouts.nodes[nodeId].x + 500,
		top: graphStore.layouts.nodes[nodeId].y - 500,
		bottom: graphStore.layouts.nodes[nodeId].y + 500,
	});
};

const queryRelatedNodes: ComputedRef<TreeNode[]> = computed(() => {
	return Object.values(graphStore.nodes).filter((node) =>
		node.name?.includes(searchQuery.value),
	);
});
</script>

<template>
	<div style="display: flex;">
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

		<div v-if="Object.values(graphStore.nodes).length != 0">
			<input
				type="text"
				v-model="searchQuery"
				placeholder="Beanの絞り込み"
			/>

			<div v-if="searchQuery.length != 0">
				<div v-if="queryRelatedNodes.length != 0"> {{ queryRelatedNodes.length }}個のBeanが見つかりました</div>
				<div v-else>{{ searchQuery}}を含むBeanは見つかりませんでした </div>
			</div>
			<div v-else>{{ Object.values(graphStore.nodes).length }}個のBean</div>
			<ul>
				<li v-for="(item, _) in queryRelatedNodes" :key="item.name">
					<div style="display: flex; justify-content: space-between;">
						<div> {{ item.name }} </div>
						<button @click="focusToSpecificNode(item.name!)">focus</button>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<style scoped>
.graph {
	width: 90vw;
	height: 70vh;
	border: 1px solid;
}
</style>