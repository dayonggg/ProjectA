<template>
	<el-image :src="url" fit="none"></el-image>
</template>

<script>
	import path from 'path'
	
	export default {
		name: "image-tab",
		data() {
			return {
				url:'file://' + path.join(localStorage.getItem('resDir'), this.img.path, this.img.label)
			}
		},
		props: {
			img: Object
		},
		mounted() {
			console.log(this.url,this.img)
			// this.url = 'file://' + path.join(localStorage.getItem('resDir'), this.img.path, this.img.label)
		}
	};
	
</script>

<style>
</style>
