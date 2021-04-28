<template>
    <div>
        <div class="app-container">
            <div class="overview-layout">
                <el-carousel indicator-position="outside" type="card" :interval="4000">
                    <el-carousel-item v-for="item in bannerData" :key="item.id">
                        <img style="width: 100%" :src="'http://localhost:3000'+item.img" class="banner-img" alt="">
                    </el-carousel-item>
                </el-carousel>
                <div style="display: flex;align-items: center;justify-content: space-around">
                    <div id="main" style="width: 680px;height:680px;"></div>
                    <div class="amap-wrapper">
                        <el-amap-search-box class="search-box" :search-option="searchOption"
                                            :on-search-result="onSearchResult"></el-amap-search-box>
                        <el-amap class="amap-box"
                                 ref="map"
                                 :vid="'amap-vue'"
                                 :plugin="plugin"
                                 :center="center"
                                 :events="events"
                                 :zoom="zoom"
                        >
                            <el-amap-marker
                                vid="marker"
                                :position="center"
                                :label="label">
                            </el-amap-marker>
                            <el-amap-circle vid="circle"
                                            :center="center"
                                            :radius="radius"
                                            fill-opacity="0.2"
                                            strokeColor="#38f"
                                            strokeOpacity="0.8"
                                            strokeWeight="1"
                                            fillColor="#38f"
                            ></el-amap-circle>
                        </el-amap>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { AMapManager } from "vue-amap";
let amapManager = new AMapManager();
let Geocoder; //先声明变量，
export default {
    data() {
        return {
            searchOption: {
                city: '洛阳',
                citylimit: true
            },
            amapManager,
            map: null,
            radius: 240,
            label: {},
            center: [112.605096, 34.629932],
            events: {
                init: (o) => {
                    o.getCity((result) => {
                        // console.log(result);
                    });
                },
                moveend: () => {},
                zoomchange: () => {},
                click: (e) => {
                    self.center = [e.lnglat.lng, e.lnglat.lat];
                    Geocoder.getAddress(self.center, function (status, result) { //根据坐标获取位置
                        if (status === "complete" && result.info === "OK") {
                            self.input = result.regeocode.formattedAddress;
                            document.querySelector(".search-box-wrapper input").value =
                                self.input;
                        }
                    });
                }},
            zoom: 15,
            plugin: [
                {
                    pName: 'OverView',
                    //isOpen:true//鹰眼是否打开
                },
                {
                    pName: 'MapType',
                    //卫星与地图切换
                    defaultType: 0,
                    showTraffic: true,
                    //实时交通图层
                },
                {
                    pName: 'Scale',
                    events: {
                        init(instance) {
                            // console.log(instance)
                        }
                    }
                },
                {
                    pName: 'ToolBar',
                    events: {
                        init(instance) {
                            // console.log(instance)
                        }
                    }
                },
                {
                    pName: "Geocoder", //使用AMap.Geocoder插件
                    events: {
                        init(o) {
                            Geocoder = o; // o 则是AMap.Geocoder的实例 对外部的Geocoder变量进行赋值，在任何地方就都可以使用了
                            //self.center 具体坐标 （数组格式） ，function 回调函数
                            o.getAddress(self.center, function (status, result) {
                                if (status === "complete" && result.info === "OK") {
                                    //result.regeocode.formattedAddress就是具体位置
                                    self.input = result.regeocode.formattedAddress;
                                    //对搜索组件的input进行赋值
                                    document.querySelector(".search-box-wrapper input").value =
                                        self.input;
                                }
                            });
                        },
                    },
                },
                {
                    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                    pName: "Geolocation", // AMap-Geolocation 定位插件
                    events: {
                        init(o) {
                            //getCurrentPosition 获取当前位置的方法
                            //注意 虽然进页面就会调用这个方法，但是data()中center要有默认值，不然会报错
                            o.getCurrentPosition((status, result) => {
                                if (result && result.position) {
                                    let lng = result.position.lng;
                                    let lat = result.position.lat;
                                    self.center = [lng, lat];
                                    self.loaded = true;
                                    self.zoom = 15;
                                    self.$nextTick(() => {});
                                }
                            });
                        },
                    },
                },
            ],
            echartsData: [],
            goodsData: [],
            bannerData: [],
            value: new Date(),
            /*imgData: [
                {
                    id: 0,
                    idView: require("../../../pulic/img/4.jpg")
                },
                {
                    id: 1,
                    idView: require("../../../pulic/img/5.jpg")
                },
                {
                    id: 2,
                    idView: require("../../../pulic/img/6.jpg")
                },
            ],*/
        }
    },
    methods: {
        //轮播图点击事件
        onCarousel(id){
            let data = this.goodsData.filter(item => {
                return item.id === id;
            });
            data[0].browse_num++;
            this.http.post("/api/goodsDetils", {id: data[0].id, browse_num: data[0].browse_num}).then(res => {
                this.$router.push({
                    name: 'detail',
                    params: data[0]
                })
            })
        },
        //点击搜索后触发的事件
        onSearchResult(pois) {
            this.input = document.querySelector(".search-box-wrapper input").value
            //这边类似模糊查询 会返回一个数组，我就直接取第一个值了。
            this.center = [pois[0].lng, pois[0].lat];
        },
        myEcharts() {
            const myChart = this.$echarts.init(document.getElementById('main'));
            let option = {
                legend: {
                    top: 'bottom'
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                series: [
                    {
                        name: '面积模式',
                        type: 'pie',
                        radius: [50, 250],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data: this.echartsData
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            myChart.on('click', (params) => {
                let data = this.goodsData.filter(item => {
                    return item.id === params.data.id;
                });
                data[0].browse_num++;
                this.http.post("/api/goodsDetils", {id: data[0].id, browse_num: data[0].browse_num}).then(res => {
                    this.$router.push({
                        name: 'detail',
                        params: data[0]
                    })
                })
            })
        },
    },
    //调用
    mounted() {
        this.http.get('/api/goods').then(res => {
            this.goodsData = res.list || [];
            this.goodsData.forEach(item => {
                this.echartsData.push({
                    value: item.browse_num,
                    name: item.goodsname,
                    id: item.id
                })
            });
            this.myEcharts();
        });
        this.http.get('/api/bannerlist').then(res => {
            this.bannerData = res.list || []
        })
    }
};
</script>

<style>
/*.app-container {
    margin: 40px 40px 0;
}*/
.app-container .overview-layout {
    margin-top: 20px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
}

.app-container .el-carousel__container {
    height: 400px !important;
}

.banner-img {
    width: 100%;
    height: 100%;
}

.images {
    width: 300px;
    height: 150px;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

.amap-wrapper {
    width: 500px;
    height: 500px;
}

.amap-wrapper .el-vue-search-box-container{
    left: 60px;
    top: 60px;
    opacity: .75;
}

</style>
