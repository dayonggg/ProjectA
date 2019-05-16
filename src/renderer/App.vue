<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'res'
	}
</script>

<style>
	/* CSS */
	html,
	body,
	#app {
		width: 100%;
		height: 100%;
		padding: 0px;
		margin: 0px;
		font-size: 14px;
		/* color: #ddd; */
		font-family: 'menlo', 'Consolas';
	}

	::-webkit-scrollbar {
		width: 8px;
	}

	::-webkit-scrollbar-thumb {
		border-radius: 4px;
		-webkit-box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.1);
		background: #DCDFE6;
	}
</style>
