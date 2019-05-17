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
			console.log(this.table)
		},
		methods: {}
	}
</script>

<style>
</style>
