<template>
	<div>{{config.content}}</div>
</template>

<script>
	import Bus from './Bus'

	export default {
		name: "config-tab",
		data() {
			return {}
		},
		props: {
			config: Object
		},
		mounted() {
			Bus.$on('open-config', content => {
				this.addTab(content)
			})
			console.log(this.table)
		},
		methods: {}
	}
</script>

<style>
</style>
