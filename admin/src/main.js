// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import qs from 'qs';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {get, post} from './utils/http'

const http = {get, post}
import App from './App';
import router from './router';
import store from './store'
import axios from 'axios'
import $ from 'jquery'
import echarts from 'echarts'
import VueAMap from 'vue-amap';

Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.qs = qs;
Vue.prototype.http = http
Vue.prototype.imgdomain = 'http://localhost:3000'
Vue.prototype.$ = $;
Vue.prototype.axios = axios;
Vue.prototype.$echarts = echarts;

Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
    key: '31074a0d7c30a1b29ae70b088b1df0ae',
    plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation', 'AMap.Geocoder'],
    // 默认高德 sdk 版本为 1.4.4
    v: '1.4.4'
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
