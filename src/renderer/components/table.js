import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'

export default {
	tableDir: localStorage.getItem('tableDir') || '',
	tableConfig: JSON.parse(localStorage.getItem('tablesConfig')) || [],
	tableList: [],
	tableDatas: {},
	tableTree: [],
	init(tableList, callback) {
		this.tableList = tableList
		this.tableDatas = {}
		// 将表格文件存入对象
		for (let i = 0; i < tableList.length; i++) {
			this.tableDatas[tableList[i]] = this.setExcelData(tableList[i])
			this.tableTree.push(this.getTableConfig(tableList[i]))
		}


		console.log(this.tableDatas)
		console.log(this.tableTree)
		callback()
	},
	getTableConfig(tablename) {
		let tableObj = {
			label: tablename,
			fileType: 'xlsx',
			byServer: true,
			byClient: true,
			serverIgnore: ['mark'],
			clientIgnore: ['mark'],
			disabled: false
		}
		for (let i = 0; i < this.tableConfig.length; i++) {
			if (this.tableConfig[i].label == tablename) {
				tableObj = this.tableConfig[i]
			}
		}
		return tableObj
	},
	setExcelData(table) {
		let list = xlsx.parse(path.join(this.tableDir, table))
		// console.log(list)
		let data = list[0].data
		return data
	},
	getKey(tablename) {
		let arr = []
		for (let i = 0; i < this.tableDatas[tablename][0].length; i++) {
			arr.push(this.tableDatas[tablename][2][i])
		}
		return arr
	},
	save(){
		localStorage.setItem('tablesConfig',JSON.stringify(this.tableConfig))
	}
}
