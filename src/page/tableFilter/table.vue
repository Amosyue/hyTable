<template>
    <div class="hyTable">
        <div class="popoverBox">
            <el-popover
                placement="bottom-start"
                popper-class="selectFieldName"
                width="240"
                trigger="click">
                <el-checkbox-group v-model="checkedHeaders" @change="changeSelectedHeader">
                    <el-checkbox :label="item.fieldName" :title="item.name" v-for="(item,index) in headers" :key="index">{{item.name}}</el-checkbox>
                </el-checkbox-group>
                <el-button slot="reference" size="small" class="pointer">选择字段</el-button>
            </el-popover>
            <el-button size="small" style="margin-left:5px;" class="tableFunSearch pointer" @click="advancedSearch">
               <label for="" class="cursor-hand pointer">
                  <i class="el-icon-caret-bottom pointer"></i>
                  <span v-if="!isShowFilte" class="text pointer">高级搜索</span>
                  <span v-else class="text pointer">清空搜索</span>
              </label>
            </el-button>
        </div>
        <el-table class="hy-el-table"
            ref="hyTable"
            :height="option.tableHeight"
            :highlight-current-row="highlightCurrentrow"
            :data="tableData.content"
            :key="tableKey"
            :row-key="getRowKeys"
            v-loading="option.loading"
            size="small"
            stripe
            @row-click="rowClick"
            @row-dblclick="rowDblclick"
            @selection-change="handleSelectionChange"
            :header-cell-style="{background:'#efefef',height:'48px'}"
            :class="{'hy-el-table-searchValHide':isShowFilte==false}">
            <!-- 是否全选 -->
                <el-table-column type="selection" :reserve-selection="true" v-if="option.selectable"></el-table-column>
            <!-- 常规数据显示 -->
                <el-table-column
                v-for="item in tableHeaders"
                :render-header="renderHeader"
                :min-width="item.width?item.width:'100'"
                :key="item._id"
                :prop="item.fieldName"
                :sortable="option.sortable"
                :show-overflow-tooltip="showOverflowTooltip"
                :label="item.name">
                    <template slot-scope="scope">
                        <template v-if="item.isCustom">
                            <slot :name='item.fieldName' :scope="scope"></slot>
                        </template>
                        <template v-else>
                            {{scope.row[item.fieldName]}}
                        </template>
                    </template>
                </el-table-column>
            <!-- 操作列 -->
            <el-table-column
                v-if="option.hasOperateColumn"
                label='操作'
                :fixed="option.operatesFixed"
                class="h_operator"
                :show-overflow-tooltip="showOverflowTooltip"
                min-width="160">
                <template slot-scope="scope">
                    <div class="oprator" v-if="option.buttonType === 'icon'"><!-- hidden这个属性加上会隐藏此栏目-->
                        <el-tooltip class="item" effect="dark"  v-for="btn in option.operates" :key="btn.id" :content="btn.title" placement="top">
                            <span class="iconFont" @click="btn.handleClick(scope.row, $event)">
                                <i size="mini" class="btn-slot" :class="[btn.css]"></i>
                            </span>
                        </el-tooltip>
                    </div>    
                    <div class="oprator" v-if="option.buttonType === 'button'">
                        <el-button
                            v-for="(btn,index) in option.operates"
                            :key="index"
                            :class="[btn.css]"
                            @click="btn.handleClick(scope.row, $event)">
                            {{btn.text}}
                        </el-button>
                    </div>
                </template>
            </el-table-column>

        </el-table>
        <div class="page">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="tableData.currentPage"
              :page-sizes="[10, 50, 100, 300]"
              :page-size="tableData.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="tableData.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            'tableData':{//表格数据及其基础配置
                type:Object,
                default:()=>{}
            },
            'headers':{//表头
                type:Array,
                default:()=>[]
            },
            'loadRemoteData':{
                type:Function,
                default:function(){}
            },
            'rowDblclick':{//行双击事件
                type:Function,
                default:function(){}
            },
            'rowClick':{//行点击事件
                type:Function,
                default:function(){}
            },
            'rowSelectionData':{
                type:Array,
                default:()=>[]
            },
            'filterTabKey':{//select options值集合
                type:Object,
                default:{}
            },
            'showOverflowTooltip':{//是否超出隐藏
                type:Boolean,
                default:false
            },
            'highlightCurrentrow':{//高亮当前行
                type:Boolean,
                default:true
            },
            'operatesFixed':{//是否固定操作行，//操作列固定位置，参照elment-ui，false,true, left, right,默认false，不固定操作列位置
                type:Boolean,
                default:true
            },
            'option':{
                type:Object,
                default:()=>{
                    return {
                        'selectable': false, //全选
                        'hasOperateColumn': true, //操作列
                        'tableHeight':'360',//表格高度
                        'buttonType': 'icon',//操作按钮类型，icon为图标
                        'hasPagination': true, //分页
                        'operatesFixed':false,//操作列固定位置，参照elment-ui，false,true, left, right,默认false，不固定操作列位置
                        'operates': []//操作按钮配置
                    }
                }
            }
        },
        data() {
            return {
                'tableKey':0,//这个key是为了重新渲染table组件而设定，vue语法里有说明，只要key改变，组件会重新渲染
                'isShowFilte':false,//是否显示表头搜索功能
                'currentPage':1,
                'pageSize':10,
                'checkedHeaders':[],//选中的表头集合
                'filteContent':[],//总的过滤条件
                'tableHeaders':[],
                'sortOrder':'descending',//排序
                'multipleSelectionAll':[],//所有选中的数据
                'getRowKeys'(row) {//row-key
                    return row.id;
                },
            }
        },
        watch:{
            'headers':function(){//监听原始表头值变化
                let _headers = this.headers;
                let _tableHeaders = _headers.filter(item=>item.ishide == false)//过滤出来显示的表头
                this.tableHeaders = _tableHeaders;
                this.checkedHeaders = []//清除选中的表头数据
                _tableHeaders.forEach((val,index)=>{
                    this.checkedHeaders.push(val.fieldName)  
                })
            }
        },
        methods:{
            //选中功能，注意此功能结合 row-key
            handleSelectionChange(rows) {
                this.multipleSelectionAll = [];
                if (rows) {
                    rows.forEach(row => {
                        if (row) {
                            this.multipleSelectionAll.push(row);
                        }
                    });
                }
            },
            //高级搜索
            advancedSearch(){
                this.isShowFilte = !this.isShowFilte
                this.filteContent = []//清空过滤条件
                this.tableKey++  //防止表头显示隐藏后高度问题，重新渲染后就可以解决此问题
            },
            //选中的表头变化
            changeSelectedHeader(selectedTable){
                let _headers = this.headers;
                let _curHeaders = []//每次表头变化就重新获取header
                _headers.forEach((val,index)=>{//这里需要注意下，之所以先循环总的表头数据是为了让新的表头按照最初的顺序排列
                    selectedTable.forEach((item,i)=>{
                        if(item == val.fieldName){
                            _curHeaders.push(val)
                        }
                    })
                })
                this.tableHeaders = _curHeaders
            },
            //分页大小调整，这里需要说明下，当调整分页大小后我们默认从第一页调用数据，
            handleSizeChange(pageSize) {
                this.pageSize = pageSize
                this.loadRemoteData(this.filteContent,1,pageSize)
            },
            //当前页调整
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage
                this.loadRemoteData(this.filteContent,currentPage,this.pageSize)
            },
            //表头input类型值发生变化后触发的函数（如果值没变不会触发）
            headerInputChange(val){
                this.loadRemoteData(this.filteContent,1,this.pageSize)
            },
            //render表头函数
            renderHeader (h,{column,$index}) {
                let that = this;
                let options = []//当前select类型下的下拉值
                let _headers = this.headers
                let _filteContent = this.filteContent//过滤条件集合
                let _property = column.property//当前表头prop属性值
                let filteType = ''//当前绑定值类型
                let filteValue //当前绑定值
                //获取select类型下的下拉值
                for(let item in this.filterTabKey){
                    if(item == column.property){
                        options = this.filterTabKey[item]
                    }
                }
                for(let item of _headers){
                    if(item.fieldName == _property ){
                        filteType = item.type
                        if( item.type == 'checkbox'){//这里处理了checkbox类型，本组件因为需要checkbox类型时候需要值为数组结构
                            filteValue = []
                        }else{
                            filteValue = ""
                        }
                    }
                }
                for(let item of _filteContent){
                    if(item.t_tab_key == column.property){
                        filteValue = item.t_tab_value
                    }
                }
                //input值改变监听事件
                const inputChange = val => {  
                    setFilte(val,'input')
                }
                //date时间值改变监听事件
                const dateChange = val => {  
                    setFilte(val,'date')
                    this.loadRemoteData(this.filteContent,1,this.pageSize)
                }
                //select类型值改变监听事件
                const selectChange = val => {  
                    setFilte(val,'select')
                    this.loadRemoteData(this.filteContent,1,this.pageSize)
                }
                //checkbox类型
                const checkBoxSelectChange = val =>{
                    setFilte(val,'select','arrayType')
                    this.loadRemoteData(this.filteContent,1,this.pageSize)
                }
                //升序排列
                const sortableFunAsc = () => { 
                    that.$refs.hyTable.clearSort()
                    that.$refs.hyTable.sort(column.property, 'ascending')
                }
                //降序排列
                const sortableFunDes = ()=>{
                    that.$refs.hyTable.clearSort()
                    that.$refs.hyTable.sort(column.property, 'descending')
                }
                //设置过滤条件函数,第3个参数为数据类型，
                function setFilte(val,type,dataType) {
                    let flag = false
                    _filteContent.forEach((item,index)=>{
                        if(item.t_tab_key == column.property){
                            if(dataType == "arrayType"){//数组类型
                                if(val.length>0 ){//有值的情况
                                    item.t_tab_value = val
                                }else{
                                    _filteContent.splice(index,1)//如果清空了当前选项，那么删除过滤条件数组中对应的空值
                                }
                            }else{
                                if(val){//有值的情况
                                    item.t_tab_value = val
                                }else{
                                    _filteContent.splice(index,1)//如果清空了当前选项，那么删除过滤条件数组中对应的空值
                                }
                            }
                            flag = true
                        }
                    })
                    if(!flag){
                        _filteContent.push({
                          t_tab_key:column.property,
                          t_tab_value:val,
                          t_tab_flag:type
                        })
                    }
                }
                if(filteType == 'input'){//input文本框类型
                    return (
                        <span>
                            <span class="headerName">{column.label}</span>
                            <span class="caret-wrapper">
                                <i class="sort-caret ascending" on-click={sortableFunAsc}></i>
                                <i class="sort-caret descending" on-click={sortableFunDes}></i>
                            </span>
                            <span class="headerVal">
                                <el-input 
                                    value={filteValue}
                                    class="h_input"
                                    on-change={this.headerInputChange}
                                    on-input={inputChange}
                                    clearable
                                    size="mini"
                                    placeholder="请输入">
                                </el-input>
                            </span>
                        </span>
                    )
                }else if(filteType == 'date'){//时间日期类型
                    return (
                        <span>
                            <span class="headerName">{column.label}</span>
                            <span class="caret-wrapper">
                                <i class="sort-caret ascending" on-click={sortableFunAsc}></i>
                                <i class="sort-caret descending" on-click={sortableFunDes}></i>
                            </span>
                            <span class="headerVal">
                                <el-date-picker
                                      value={filteValue}
                                      size="mini" 
                                      on-input ={dateChange}
                                      value-format="yyyy-MM-dd HH:mm:ss"
                                      type="datetimerange"
                                      placeholder="请选择时间"
                                      range-separator="-"
                                      start-placeholder="">
                                </el-date-picker>
                            </span>
                        </span>
                    )
                }else if(filteType == 'select'){//下拉框类型
                    return (
                        <span>
                            <span class="headerName">{column.label}</span>
                            <span class="caret-wrapper">
                                <i class="sort-caret ascending" on-click={sortableFunAsc}></i>
                                <i class="sort-caret descending" on-click={sortableFunDes}></i>
                            </span>
                            <span class="headerVal">
                                <el-select value={filteValue} size="mini" filterable  placeholder="请选择" clearable on-change={selectChange}>
                                    {options.map((item, index) => {
                                        return <el-option key={index} value={item.value} label={item.label}>{item.label}</el-option>
                                    })}
                                </el-select>
                            </span>
                        </span>
                    )
                }else if(filteType == 'checkbox'){//checkbox下拉框类型，支持多选
                    return (
                        <span>
                            <span class="headerName">{column.label}</span>
                            <span class="caret-wrapper">
                                <i class="sort-caret ascending" on-click={sortableFunAsc}></i>
                                <i class="sort-caret descending" on-click={sortableFunDes}></i>
                            </span>
                            <span class="headerVal">
                                <el-select value={filteValue} size="mini" multiple placeholder="请选择" clearable on-change={checkBoxSelectChange}>
                                    {options.map((item, index) => {
                                        return <el-option key={index} value={item.value} label={item.label}>{item.label}</el-option>
                                    })}
                                </el-select>
                            </span>
                        </span>
                    )
                }else{//不是input，date, select的全部转换成默认的input类型
                    return (
                        <span>
                            <span class="headerName">{column.label}</span>
                            <span class="headerVal">
                                <el-input 
                                    value={filteValue}
                                    class="h_input"
                                    on-blur={this.headerInputChange}
                                    on-input={inputChange}
                                    clearable
                                    placeholder="请输入">
                                </el-input>
                            </span>
                        </span>
                    )
                }
            },
            setActiveTableForSelf (e) {
                e && e.stopPropagation()
            }
        }
    }
</script>
<style lang="scss">
.selectFieldName .el-checkbox-group .el-checkbox__label{
    display:inline-block;
    font-size:12px;
    vertical-align:middle;
    text-overflow:ellipsis;
    overflow:hidden;
    max-width:100px;
    position:relative;
    top:-1px;
}
.selectFieldName .el-checkbox-group .el-checkbox{
    margin:0 20px 0 0;
}
.hyTable{
    .pointer{
        cursor:pointer;
    }
    .popoverBox{
        margin:10px 0;
        .tableFunSearch{
            cursor:pointer;
        }
    }
    .el-table th div{
        display: block;
        line-height: 1;
        white-space:nowrap;
    }
    .el-table th div.el-input{
       overflow:visible 
    } 
    .el-table th.gutter{
        background:#efefef;
    }
    .hy-el-table{
        border:1px solid #e5e5e5;
        .headerVal{
            font-size:12px;
            display: block;
            .el-input{
                padding:0;
            }
            .el-select{
                padding:0;
            }
            .el-input__inner{
                border: 1px solid #ddd;
                font-size:12px;
                color:#999;
            }
        }
        .oprator{
            .iconFont{
                display:inline-block;
                padding:0 5px;
                cursor:pointer;
                .btn-slot {
                    font-size: 12px;
                    display: inline-block;
                }
            }
        }
        .caret-wrapper{
            position:relative;
           
        }
        .el-date-editor--datetimerange{
            width:200px;
        }
    }
    .hy-el-table-searchValHide {
        .headerVal{
            display:none;
        }
    }
    .page{
        text-align:right;
        margin:10px 0;
    }
}
</style>

