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
			graphStore.loadGraphFromBeansObject(beans);
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
	graphStore.loadGraphFromBeansObject(beans);
};
</script>

<template>
	<!-- グラフ読み込み操作 -->
	<div>
		<h3>
			beansの依存関係の読み込み
		</h3>
		<ul>
			<li>
				<input type="file" @change="handleFileUpload" accept=".json"/>
			</li>
			<li>
				<button @click="onCall">API呼び出し(localhost:8080/actuator/beans)</button>
			 </li>
			 <li>
				<button @click="graphStore.loadExampleGraph">サンプルの依存関係の読み込み</button>
			 </li>
		</ul>
	</div>
	<div>
		<h3>グラフ操作</h3>
	</div>
	<button @click="graphStore.layout('TB')">TB layout</button>
	<button @click="graphStore.layout('LR')">LR layout</button>
	<button @click="graphStore.clearGraph">clear</button>
</template>