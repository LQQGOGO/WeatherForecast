// import axios from 'axios';
// const axios = require('axios');
//为swiper插件按钮绑定点击事件
document.querySelector('.swiper1-prev').addEventListener('click',() => {
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

//获取城市天气
async function getWeather(location) {
    // 获得地区id
    const response = await axios({
        url: 'https://geoapi.qweather.com/v2/city/lookup',
        params: {
            location,
            key: 'f5acfe55561e4433b5a99c7de7e51a75'
        }
    })
    console.log(response.data.location[0].id);
    // 获得天气信息
    const locationId = response.data.location[0].id
    
    const weatherObj = await axios({
        url: 'https://devapi.qweather.com/v7/weather/now',
            params: {
                location: locationId,
                key: 'f5acfe55561e4433b5a99c7de7e51a75'
            }
    })
    console.log(weatherObj);
    
    // 生活建议
    const dailyObj = await axios({
        url: 'https://devapi.qweather.com/v7/indices/1d',
        params: {
            location: locationId,
            key: 'f5acfe55561e4433b5a99c7de7e51a75',
            type: 0
        }
    })
    console.log(dailyObj);
    // 获得空气信息
    const airObj = await axios({
        url: 'https://devapi.qweather.com//v7/air/now',
        params: {
            location: locationId,
            key: 'f5acfe55561e4433b5a99c7de7e51a75'
        }
    })
    console.log(airObj);
    // 渲染当地天气

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
                <div class="wind">${weatherObj.data.now.windDir}&nbsp;${weatherObj.data.now.windScale}级</div>
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


}

getWeather('西安')