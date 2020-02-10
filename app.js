
const github = require("./utils/github")
const day = require("./utils/day")
const path = require('path')
const nameList = require('./nameList')
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
        let rs = await  github.getCommitInfoByDay(user.userName,dayList)
        user.data = rs;
        counting.stop()
    }
    print( nameList)
    saveToFile(nameList,RESULT_FILE_PATH)
}

function saveToFile(nameList,filePath){
    let t = path.join(__dirname,filePath)
    console.log(`获取完成，保存在 ${t}`)
    fs.writeFileSync(t,JSON.stringify(nameList))
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

get(nameList, DAY_LIST)

// counting.reset()

