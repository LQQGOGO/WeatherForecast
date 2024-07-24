// import axios from 'axios';
// const axios = require('axios');
//为swiper插件按钮绑定点击事件
let easyWeather = {
    tianqi: '晴',
    shi: '西安',
    tupian: '104',
    gaowen: 30,
    diwen: 20,
    // id: "101010100",
};

// 制作折线图函数
function lineChart(id, nums, color) {
    // let canvas = document.getElementById('myCanvas');
    let canvas = document.getElementById(id);
    // console.log(canvas);
    let ctx = canvas.getContext('2d');
    canvas.width = canvas.width
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // let dataPoints = [
    //     { x: 0, y: 100 },
    //     { x: 1, y: 20 },
    //     { x: 10, y: 10 },
    //     { x: 20, y: 30 },
    //     { x: 30, y: 10 },
    //     { x: 40, y: 40 },
    //     { x: 50, y: 50 },
    //     { x: 60, y: 20 },
    //     { x: 70, y: 0 }
    // ];
    let dataPoints = nums
    // console.log(dataPoints);
    let minX = Math.min(...dataPoints.map(point => point.x));
    let maxX = Math.max(...dataPoints.map(point => point.x));
    let minY = Math.min(...dataPoints.map(point => point.y));
    let maxY = Math.max(...dataPoints.map(point => point.y));

    let xScale = (canvas.width - 20) / (maxX - minX);
    let yScale = (canvas.height - 20) / (maxY - minY);
    for (let point of dataPoints) {
        let x = 10 + (point.x - minX) * xScale;
        let y = canvas.height - 10 - (point.y - minY) * yScale;
        if (point.y === maxY) {
            if (x - 5 >= 0 && y - 10 >= 0) {
                ctx.fillText(point.y + '°', x - 5, y - 10);
            } else {
                if (x - 5 < 0) x = 5;
                if (y - 10 < 0) y = 10;
                ctx.fillText(point.y + '°', x - 5, y - 10);
            }
        } else {
            if (dataPoints.indexOf(point) === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            ctx.fillText(point.y + '°', x - 5, y - 10);
        }
    }
    ctx.strokeStyle = color;
    // console.log(ctx.strokeStyle);
    ctx.stroke();
}



document.querySelector('.swiper1-prev').addEventListener('click', () => {
    document.querySelector('.swiper1-button-prev').click()
})

document.querySelector('.swiper1-next').addEventListener('click', () => {
    document.querySelector('.swiper1-button-next').click()
})

document.querySelector('.swiper2-prev').addEventListener('click', () => {
    document.querySelector('.swiper2-button-prev').click()
})

document.querySelector('.swiper2-next').addEventListener('click', () => {
    document.querySelector('.swiper2-button-next').click()
})

// 经过显示关注列表
document.querySelector('.position').addEventListener('mouseenter', () => {
    document.querySelector('.subscriptList').classList.remove('hide')
})
// 离开关闭关注列表
// document.querySelector('.position').addEventListener('mouseleave', (event) => {
//     // 检查鼠标事件的相关元素是否是 .subscriptList 或其子元素
//     const isSubscriptList = event.relatedTarget === document.querySelector('.subscriptList') || document.querySelector('.subscriptList').contains(event.relatedTarget);
//     if (!isSubscriptList) {
//         // 如果鼠标离开了 .position 并且没有悬停在 .subscriptList 上，则隐藏 .subscriptList
//         document.querySelector('.subscriptList').classList.add('hide');
//     }
// })

document.querySelector('.subscriptList').addEventListener('mouseleave', () => {
    document.querySelector('.subscriptList').classList.add('hide')
})

let searchInput = document.querySelector('.search input[type="search"]');
let cityList = document.querySelector('.citys');

//-------------------为搜索框添加改变事件，获得里面的内容------------------------------
searchInput.addEventListener('keyup', async (e) => {
    cityList.classList.add('hide')
    document.querySelector('.recommendCitys').classList.remove('hide')
    if (e.target.value.length > 0 && e.key === 'Enter') {
        // console.log(e.target.value);
        try {
            const area = await axios({
                url: 'https://geoapi.qweather.com/v2/city/lookup',
                params: {
                    location: e.target.value,
                    key: 'f5acfe55561e4433b5a99c7de7e51a75',
                    // range: cn
                }
            })
            const aStr = area.data.location.map((item) => {
                return `<li class="${item.id}">${item.adm2}，${item.adm1}，${item.name}</li>`
            }).join('')
            // console.log(aStr);
            const rCitys = document.querySelector('.r-citys')
            rCitys.innerHTML = aStr
            rCitys.classList.remove('hide')
            document.querySelector('.notFind').classList.add('hide')
        } catch {
            document.querySelector('.notFind').classList.remove('hide')
            document.querySelector('.r-citys').classList.add('hide')
        }
        // console.log(area);

    }
})


// ------------------为搜索框添加获得焦点事件，显示城市列表----------------------------
searchInput.addEventListener('focus', () => {
    cityList.classList.remove('hide');
});

//---------------------为搜索框添加失去焦点事件，隐藏城市列表---------------------------
searchInput.addEventListener('blur', () => {
    setTimeout(() => {
        cityList.classList.add('hide');
        document.querySelector('.recommendCitys').classList.add('hide')
        const rc = document.querySelector('.r-citys')
        rc.innerHTML = ''
        rc.classList.add('hide')
    }, 500)
});

//----------------------为搜索城市添加点击事件，查询天气-------------------------
document.querySelector('.recommendCitys').addEventListener('click', (e) => {
    // console.log(e.target.getAttribute('class'));
    const area = e.target.getAttribute('class')
    getWeather(area)
})

// -------------------------------保存搜索词到LocalStorage------------------------
function saveSearchTerm(term) {
    // 从LocalStorage获取搜索历史，如果不存在则初始化为空数组
    let searchHistory = localStorage.getItem('searchHistory')
        ? JSON.parse(localStorage.getItem('searchHistory'))
        : [];
    searchHistory = searchHistory.filter(item => item !== term);
    searchHistory.unshift(term);
    const maxHistoryLength = 4;
    searchHistory = searchHistory.slice(0, maxHistoryLength);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// 从LocalStorage获取搜索历史
function getSearchHistory() {
    return localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory')) : [];
}

//--------------------------为城市列表添加点击事件-------------------------------
cityList.addEventListener('click', (e) => {
    // console.log(e);
    if (e.target.tagName === 'SPAN') {
        // console.log(e.target.textContent);
        getWeather(e.target.textContent)
        saveSearchTerm(e.target.textContent)
        const history = getSearchHistory()
        if (history) {
            // console.log(history);
            const historyStr = history.map(element => {
                return `<span>${element}</span>`
            }).join('')
            // console.log(historyStr);
            document.querySelector('.historyCitys').innerHTML = `<p>历史记录</p>
                            <button class="clear">清除</button>` + historyStr
            document.querySelector('.historyCitys').classList.remove('hide')
        }
        cityList.classList.add('hide');
    } else if (e.target.classList.contains('clear')) {
        // console.log(11);
        document.querySelector('.historyCitys').classList.add('hide')
        localStorage.removeItem('searchHistory')
    }
})

//------------------------------------获取城市天气-------------------------------


async function getWeather(location) {
    // 获得地区id
    const response = await axios({
        url: 'https://geoapi.qweather.com/v2/city/lookup',
        params: {
            location,
            key: 'f5acfe55561e4433b5a99c7de7e51a75'
        }
    })
    // console.log(response.data.location[0].id);
    // console.log(response.data.location[0].adm2);
    //得到市区信息
    easyWeather.shi = response.data.location[0].adm2
    // easyWeather.id = response.data.location[0].id
    // console.log(easyWeather.id);

    // 获得天气信息
    const locationId = response.data.location[0].id

    const weatherObj = await axios({
        url: 'https://devapi.qweather.com/v7/weather/now',
        params: {
            location: locationId,
            key: 'f5acfe55561e4433b5a99c7de7e51a75'
        }
    })
    // console.log(weatherObj);
    //获得当地文字天气
    easyWeather.tianqi = weatherObj.data.now.text
    easyWeather.tupian = weatherObj.data.now.icon
    // console.log(tianqi);
    // 生活建议
    const dailyObj = await axios({
        url: 'https://devapi.qweather.com/v7/indices/1d',
        params: {
            location: locationId,
            key: 'f5acfe55561e4433b5a99c7de7e51a75',
            type: 0
        }
    })
    // console.log(dailyObj);
    // 获得空气信息
    const airObj = await axios({
        url: 'https://devapi.qweather.com//v7/air/now',
        params: {
            location: locationId,
            key: 'f5acfe55561e4433b5a99c7de7e51a75'
        }
    })
    // console.log(airObj);

    //获得逐小时预报
    const hourObj = await axios({
        url: 'https://devapi.qweather.com/v7/weather/24h',
        params: {
            location: locationId,
            key: 'f5acfe55561e4433b5a99c7de7e51a75'
        }
    })
    // console.log(hourObj);
    // console.log(hourObj.data.hourly[0].fxTime);


    //渲染逐小时预报
    const hourStr = `<div class="swiper-slide">
                            <ul>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[0].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[0].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[0].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[1].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[1].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[1].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[2].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[2].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[2].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[3].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[3].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[3].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[4].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[4].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[4].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[5].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[5].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[5].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[6].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[5].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[5].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[7].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[7].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[7].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[8].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[8].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[8].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[9].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[9].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[9].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[10].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[10].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[10].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[11].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[11].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[11].temp}°</p>
                                </li>
                            </ul>
                        </div>
                        <div class="swiper-slide">
                            <ul>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[12].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[12].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[12].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[13].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[13].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[13].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[14].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[14].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[14].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[15].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[15].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[15].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[16].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[16].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[16].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[17].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[17].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[17].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[18].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[18].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[18].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[19].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[19].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[19].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[20].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[20].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[20].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[21].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[21].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[21].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[22].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[22].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[22].temp}°</p>
                                </li>
                                <li>
                                    <p style="color: #8a9baf; font-size: 14px;">${hourObj.data.hourly[23].fxTime.match(/T(\d{2}:\d{2})/)[1]}</p>
                                    <img src="./node_modules/qweather-icons/icons/${hourObj.data.hourly[23].icon}.svg" alt=""
                                        style="width: 30px;height: 30px;margin: 10px 0 10px 18px;">
                                    <p style="font-size: 17px;">${hourObj.data.hourly[23].temp}°</p>
                                </li>
                            </ul>
                        </div>`
    document.querySelector('.hour-swiper-wrapper').innerHTML = hourStr


    //渲染七日天气预报
    const dayObj = await axios({
        url: 'https://devapi.qweather.com/v7/weather/7d',
        params: {
            location: locationId,
            key: 'f5acfe55561e4433b5a99c7de7e51a75'
        }
    })
    // console.log(dayObj);
    easyWeather.gaowen = dayObj.data.daily[0].tempMax
    easyWeather.diwen = dayObj.data.daily[0].tempMin
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const date1 = new Date(dayObj.data.daily[3].fxDate);//days[date1.getDay()]
    const date2 = new Date(dayObj.data.daily[4].fxDate);//days[date2.getDay()]
    const date3 = new Date(dayObj.data.daily[5].fxDate);//days[date3.getDay()]
    const date4 = new Date(dayObj.data.daily[6].fxDate);//days[date4.getDay()]

    //---------------------获得昨天-----------------------------------------
    let d = new Date(dayObj.data.daily[0].fxDate);
    d.setDate(d.getDate() - 1);

    let y = d.getFullYear();
    let m = (d.getMonth() + 1).toString().padStart(2, '0');
    let da = d.getDate().toString().padStart(2, '0');

    let result = `${m}月${da}日`;
    // console.log(result);

    //-------------获得月份日期----------------------------------------------
    const mouthDate = dayObj.data.daily.map(item => {
        const date = new Date(item.fxDate);
        let month = (date.getMonth() + 1).toString().padStart(2, '0');
        let day = date.getDate().toString().padStart(2, '0');
        let result = `${month}月${day}日`;
        return result
    })
    mouthDate.unshift(result)
    // console.log(mouthDate);


    //制作折线图
    // let lineMax = dayObj.data.daily.map(item => {
    //     let str = `{ x: 0, y: ${item.tempMax} }`
    //     return JSON.parse(str.replace(/([a-zA-Z]+):/g, '"$1":'));
    // })
    let lineMax = [
        { x: 0, y: 100 },
        { x: 1, y: dayObj.data.daily[5].tempMax },
        { x: 10, y: dayObj.data.daily[0].tempMax },
        { x: 20, y: dayObj.data.daily[1].tempMax },
        { x: 30, y: dayObj.data.daily[2].tempMax },
        { x: 40, y: dayObj.data.daily[3].tempMax },
        { x: 50, y: dayObj.data.daily[4].tempMax },
        { x: 60, y: dayObj.data.daily[5].tempMax },
        { x: 70, y: dayObj.data.daily[6].tempMax }
    ];

    let lineMin = [
        { x: 0, y: 100 },
        { x: 1, y: dayObj.data.daily[5].tempMin },
        { x: 10, y: dayObj.data.daily[0].tempMin },
        { x: 20, y: dayObj.data.daily[1].tempMin },
        { x: 30, y: dayObj.data.daily[2].tempMin },
        { x: 40, y: dayObj.data.daily[3].tempMin },
        { x: 50, y: dayObj.data.daily[4].tempMin },
        { x: 60, y: dayObj.data.daily[5].tempMin },
        { x: 70, y: dayObj.data.daily[6].tempMin }
    ];

    lineChart("high-Canvas", lineMax, 'orange')
    lineChart("low-Canvas", lineMin, 'blue')

    // console.log(lineMax);

    const dayStr = `<li class="firstDay">
                            <p class="day">昨天</p>
                            <p class="date">${mouthDate[0]}</p>
                            <div class="day-time">
                                <p>${dayObj.data.daily[0].textDay}</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[1].iconDay}.svg" alt="">
                                <p class="day-temperature">${dayObj.data.daily[2].tempMax}°</p>
                            </div>
                            <div class="night-time">
                                <p class="night-temperature">${dayObj.data.daily[3].tempMin}°</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[4].iconNight}.svg" alt="">
                                <p>${dayObj.data.daily[5].textNight}</p>
                            </div>
                            <p class="wind">微风${dayObj.data.daily[6].windScaleNight}级</p>
                        </li>
                        <li class="secondDay">
                            <p class="day">今天</p>
                            <p class="date">${mouthDate[1]}</p>
                            <div class="day-time">
                                <p>${dayObj.data.daily[0].textDay}</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[0].iconDay}.svg" alt="">
                                <p class="day-temperature">${dayObj.data.daily[0].tempMax}°</p>
                            </div>
                            <div class="night-time">
                                <p class="night-temperature">${dayObj.data.daily[0].tempMin}°</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[0].iconNight}.svg" alt="">
                                <p>${dayObj.data.daily[0].textNight}</p>
                            </div>
                            <p class="wind">微风${dayObj.data.daily[0].windScaleNight}级</p>
                        </li>
                        <li>
                            <p class="day">明天</p>
                            <p class="date">${mouthDate[2]}</p>
                            <div class="day-time">
                                <p>${dayObj.data.daily[1].textDay}</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[1].iconDay}.svg" alt="">
                                <p class="day-temperature">${dayObj.data.daily[1].tempMax}°</p>
                            </div>
                            <div class="night-time">
                                <p class="night-temperature">${dayObj.data.daily[1].tempMin}°</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[1].iconNight}.svg" alt="">
                                <p>${dayObj.data.daily[1].textNight}</p>
                            </div>
                            <p class="wind">微风${dayObj.data.daily[1].windScaleNight}级</p>
                        </li>
                        <li>
                            <p class="day">后天</p>
                            <p class="date">${mouthDate[3]}</p>
                            <div class="day-time">
                                <p>${dayObj.data.daily[2].textDay}</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[2].iconDay}.svg" alt="">
                                <p class="day-temperature">${dayObj.data.daily[2].tempMax}°</p>
                            </div>
                            <div class="night-time">
                                <p class="night-temperature">${dayObj.data.daily[2].tempMin}°</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[2].iconNight}.svg" alt="">
                                <p>${dayObj.data.daily[2].textNight}</p>
                            </div>
                            <p class="wind">微风${dayObj.data.daily[2].windScaleNight}级</p>
                        </li>
                        <li>
                            <p class="day">${days[date1.getDay()]}</p>
                            <p class="date">${mouthDate[4]}</p>
                            <div class="day-time">
                                <p>${dayObj.data.daily[3].textDay}</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[3].iconDay}.svg" alt="">
                                <p class="day-temperature">${dayObj.data.daily[3].tempMax}°</p>
                            </div>
                            <div class="night-time">
                                <p class="night-temperature">${dayObj.data.daily[3].tempMin}°</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[3].iconNight}.svg" alt="">
                                <p>${dayObj.data.daily[3].textNight}</p>
                            </div>
                            <p class="wind">微风${dayObj.data.daily[3].windScaleNight}级</p>
                        </li>
                        <li>
                            <p class="day">${days[date2.getDay()]}</p>
                            <p class="date">${mouthDate[5]}</p>
                            <div class="day-time">
                                <p>${dayObj.data.daily[4].textDay}</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[4].iconDay}.svg" alt="">
                                <p class="day-temperature">${dayObj.data.daily[4].tempMax}°</p>
                            </div>
                            <div class="night-time">
                                <p class="night-temperature">${dayObj.data.daily[4].tempMin}°</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[4].iconNight}.svg" alt="">
                                <p>${dayObj.data.daily[4].textNight}</p>
                            </div>
                            <p class="wind">微风${dayObj.data.daily[4].windScaleNight}级</p>
                        </li>
                        <li>
                            <p class="day">${days[date3.getDay()]}</p>
                            <p class="date">${mouthDate[6]}</p>
                            <div class="day-time">
                                <p>${dayObj.data.daily[5].textDay}</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[5].iconDay}.svg" alt="">
                                <p class="day-temperature">${dayObj.data.daily[5].tempMax}°</p>
                            </div>
                            <div class="night-time">
                                <p class="night-temperature">${dayObj.data.daily[5].tempMin}°</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[5].iconNight}.svg" alt="">
                                <p>${dayObj.data.daily[5].textNight}</p>
                            </div>
                            <p class="wind">微风${dayObj.data.daily[5].windScaleNight}级</p>
                        </li>
                        <li>
                            <p class="day">${days[date4.getDay()]}</p>
                            <p class="date">${mouthDate[7]}</p>
                            <div class="day-time">
                                <p>${dayObj.data.daily[6].textDay}</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[6].iconDay}.svg" alt="">
                                <p class="day-temperature">${dayObj.data.daily[6].tempMax}°</p>
                            </div>
                            <div class="night-time">
                                <p class="night-temperature">${dayObj.data.daily[6].tempMin}°</p>
                                <img src="./node_modules/qweather-icons/icons/${dayObj.data.daily[6].iconNight}.svg" alt="">
                                <p>${dayObj.data.daily[6].textNight}</p>
                            </div>
                            <p class="wind">微风${dayObj.data.daily[6].windScaleNight}级</p>
                        </li>`
    document.querySelector('.forecast_container ul').innerHTML = dayStr

    // 渲染当地天气
    const provinceStr = `<p>&nbsp;${response.data.location[0].adm1}&nbsp;${response.data.location[0].adm2}</p>`
    document.querySelector('.position').innerHTML = provinceStr

    const weatherStr = `<p>中央气象台${weatherObj.data.updateTime.match(/T(\d{2}:\d{2})/)[1]}发布</p>
            <div class="temperature">${weatherObj.data.now.temp}°</div>
            <div class="weather">${weatherObj.data.now.text}</div>
            <div class="airQuality">
                &nbsp;${airObj.data.now.aqi}&nbsp;${airObj.data.now.category}
                <div class="airContainer hide">
                    <div class="triangle"></div>
                    <p>空气质量指数&nbsp;${airObj.data.now.aqi}&nbsp;${airObj.data.now.category}</p>
                    <ul class="airCondition">
                        <li>
                            <p>${airObj.data.now.pm2p5}</p>
                            <p class="airKinds">PM2.5</p>
                        </li>
                        <li><p>${airObj.data.now.pm10}</p>
                            <p class="airKinds">PM10</p></li>
                        <li><p>${airObj.data.now.so2}</p>
                            <p class="airKinds">SO2</p></li>
                        <li><p>${airObj.data.now.no2}</p>
                            <p class="airKinds">NO2</p></li>
                        <li><p>${airObj.data.now.o3}</p>
                            <p class="airKinds">O3</p></li>
                        <li><p>${airObj.data.now.co}</p>
                            <p class="airKinds">CO</p></li>
                    </ul>
                </div>
            </div>
            <div class="items">
                <div class="wind">${weatherObj.data.now.windDir}&nbsp;${dayObj.data.daily[0].windScaleDay}级</div>
                <div class="humidity">湿度&nbsp;${weatherObj.data.now.humidity}%</div>
                <div class="airPressure">气压&nbsp;${weatherObj.data.now.pressure}hPa</div>
                <div class="trafficInformation">不限行</div>
            </div>
            <ul class="advice">
                <li>现在的温度比较舒适~</li>
            </ul>
            <img src="./node_modules/qweather-icons/icons/${weatherObj.data.now.icon}.svg" alt="" class="weather_img">`
    document.querySelector('.current_weather').innerHTML = weatherStr


    //渲染生活指数

    const dailyStr = `<div class="swiper-slide">
                                <ul class="advice_items">
                                    <li>
                                        <div class="advice_item">
                                            <span class="icon iconfont" data-num="1">&#xe8c7;</span>
                                            <p>穿衣&nbsp;${dailyObj.data.daily[2].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[2].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item">
                                            <span class="icon iconfont" data-num="2">&#xf53a;</span>
                                            <p>雨伞&nbsp;${dailyObj.data.daily[11].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[11].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item">
                                            <span class="icon iconfont" data-num="3">&#xe65a;</span>
                                            <p>感冒&nbsp;${dailyObj.data.daily[8].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[8].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item">
                                            <span class="icon iconfont" data-num="4">&#xe658;</span>
                                            <p>洗车&nbsp;${dailyObj.data.daily[1].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[1].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item">
                                            <span class="icon iconfont" data-num="5">&#xe6c9;</span>
                                            <p>运动&nbsp;${dailyObj.data.daily[0].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[0].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item">
                                            <span class="icon iconfont" data-num="6">&#xe69f;</span>
                                            <p>防晒&nbsp;${dailyObj.data.daily[15].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[15].text}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="swiper-slide">
                                <ul class="advice_items">
                                    <li>
                                        <div class="advice_item">
                                            <span class="icon iconfont" data-num="7">&#xe975;</span>
                                            <p>钓鱼&nbsp;${dailyObj.data.daily[3].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[3].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item">
                                            <span class="icon iconfont" data-num="8">&#xe6b9;</span>
                                            <p>旅游&nbsp;${dailyObj.data.daily[5].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[5].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item"><span class="icon iconfont"
                                                data-num="9">&#xe918;</span>
                                            <p>交通&nbsp;${dailyObj.data.daily[14].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[14].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item"><span class="icon iconfont"
                                                data-num="10">&#xe6ac;</span>
                                            <p>空气污染扩散条件&nbsp;${dailyObj.data.daily[9].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[9].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item"><span class="icon iconfont"
                                                data-num="11">&#xe688;</span>
                                            <p>舒适度&nbsp;${dailyObj.data.daily[7].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[7].text}
                                            </div>
                                        </div>
                                    </li>
                                    <li>
                                        <div class="advice_item"><span class="icon iconfont"
                                                data-num="12">&#xe6be;</span>
                                            <p>晾晒&nbsp;${dailyObj.data.daily[13].category}</p>
                                            <div class="advice-detail">
                                                ${dailyObj.data.daily[13].text}
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>`
    document.querySelector('.daily-swiper-wrapper').innerHTML = dailyStr

    //--------------------渲染添加关注制作------------------
    // document.querySelector('.added').addEventListener('load', (e) => {
    //     e.target.classList.add('addSubscript')
    //     e.target.innerHTML = '[添加关注]'
    // })
    addSub(easyWeather.shi)
}
getWeather('西安')
// ------------------------------------------渲染添加关注制作-------------------------------------------
function addSub(nowshi) {
    const add = document.querySelector('.added')
    // console.log(add);
    const subStr = getSubHistory()
    let ex = false
    for (let item of subStr) {
        if (item.shi == nowshi) {
            ex = true
        }
    }
    // console.log(ex);
    if (!ex) {
        add.classList.add('addSubscript')
        add.innerHTML = '[添加关注]'
    } else {
        add.classList.remove('addSubscript')
        add.innerHTML = '[已关注]'
    }
}


document.querySelector('.addSubscript').addEventListener('click', (e) => {
    e.target.classList.remove('addSubscript')
    e.target.innerHTML = '[已关注]'

    // console.log(easyWeather.tianqi);
    // console.log(easyWeather.shi);
    // console.log(easyWeather.tupian);
    // console.log(easyWeather.gaowen);
    // console.log(easyWeather.diwen);
    saveSubTerm(easyWeather)
    loadSubList()
})

function saveSubTerm(term) {
    let easyWeather = localStorage.getItem('easyWeather') ? JSON.parse(localStorage.getItem('easyWeather')) : []
    easyWeather = easyWeather.filter(item => item.shi !== term.shi);
    easyWeather.unshift(term);
    const maxLength = 5
    easyWeather = easyWeather.slice(0, maxLength)
    localStorage.setItem('easyWeather', JSON.stringify(easyWeather))
}

function getSubHistory() {
    return localStorage.getItem('easyWeather') ? JSON.parse(localStorage.getItem('easyWeather')) : [];
}

// 渲染关注制作
function loadSubList() {
    const weathers = getSubHistory()
    // console.log(weathers);
    if (weathers[0]) {
        document.querySelector('.default').classList.add('hide')
        const wStr = weathers.map(item => {
            return `<p data-city="${item.shi}">
                                <span>${item.shi}</span>
                                <span><img src="./node_modules/qweather-icons/icons/${item.tupian}.svg" alt="">小雨</span>
                                <span>${item.diwen}°/${item.gaowen}°</span>
                                <span class="font iconfont sub-del">&#xe61e;</span>
                            </p>`
        }).join('')
        // console.log(wStr);
        document.querySelector('.subItems').innerHTML = wStr
    } else {
        document.querySelector('.subItems').innerHTML = ''
        document.querySelector('.default').classList.remove('hide')
    }
    addDel()
}
loadSubList()

//删除关注制作
function addDel() {
    document.querySelectorAll('.sub-del').forEach(item => {
        item.addEventListener('click', (e) => {
            const city = e.target.parentNode.getAttribute('data-city');
            // console.log(city);
            delSub(city);
            // console.log(11);
            loadSubList();
            addSub(city)
        });
    });
}
// document.querySelectorAll('.sub-del').forEach(item => {
//     item.addEventListener('click', (e) => {
//         const city = e.target.parentNode.getAttribute('data-city');
//         // console.log(city);
//         delSub(city);
//         // console.log(11);
//         loadSubList();
//     });
// });
function delSub(area) {
    let easyWeather = localStorage.getItem('easyWeather') ? JSON.parse(localStorage.getItem('easyWeather')) : []
    // console.log('Before:', easyWeather); // 打印删除前的数据
    easyWeather = easyWeather.filter(item => item.shi !== area);

    // if (easyWeather[0].shi === area.shi) {
    //     localStorage.removeItem('easyWeather')
    //     return
    // }
    // console.log('After:', easyWeather); // 打印删除后的数据
    localStorage.setItem('easyWeather', JSON.stringify(easyWeather))
}

//------------------------点击关注跳转----------------------------------
document.querySelector('.subItems').addEventListener('click', (e) => {
    if (e.target.tagName === 'SPAN' && !e.target.classList.contains('sub-del')) {
        // console.log(e.target.parentNode.getAttribute('data-city'));
        getWeather(e.target.parentNode.getAttribute('data-city'))
    } else if (e.target.classList.contains('sub-del')) {
        // console.log(11);
        const city = e.target.parentNode.getAttribute('data-city');
        // console.log(city);
        delSub(city);
        // console.log(11);
        loadSubList();
        addSub(city)
    }
})
