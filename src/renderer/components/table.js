import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'

export default {
	tableDir: localStorage.getItem('tableDir'),
	tableList:[],
	tableDatas:{},
	init(tableList){
		this.tableList = tableList
		this.tableDatas = {}
		for(let i=0;i<tableList.length;i++){
			this.tableDatas[tableList[i]] = this.setExcelData(tableList[i])
		}
		// console.log(this.tableDatas)
	},
	setExcelData(table) {
		let list = xlsx.parse(path.join(this.tableDir, table))
		// console.log(list)
		let data = list[0].data
		return data
	},
	getKey(tablename){
		let arr=[]
		for(let i=0;i<this.tableDatas[tablename][0].length;i++){
			arr.push(this.tableDatas[tablename][2][i])
		}
		return arr
	}
}
