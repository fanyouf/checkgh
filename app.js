
const github = require("./utils/gitee")
const day = require("./utils/day")
const path = require('path')
const nameList = require('./nameList')
var schedule = require('node-schedule');
const DAY_LIST = day.getdayAgo(4);

const RESULT_FILE_PATH = "result.json"
const fs = require('fs')  

var log = require('single-line-log').stdout;

const counting  = {
    timer:null,
    go() {
        clearInterval(this.timer)
        let second = 0;
        this.timer = setInterval(()=>{
            second+=0.5
            log(`已执行${second}s`)
        },500)
    },
    stop(){
        clearInterval(this.timer)
    }
}
nameList.forEach(user => {
    user.data = DAY_LIST.map( day => ( {day,commit:0} )) 
})

async function get(nameList, dayList) {
    for(let i=0; i< nameList.length; i++ ){
        console.log(`处理 ${i+1}/${nameList.length}`)
        counting.go()
        let user = nameList[i]
        try {

            let rs = await  github.getCommitInfoByDay(user.userName,dayList)
            user.data = rs;
            user.status =true
        } catch(err) {
            user.status = false
            console.log(err)
            saveToFile(nameList,RESULT_FILE_PATH)

        }
        counting.stop()
    }
    print( nameList)
    saveToFile(nameList,RESULT_FILE_PATH)
}

function saveToFile(nameList,filePath){
    let t = path.join(__dirname,filePath)
    console.log(`获取完成，保存在 ${t}`)
    let successList = nameList.filter(it =>it.status)
    fs.writeFileSync(t,JSON.stringify(successList))
}
function print( nameList){
    let tableData = nameList.map (user => {
        let obj = {name: user.userName}
        user.data.forEach( it => {
            obj[it.day] = it.commit
        })
        
        return obj 
    })
    console.table( tableData )
}


/**
 * 从输出结果可以看出，传入的'30 * * * * *'带来的结果是每分钟的30秒时都会执行，下面来看看这个传入参数分别代码什么

　　通配符解释

* * * * * *
┬ ┬ ┬ ┬ ┬ ┬
│ │ │ │ │ |
│ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
│ │ │ │ └───── month (1 - 12)
│ │ │ └────────── day of month (1 - 31)
│ │ └─────────────── hour (0 - 23)
│ └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

　　6个占位符从左到右分别代表：秒、分、时、日、月、周几

　　'*'表示通配符，匹配任意，当秒是'*'时，表示任意秒数都触发，其它类推

　　下面可以看看以下传入参数分别代表的意思

每分钟的第30秒触发： '30 * * * * *'

每小时的1分30秒触发 ：'30 1 * * * *'

每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'

每月的1日1点1分30秒触发 ：'30 1 1 1 * *'

2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'

每周1的1点1分30秒触发 ：'30 1 1 * * 1'
这样很容易根据自已的需求用简短的代码去实现。
 */
get(nameList, DAY_LIST)

function scheduleCronstyle(){
    schedule.scheduleJob('30 1 * * * *', function(){
        console.log('scheduleCronstyle:' + new Date());
        get(nameList, DAY_LIST)
    }); 
}

scheduleCronstyle();