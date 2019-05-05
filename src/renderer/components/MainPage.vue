<template>
	<el-container class="main-page">
		<el-header>Header</el-header>
		<el-container>
			<el-aside width="200px">
				<f-tree></f-tree>
			</el-aside>
			<el-main>Main</el-main>
		</el-container>
	</el-container>
</template>

<script>
	import FTree from './FTree'
	
	export default {
		name:"main-page",
		components: {FTree},
		methods: {
			test:function(){
				console.log(FTree.data);
			}
		},
	}
</script>

<style>
	.main-page{
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
		border: none;
	}
	.main-page>.el-container{
		height: calc(100%-60px);
	}
	.main-page>.el-header{
		background-color: #3c3f3e;
	}
	.main-page>.el-container>.el-aside{
		background-color: #29292a;
		
	}
	.main-page>.el-container>.el-main{
		padding: 10px;
		background-color: #232424;
	}
</style>
