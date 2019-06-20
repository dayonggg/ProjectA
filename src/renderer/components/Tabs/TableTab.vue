<template>
	<hot-table v-show="show" ref="HT" :settings="hotSettings" width="100%" height="100%" licenseKey="non-commercial-and-evaluation"></hot-table>
</template>

<script>
	import Bus from '../Bus'
	import Handsontable from 'handsontable'
	import HotTable from '@handsontable/vue'
	import D from '../Common/data.js'

	export default {
		name: "table-tab",
		data() {
			return {
				show: false,
				filedata: [],
				settings:{},
				hotSettings: {
					colHeaders: true, //当值为true时显示行头，当值为数组时，行头为数组的值
					columns: [], //设置列数据类型，项目只提供text和numeric
					rowHeaders: true,
					stretchH: 'all', //根据宽度横向扩展，last:只扩展最后一列，none：默认不扩展,all:全部扩展
					data: [], //表格数据
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
			console.log(this.target)
			this.initExcel()
		},
		methods: {
			initExcel() {
				this.filedata = D.getExcelData(this.target.file)
				if (this.filedata.length > 3) {
					this.settings = this.$refs.HT.settings
					this.settings.colHeaders = this.filedata[2]
					this.settings.columns = this.getDataType(this.filedata[1])
					this.settings.data=this.filedata.filter((item, index) => index >= 3)
					this.show = true
				} else {
					this.$message.error('无效数据文件')
				}
			},
			getDataType(typeArr) {
				let dt = []
				if (typeArr != undefined) {
					for (let i = 0; i < typeArr.length; i++) {
						let obj = {}
						if (typeArr[i] == 'string') {
							obj.type = 'text'
						}
						if (typeArr[i] == 'int') {
							obj.type = 'numeric'
						}
						dt.push(obj)
					}
				}
				return dt
			},
		}
	}
</script>

<style>
	@import '~handsontable/dist/handsontable.full.css'
</style>
