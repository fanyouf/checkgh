
const dayjs = require('dayjs')

module.exports = {
    /**
     * 获取从现在开始num天之前的日期。
     * @param {Number} num 
     * 
     * @return 
     * ['2020-03-03','2020-03-02','2020-03-01']
     */
    getdayAgo(num=0,initDay=Date.now()) {
        if(num <=0){
            return []
        }

        return Array(num)
        .fill(null)
        .map((_, i)=>dayjs(initDay).subtract(i,"day").format('YYYY-MM-DD'))
    }
}
