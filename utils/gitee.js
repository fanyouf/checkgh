const request = require('request')
const $ = require('cheerio')

/**
 * 获取在github的提交信息
 * @param {String} userName  github帐号
 * @param {Array} dayList 日期列表。['2020-02-01','2020-02-02']
 */
const getCommitInfoByDay = (userName,dayList) => {
    return new Promise((resolve,reject)=>{
        request.get(`https://gitee.com/${userName}`, {timeout: 20000},function optionalCallback(err, httpResponse, body) {
          if (err) {
            reject('连接失败')``
          } else {
            resolve( dayList.map( day => {
              
              console.log('-------------',day)
              let rs = $(body).find(`.contribution-box .box[date='${day}']`)
                    if( rs && rs.length===1) {
                        return {day,commit: parseInt( $(rs).attr('data-content'))}
                    } else {
                        return {day,commit: '未知'}

                    }
                }))
            }
          });

    });
}

module.exports = {
    getCommitInfoByDay
}