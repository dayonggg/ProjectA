<template>
	<div>
		<div id="ss"></div>
	</div>
</template>

<script>
	import Bus from './Bus'
	import Common from './js/common.js'

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
			var xt =new Spreadsheet(this.$el);
		},
		methods: {}
	}
</script>

<style>
</style>
