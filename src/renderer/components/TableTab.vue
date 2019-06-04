<template>
	<hot-table :settings="hotSettings" width="100%" height="100%" licenseKey="non-commercial-and-evaluation"></hot-table>
</template>

<script>
	import Bus from './Bus'
	import Handsontable from 'handsontable'
	import HotTable from '@handsontable/vue'
	import table from './table.js'

	export default {
		name: "table-tab",
		data() {
			return {
				data: {},
				hotSettings: {
					colHeaders: this.getHeader(), //当值为true时显示行头，当值为数组时，行头为数组的值
					columns: this.getColumns(), //设置列数据类型，项目只提供text和numeric
					rowHeaders: true,
					stretchH: 'all', //根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展,all:全部扩展
					data: this.getData(), //表格数据
					minRows: 20, //最小显示行数
					// fixedRowsTop:3,//锁定行数
					autoColumnSize: true, //当值为true且列宽未设置时，自适应列大小
					contextMenu: { //自定义右键菜单，可汉化，默认布尔值
						items: {
							"row_above": {
								name: '上方插入一行'
							},
							"row_below": {
								name: '下方插入一行'
							},
							"hsep1": "---------", //提供分隔线
							"remove_row": {
								name: '删除行',
							},
						}
					},
				},
			}
		},
		components: {
			HotTable
		},
		props: {
			target: Object
		},
		mounted() {
			
		},
		methods: {
			getColumns() {
				return table.tableDatas[this.target.label].header.dataType
			},
			getHeader() {
				return table.tableDatas[this.target.label].header.colHeaders
			},
			getData() {
				return table.tableDatas[this.target.label].data
			}
		}
	}
</script>

<style>
	@import '~handsontable/dist/handsontable.full.css'
	
</style>
