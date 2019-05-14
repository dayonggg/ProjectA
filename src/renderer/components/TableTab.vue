<template>
	<div>1243</div>
</template>

<script>
	import Bus from './Bus'

	export default {
		name: "table-tab",
		data() {
			return {}
		},
		props: {
			table: Object
		},
		mounted() {
			Bus.$on('open-excel', content => {
				this.addTab(content)
			})
			console.log(this.table)
		},
		methods: {}
	}
</script>

<style>
</style>
