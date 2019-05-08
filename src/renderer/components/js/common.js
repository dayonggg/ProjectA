import fs from 'fs'
import path from 'path'

export default {
	workSpace: {},
	treeData:[],
	listConfig:'',
	editableTabs: [],
	editableTabsValue: '',
	tabIndex: '',
	init: function(ws) {
		this.workSpace = ws
		this.listConfig = path.join(__static,"list.json")
		let d = fs.readFileSync(this.listConfig);
		console.log(JSON.parse(d.toString()))
		return JSON.parse(d.toString());
	},
	setTableList:function(){
		
	},
	addTab(targetName,callback) {
		let obj =targetName;
		let newTabName = ++this.tabIndex + '';
		obj.name = newTabName;
		this.editableTabs.push(obj);
		this.editableTabsValue = obj.label;
		if(callback === 'function'){
			callback()
		}
	},
	removeTab(targetName) {
		let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.label === label) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
	},
}
