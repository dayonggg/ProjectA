import path from 'path'
import xlsx from 'node-xlsx'
import $ from 'Jquery'

export default {
	tableDir: localStorage.getItem('tableDir') || '',
	tableConfig: [],
	tableList: [],
	tableDatas: {},
	tableTree: [],
	init(tl, callback) {
		this.tableList = tl
		this.tableDatas = {}
		let tcs = localStorage.getItem('tablesConfig') || ''
		if (tcs != '') {
			this.tableConfig = JSON.parse(localStorage.getItem('tablesConfig'))
		} else {
			localStorage.setItem('tablesConfig', '[]')
		}
		// 将表格文件存入对象
		$.each(tl, (key, value) => {
			let exceldata = this.setExcelData(value)
			let o = {
				header: {
					text: exceldata[0],
					dataType: this.getDataType(exceldata[1]),
					colHeaders: exceldata[2],
				},
				data: exceldata.filter((item, index) => index >= 3)
			}
			this.tableDatas[value] = o
			this.tableTree.push(this.getTableConfig(value))
			if (key == tl.length - 1) {
				callback()
			}
		})
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
	save() {
		localStorage.setItem('tablesConfig', JSON.stringify(this.tableConfig))
	}
}
