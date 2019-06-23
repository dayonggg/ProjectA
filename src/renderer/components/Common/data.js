import fs from 'fs'
import path from 'path'
import xlsx from 'node-xlsx'
import $ from 'Jquery'
import pkg from '../../../../package.json'
import Bus from '../Bus.js'

export default {
	version: pkg.version,
	resDir: '',
	tableDir: '',
	baseConfig: {
		label: '设置',
		extname: 'conf',
		content: {
			treeData: [{
				label: "Tables",
				children: []
			}, {
				label: "Resource",
				resDir: "Assets",
				lsDir: "scenes",
				lhDir: ["grounds", "monster", "roles", "AApoint"],
				children: []
			}]
		}
	},
	resourceDirs: [],
	treeData: [],
	tables: [],
	localConfig: {
		exportConfig: [
			{
				name:'buff.xlsx',
				clientIgnore:['id'],
				serverIgnore:['name']
			}
		]
	},

	//初始化
	init() {
		this.treeData = this.baseConfig.content.treeData
		let ckv = new Promise((resolve, reject) => {
			this.checkVersion()
			resolve(true)
		})

		let initdir = new Promise((resolve, reject) => {
			this.initResDir()
			resolve(true)
		})

		let gtl = new Promise((resolve, reject) => {
			this.initTableTree()
			resolve(true)
		})

		let rtl = new Promise((resolve, reject) => {
			this.initResourceTree()
			resolve(true)
		})

		Promise.all([ckv, initdir, gtl, rtl]).then((res) => {
			Bus.$emit('updataTableList', this.treeData)
			let cstr = localStorage.getItem('config') || JSON.stringify(this.localConfig)
			localStorage.setItem('config',cstr)
			this.localConfig = JSON.parse(cstr)
			Bus.$emit('initDone', true)
		})
	},

	//版本校验，返回是否版本对应，版本不对应将清除本地数据
	checkVersion() {
		if (this.version == localStorage.getItem('version')) {
			this.resDir = localStorage.getItem('resDir')
			this.tableDir = localStorage.getItem('tableDir')
			return true
		} else {
			localStorage.clear()
			localStorage.setItem('version', this.version)
			return false
		}
	},

	//校验本地目录，如果没有，则创建
	checkDir(dirpath) {
		fs.access(dirpath, function(err) {
			if (err) {
				fs.mkdir(dirpath, function(err) {
					if (err) {
						console.log(dirpath, '创建失败')
						return false
					} else {
						return true
					}
				})
			} else {
				return true
			}
		})
	},

	//初始化资源文件夹
	initResDir() {
		let rescfg = this.treeData[1]
		let dirs = []
		dirs.push(rescfg.lsDir) //scenes
		$.each(rescfg.lhDir, (key, value) => {
			dirs.push(value) //models
			console.log(value)
		})
		dirs.push(rescfg.resDir) //resource
		$.each(dirs, (key, value) => {
			this.checkDir(path.join(this.resDir, value)) //make dir
		})
		this.checkDir(path.join(this.resDir, rescfg.resDir, 'Materials'))
		this.resourceDirs = dirs
	},

	//获得表格列表
	getTableList(callback) {
		fs.readdir(this.tableDir, (err, files) => {
			if (err) {
				console.log(err)
			} else {
				let tl = files.filter((t) => {
					return t.endsWith('.xlsx')
				})
				this.tables = tl
				callback && callback(tl)
			}
		})
	},

	//初始化表格子树
	initTableTree() {
		let td = this.treeData[0].children = []
		this.getTableList((tl) => {
			for (let i = 0; i < tl.length; i++) {
				let tableObj = {
					label: tl[i],
					extname: '.xlsx',
					file: path.join(this.tableDir, tl[i]),
					activate: false
				}
				td.push(tableObj)
			}
		})
	},

	//校验文件格式是否允许显示
	checkExt(extName) {
		let filters = ['.ls', '.lm', '.lav', '.lmat', '.png', '.jpg', 'jpeg']
		let flag = false
		$.each(filters, (key, value) => {
			if (value == extName) {
				flag = true
			}
		})
		return flag
	},

	//初始化资源子树
	initResourceTree() {
		let rd = this.treeData[1].children = []
		$.each(this.resourceDirs, (key, value) => {
			let fpath = path.join(this.resDir, value)
			let dirchild = {
				label: value,
				children: []
			}
			let c = dirchild.children
			fs.readdirSync(fpath).forEach((file) => {
				if (fs.statSync(path.join(fpath, file)).isDirectory()) {
					let obj = {
						label: file,
						children: []
					}
					fs.readdirSync(path.join(fpath, file)).forEach((file1) => {
						if (fs.statSync(path.join(fpath, file, file1)).isDirectory()) {
							console.log('只处理两层目录，多的不管')
						} else {
							if (this.checkExt(path.extname(file1))) {
								obj.children.push({
									label: file1,
									extname: path.extname(file1),
									file: path.join(fpath, file, file1),
									activate: false
								})
							}
						}
					})
					c.push(obj)
				} else {
					if (this.checkExt(path.extname(file))) {
						c.push({
							label: file,
							extname: path.extname(file),
							file: path.join(fpath, file),
							activate: false
						})
					}
				}
			})
			rd.push(dirchild)
		})
	},

	//检查是否已有场景
	checkSceneName(filename) {
		let sceneDir = this.treeData[1].lsDir
		return fs.existsSync(path.join(this.resDir, sceneDir, filename + '.ls'))
	},

	//检查是否已有场景
	checkModelName(filename, group) {
		let modelDir = group
		return fs.existsSync(path.join(this.resDir, modelDir, filename + '.lh'))
	},
	
	//返回xlsx文件内容
	getExcelData(file) {
		let list = xlsx.parse(file)
		let data = list[0].data
		return data
	},
	
	//设置表格导出设置
	setTableExportConfig(tableObj){
		
	},
	
	//返回表格导出设置
	getTableExportConfig(tableObj){
		
	}
}
