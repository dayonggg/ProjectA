import fs from 'fs'
import path from 'path'

export default {
	workSpace: {},
	treeData:[],
	listConfig:'',
	init: function(ws) {
		this.workSpace = ws
		this.listConfig = path.join(__static,"list.json")
		let d = fs.readFileSync(this.listConfig);
		console.log(JSON.parse(d.toString()))
		return JSON.parse(d.toString());
	},
	readTabelFile:function(fileName){
		
	},
}
