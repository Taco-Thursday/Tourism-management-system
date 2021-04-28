<template>
<div class="page-collection">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods' }"><a href="javascript:;">景点推荐</a></el-breadcrumb-item>
        <el-breadcrumb-item><a href="javascript:;">我的收藏</a></el-breadcrumb-item>
    </el-breadcrumb>
    <main>
        <div class="main-goods" v-for="item in collectionData" :key="item.id" @click="onGoods(item.id)">
            <img class="main-img" :src="'http://localhost:3000'+item.img" alt="">
            <h3 style="margin: 15px 0">{{item.goodsname}}</h3>
            <div style="color: #f00;">
                <span>￥</span>
                <span style="font-size: 20px;font-weight: bold">{{item.price}}</span>
                <span style="font-size: 30px;position: relative;left:60px;top: 3px">♥</span>
            </div>
        </div>
    </main>
</div>
</template>

<script>
export default {
name: "Collection",
    data(){
        return{
            collection: [],
            users: [],
            goodsData: [],
            collectionData: [],
        }
    },
    mounted() {
        this.http.get('/api/userinfo', { id: this.$store.state.userinfo.id }).then(res => {
            this.users = res.list[0];
            if (this.users.collection.length > 0) {
                this.collection = this.users.collection.split(',');
            }
        });
        this.http.get('/api/goods').then(res =>{
            this.goodsData = res.list;
            this.collection.forEach(item => {
                let info = this.goodsData.filter(arr => {
                    return String(arr.id) === item;
                })
                this.collectionData.push(info[0]);
            });
        });
    },
    methods:{
        //点击详情
        onGoods(id){
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
    },
}
</script>

<style scoped>
.page-collection main{
    width: 100%;
    margin: 30px 0;
    border-radius: 5px;
}
.page-collection main .main-goods{
    float: left;
    position: relative;
    width: 17.5%;
    height: 360px;
    margin-bottom: 15px;
    padding: 10px;
    text-align: center;
    background: #fff;
    margin-right: 10px;
    border-radius: 10px;
    box-shadow: 3px 5px 5px #bdbaba;
    transition: all 1s ease-in-out;
}
.page-collection main .main-goods:hover{
    bottom: 5px;
    cursor: pointer;

    box-shadow: 10px 10px 10px #cdc8c8;
}
.page-collection main .main-goods .main-img{
    width: 90%;
    min-height: 68%;
}
</style>
