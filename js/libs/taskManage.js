/**
 * 异步任务管理器
 *
 *
 * @author      YuChenLi923<liyc_code@163.com>
 */


function Task(index,taskManager) {
    this.index = index;
    this.taskManager =  taskManager;
};
Task.prototype = {
    constructor:Task,
    finish:function (data) {
        this.taskManager.finish(this.index,data);
    }
};

function  taskManager() {
    let args = [...arguments];
    if(new.target !== undefined){
         this.regiser(...args);
    }else{
        return new taskManager(...args);
    }
}
taskManager.prototype = {
    constructor:taskManager,
    regiser() {
        let args = [...arguments];
        this.curTaskList = null;
        this.taskStack = [args];
        this.finishNum = 0;
        this.dataList = [];
        return this;
    },
    to(){
        this.taskStack.push([...arguments]);
        return this;
    },
    run(data = []){
        let { taskStack } = this,
            len = taskStack.length,
            curTaskList = [];
        if(len > 0 ){
           curTaskList = taskStack.shift();
           this.curTaskList = curTaskList;
        }else{
            this.curTaskList = [];
        }
        curTaskList.forEach((task,index)=>{
            if(typeof  task === 'function'){
                console.log(task.name);
                task.call(new Task(index,this),...data);
            }else{
                console.warn(task.name + 'is not function');
            }
        });

    },
    finish(index,data){
        if(index > -1){
            this.dataList[index] = data;
            this.finishNum +=1;
            if(this.finishNum === this.curTaskList.length ){
                this.run(this.dataList);
                this.dataList = [];
            }
        }
    }
};