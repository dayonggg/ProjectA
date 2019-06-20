<template>
	<el-image :src="url" fit="none"></el-image>
</template>

<script>
	export default {
		name: "image-tab",
		data() {
			return {
				url: 'file://' + this.img.file
			}
		},
		props: {
			img: Object
		}
	};
</script>

<style>
</style>
