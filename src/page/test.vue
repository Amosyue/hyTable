<template>
    <div style="margin:20px;">
        <table-filter 
            :tableData="tableData" 
            :headers="headers"
            :filterTabKey="filterTabKey"
            :option="settingOfTable"
            :showOverflowTooltip="true"
            :loadRemoteData="getContent2">
            <div slot="status" slot-scope="scope">
                <span class="circle">{{scope.scope.row.status}}</span>
            </div>
        </table-filter>
    </div>
</template>
<script>
import tableFilter from './tableFilter/table';
export default {
    'name':'test',
    data(){
        return {
            headers:[],//表头table
            tableData:{
                'content':[],
                'total':120,//总数据条数
                'startPage': 1,
                'pageSize': 20,
                'currentPage':1,
            },
            filterTabKey:{},//表头下拉值
            settingOfTable:{
                'loading':false,
                'selectable': true, //全选
                'hasOperateColumn': true, //操作列
                'tableHeight':'360',//表格高度
                'buttonType': 'icon',
                'hasPagination': true, //分页
                'operates': [{
                    id: '1',
                    css: 'el-icon-edit',
                    title: '编辑',
                    isCircle: true,
                    handleClick: (row) => {
                        this.editConfig(row)
                    }
                }, {
                    id: '2',
                    css: 'el-icon-delete',
                    title:'删除',
                    isCircle: true,
                    handleClick: (row) => {
                        this.deleteConfig(row)
                    },
                    
                }]
            }
        }
    },
    created(){
        this.loadScriptList([],1,10)
        console.log("sss")
    },
    methods: {
        editConfig(row){
            console.log("执行了编辑函数")
            console.log(row)
        },
        deleteConfig(row){
            console.log("执行了删除函数")
            console.log(row)
        },
        //表格行双击事件
        // rowDblclick(row){
        //     alert("行双击事件写在这里")
        // },
        //调用数据
        loadScriptList(params,currentPage,pageSize){
            this.settingOfTable.loading = true
            console.log("外部调用了数据了-----------")
            console.log(params)
            console.log('当前页----'+currentPage)
            console.log('当前页大小----'+pageSize)
            this.$axios.get('/test/v2/movie/top250?start=25&count=25').then((val)=>{
                return [{
                        '_id':'1',
                        "fieldName":"date",
                        "name":"时间",
                        "type":"date",
                        'ishide':true,
                    },{
                        '_id':'2',
                        'type':'input',
                        'fieldName':'name',
                        'name':'姓名姓名姓名姓名姓名姓名姓名姓名',
                        'ishide':false,
                        
                    },{
                        '_id':'3',
                        'type':'select',
                        'fieldName':'address',
                        'name':'地址',
                        'ishide':false,
                        'width':'200'
                    },{
                        '_id':'4',
                        'type':'select',
                        'fieldName':'status',
                        'name':'状态',
                        'ishide':false,
                        'isCustom':true
                    },{
                        '_id':'5',
                        'type':'checkbox',
                        'fieldName':'duoxuan',
                        'name':'多选',
                        'ishide':false,
                    }]
            }).then((res)=>{
                for(let i=0;i<res.length;i++){
                    if(res[i].type=="select" || res[i].type=="checkbox"){
                        this.$axios.get('/test/v2/movie/search').then((response)=>{
                            this.$set(this.filterTabKey,res[i].fieldName,[{
                                'value':'1',
                                'label':'面包'
                            },{
                                'value':'2',
                                'label':'汽水'
                            }])
                        })
                    }
                }
                this.headers = res
                this.getContent()
            }).finally((res)=>{
                this.settingOfTable.loading = false
            })
        },
        getKeys(){

        },
        getContent(){


            let _data = [{
                    date: '2016-12-12',
                    name: '1王小虎1王小虎1王小虎1王小虎1王小虎1王小虎1王小虎',
                    address: '上海市普陀区金沙江路 1518 弄',
                    status:'成功',
                    duoxuan:'多选1'
                }, {
                    date: '2016-05-04',
                    name: '2王小虎',
                    address: '上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1517 弄上海市普陀区金沙江路 1517 弄',
                    status:'失败',
                    duoxuan:'多选2'
                }, {
                    date: '2016-05-01',
                    name: '3王小虎',
                    address: '上海市普陀区金沙江路 1519 弄',
                    status:'失败',
                    duoxuan:'多选444'
                }, {
                    date: '2016-05-03',
                    name: '4王小虎',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '6王小虎',
                    address: '上海市普陀区金沙江路 1516 弄测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '5王小虎11',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '9王小虎22',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '8王小虎333',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '7王小虎444',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '6王小虎555',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '王小虎666',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '王小虎777',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-03',
                    name: '王小虎888',
                    address: '上海市普陀区金沙江路 1516 弄',
                    status:'成功',
                    duoxuan:'多选'
                }]

                this.tableData = {
                    'content':_data,
                    'total':120,//总数据条数
                    'startPage': 1,
                    'pageSize': 10,
                    'currentPage':1
                }
            
        },
         getContent2(){
            this.settingOfTable.loading = true
            let _data = [{
                    date: '2016-051-022',
                    name: '黄越1',
                    address: '上海市普陀区金沙江路 1518 弄',
                    status:'失败',
                    duoxuan:'多选'
                }, {
                    date: '2016-05-04',
                    name: '黄越2',
                    address: '上海市普陀区金沙江路 1517 弄',
                    status:'成功',
                    duoxuan:'多选'
                }]
            this.tableData = {
                    'content':_data,
                    'total':120,//总数据条数
                    'startPage': 1,
                    'pageSize': 50,
                    'currentPage':2
                }
            setTimeout(()=>{
                this.settingOfTable.loading = false
            },1000)
        }
    },
    components:{
        tableFilter
    }
}
</script>
