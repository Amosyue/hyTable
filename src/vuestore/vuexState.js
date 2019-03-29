import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	level: '第一周', //活动周数
	itemNum: 1, // 第几题
	answerid: [], //答案id集合
}
const mutations={//修改存储state里面的值
    //记录第几题
    rememberNum:function(state,value){ // Vue 建议我们mutation 类型用大写常量表示，我这里没改，你可以试试
		state.itemNum+=value
    },
    //记录答案id
    rememberId:function(state,value){
    	state.answerid.push(value)
    },
    //重置
    initState:function(state){
    	state.itemNum=1;
    	state.answerid=[]
    }
}
const actions={//actions总是执行mutation里面的函数
	addNum:function(context,value){
		// debugger
		context.commit('rememberNum',1)
		context.commit('rememberId',value)
	},
	reset:function(context){
		context.commit('initState')
	}
}

const store = new Vuex.Store({
  state,
  actions,
  mutations
})

export default store;
