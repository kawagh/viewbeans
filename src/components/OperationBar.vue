<script setup lang="ts">
import { useGraphStore } from "@/stores/graph";
import type BeanMetaData from "@/types/BeanMetadata";
const graphStore = useGraphStore();


const handleFileUpload = (event) => {
	const uploadedFile = event.target.files[0];
	if (uploadedFile && uploadedFile.type === "application/json") {
		const reader = new FileReader();
		reader.onload = (e) => {
			const jsondata = JSON.parse(e.target.result);
			console.log(jsondata);
			const beans = jsondata["contexts"]["application"]["beans"];
			graphStore.loadGraphFromApiResponse(beans);
			console.log(jsondata);
		};
		reader.readAsText(uploadedFile);
	}
};

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
    <div>
      <input type="file" @change="handleFileUpload" accept=".json"/>
    </div>
	<button @click="onCall">call</button>
	<button @click="graphStore.layout('TB')">TB layout</button>
	<button @click="graphStore.layout('LR')">LR layout</button>
	<button @click="graphStore.loadGraph">load</button>
	<button @click="graphStore.clearGraph">clear</button>
</template>