
import moment from 'moment';

export function getRedirectPath({type, avatar}) {
    // 根据用户信息 返回跳转地址
    // user.type /boss /genius
    // user.avatar /bossinfo /geniusinfo
    let url = '/me';
    if (!avatar) {
        url = (type === 'boss')?'/bossinfo':'/geniusinfo';
        if (type === 'admin') {
            url = '/manage';
        }
    }
    return url;
}

export function getChatId(userId, targetId) {
    return [userId, targetId].sort().join('_');
}

export function getTime(timeStamp, isDateFormat = false) {
    if ( isDateFormat ){
        return moment(timeStamp).format("YYYY-MM-DD");
        // HH:mm:ss
    }
    else {
        const currentTimeStamp = new Date().getTime();
        const minusTimeStamp = currentTimeStamp - timeStamp;
        const days = Math.floor(minusTimeStamp / (24 * 3600 * 1000));
        // 时
        const leave1 = minusTimeStamp % (24 * 3600 * 1000);
        const hours = Math.floor(leave1 / (3600 * 1000));
        // 分
        const leave2 = leave1 % (3600 * 1000);
        const minutes = Math.floor(leave2 / (60 * 1000));
        // 秒
        const leave3 = leave2 % (60 * 1000);
        const seconds = Math.round(leave3 / 1000);
        if (days > 0) {
            return `${days}天前`;
        }
        else if (hours > 0) {
            return `${hours}小时前`;
        }
        else if (minutes > 0) {
            return `${minutes}分钟前`;
        }
        else {
            return `1分钟前`;
        }
    }
}

export function getPieChartOption(name, titleList, dataList) {
    let option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data: titleList
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series: [
            {
                name: name,
                type:'pie',
                radius: ['40%', '55%'],
                label: {
                    normal: {
                        formatter: '{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    },
                },
                data: dataList
            }
        ]
    };
    return option;
}

export function deteleObject(obj) {
    let uniques = [];
    let stringify = {};
    for (let i = 0; i < obj.length; i++) {
        let keys = Object.keys(obj[i]);
        keys.sort(function(a, b) {
            return (Number(a) - Number(b));
        });
        let str = '';
        for (let j = 0; j < keys.length; j++) {
            str += JSON.stringify(keys[j]);
            str += JSON.stringify(obj[i][keys[j]]);
        }
        if (!stringify.hasOwnProperty(str)) {
            uniques.push(obj[i]);
            stringify[str] = true;
        }
    }
    uniques = uniques;
    return uniques;
}