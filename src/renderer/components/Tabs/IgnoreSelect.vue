<template>
	<el-select v-model="s" multiple placeholder="请选择" size="small">
		<el-option v-for="item in list" :key="item" :label="item" :value="item">
		</el-option>
	</el-select>
</template>

<script>
	import Bus from '../Bus'
	import table from '../table.js'

	export default {
		name: "ignore-select",
		data() {
			return {
				list: [],
				s: []
			}
		},
		props: {
			itype: Boolean,
			tablename: String,
			selected: Array
		},
		mounted() {
			this.s = this.selected
			this.list = table.getKey(this.tablename)
		},
		methods: {},
		watch: {
			s: {
				handler(val, oldVal) {
					Bus.$emit('updataIgnore',{
						tablename:this.tablename,
						type:this.itype,
						ignore:val
					})
				},
				deep: true
			}
		}
	}
</script>

<style>
</style>
