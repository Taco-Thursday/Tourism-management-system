<template>
    <div class="page-details">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods' }"><a href="javascript:;">景点推荐</a></el-breadcrumb-item>
            <el-breadcrumb-item><a href="javascript:;">景点详情</a></el-breadcrumb-item>
        </el-breadcrumb>
        <div class="main">
            <div style="flex: 1;text-align: center" class="main-text">
                <img class="main-img" :src="'http://localhost:3000'+detailData.img" alt="">
            </div>
            <div style="flex: 1" class="main-text">
                <h2 style="text-align: center;margin: 100px 0 20px">{{ detailData.goodsname }}</h2>
                <div v-if="detailData.description" class="main-description" v-html="detailData.description"></div>
                <div v-else class="main-description">
                    该景点暂时没有具体详情内容，请等待景点管理员发布！
                </div>
                <div style="display: flex;justify-content: center;padding: 20px 0">
                    <el-button type="success" @click="dialogVisible = true">预约</el-button>
                    <el-button v-if="collectionVisible" @click="onCollection">收藏</el-button>
                    <el-button v-else type="danger" @click="onCancelCollection">已收藏</el-button>
                </div>
            </div>
        </div>
        <el-dialog
            title="咨询信息"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <div style="margin-bottom: 10px">
                景点管理员：{{detailData.contact}}
            </div>
            <div>
                咨询电话：{{detailData.phone}}
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Details",
    data() {
        return {
            detailData: {},
            dialogVisible:false,
            collection: [],
            users: [],
            collectionVisible: true,
        }
    },
    mounted() {
        if (this.$route.params.id) {
            this.detailData = this.$route.params;
            this.http.get('/api/userinfo', { id: this.$store.state.userinfo.id }).then(res => {
                this.users = res.list[0];
                if (this.users.collection.length > 0) {
                    this.collection = this.users.collection.split(',');
                    let list = this.collection.filter(item => {
                        return String(this.$route.params.id) === item;
                    });
                    this.collectionVisible = list[0] !== String(this.$route.params.id);
                }
            })
        } else {
            this.$message({
                message: '没有具体景点信息！',
                type: 'warning'
            });
            this.$router.push('/goods');
        }
    },
    methods: {
        onCancelCollection(){
            let id = this.$store.state.userinfo.id;
            let index = this.collection.findIndex(item => {
                return String(this.$route.params.id) === item;
            });
            this.collection.splice(index,1);
            this.http.post("/api/userCollection", {id,collection:this.collection}).then(res =>{
                this.collectionVisible = true;
            })
        },
        onCollection(){
            let id = this.$store.state.userinfo.id;
            this.collection.push(String(this.$route.params.id));
            this.collection = [...new Set(this.collection)];
            this.http.post("/api/userCollection", {id,collection:this.collection}).then(res => {
                let list = this.collection.filter(item => {
                    return String(this.$route.params.id) === item;
                });
                this.collectionVisible = list[0] !== String(this.$route.params.id);
            })
        },
        handleClose(done){
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {});
        },
    },
}
</script>

<style scoped>
.page-details .main {
    width: 100%;
    height: 500px;
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.page-details .main .main-text {
    width: 100%;
    height: 100%;
}

.page-details .main .main-description {
    text-align: center;
    margin: 10px 0;
    min-height: 100px;
}
.page-details .main .main-img{
    width: 60%;
}
</style>
