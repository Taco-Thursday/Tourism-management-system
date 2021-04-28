<template>
    <div class="page-goods">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="javascript:;">景点推荐</a></el-breadcrumb-item>
        </el-breadcrumb>
        <div class="app-container">
            <el-input style="margin-right: 10px;width: 30%;" v-model="searchData" @input="onResetSerch" placeholder="请输入内容"></el-input>
            <el-button
                type="success"
                @click="onSearch"
                class="add-btn"
            >搜索
            </el-button>
            <el-button
                v-show="roleid !== 5"
                type="primary"
                @click="handleAdd"
                class="add-btn"
            >添加
            </el-button>
            <!-- 商品列表 -->
            <el-table
                :data="goodsData"
                border
                style="width: 100%"
            >
                <el-table-column
                    label="一级分类"
                    width="150"
                >
                    <template slot-scope="scope">
                        {{ scope.row.firstcatename }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="二级分类"
                    width="150"
                >
                    <template slot-scope="scope">
                        {{ scope.row.secondcatename }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="景点名称"
                >
                    <template slot-scope="scope">
                        {{ scope.row.goodsname }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="门票价格"
                    width="120"
                >
                    <template slot-scope="scope">
                        {{ scope.row.price }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="接待人数"
                    width="120"
                >
                    <template slot-scope="scope">
                        {{ scope.row.market_price }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="浏览次数"
                    width="120"
                >
                    <template slot-scope="scope">
                        {{ scope.row.browse_num }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="150"
                >
                    <template slot-scope="scope">
                        <el-tag
                            effect="dark"
                            type="success"
                            v-if="scope.row.status===1"
                        >营业中
                        </el-tag>
                        <el-tag
                            effect="dark"
                            type="danger"
                            v-else
                        >非营业
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-show="roleid !== 5"
                            size="mini"
                            type="primary"
                            @click="handleEdit(scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            @click="onDetails(scope.row)"
                        >查看详情
                        </el-button>
                        <el-button
                            v-show="roleid !== 5"
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.row)"
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="pagesize"
                :total="pagecount"
                @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
        <!-- 景点添加/修改 -->
        <el-dialog
            :title="'景点'+tip"
            :visible.sync="infoVisible"
            width="60%"
            @close="handleReset"
            @opened="handleOpen"
        >
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
                <el-form-item label="一级分类" prop="first_cateid">
                    <el-select
                        v-model="form.first_cateid"
                        placeholder="请选择分类"
                        @change="handleCateChange($event)"
                    >
                        <el-option
                            v-for="item in firstarr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="二级分类" prop="second_cateid">
                    <el-select v-model="form.second_cateid" placeholder="请选择分类">
                        <el-option
                            v-for="item in secondarr"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="景点名称" prop="goodsname">
                    <el-input v-model="form.goodsname" placeholder="请输入景点名称"></el-input>
                </el-form-item>
                <el-form-item label="景点图片">
                    <el-upload
                        action="#"
                        list-type="picture-card"
                        :on-change="handleChangeFile"
                        :file-list="fileList"
                        :multiple="false"
                        :auto-upload="false"
                        ref="prodimg"
                    >
                        <i slot="default" class="el-icon-plus"></i>
                        <div slot="file" slot-scope="{file}">
                            <img
                                class="el-upload-list__item-thumbnail"
                                :src="file.url" alt=""
                            >
                            <span class="el-upload-list__item-actions">
                                <span
                                    class="el-upload-list__item-preview"
                                    @click="handlePictureCardPreview(file)"
                                >
                                    <i class="el-icon-zoom-in"></i>
                                </span>
                                <span
                                    v-if="!disabled"
                                    class="el-upload-list__item-delete"
                                    @click="handleRemove(file)"
                                >
                                    <i class="el-icon-delete"></i>
                                </span>
                            </span>
                        </div>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                </el-form-item>
                <el-form-item label="景点等级">
                    <el-select v-model="form.specsid" @change="handleSpecsChange" filterable placeholder="请选择商品规格名">
                        <el-option
                            v-for="item in specsarr"
                            :key="item.id"
                            :label="item.specsname"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="景点星级">
                    <el-select v-model="form.specsattr" :multiple="true" placeholder="请选择商品规格值">
                        <el-option
                            v-for="item in specsattrs"
                            :key="item"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="门票价格">
                    <el-input v-model="form.price" :disabled="!form.status"></el-input>
                </el-form-item>
                <el-form-item label="接待人数">
                    <el-input v-model="form.market_price" type="number" :disabled="!form.status"></el-input>
                </el-form-item>
                <el-form-item label="景点管理员" prop="contact">
                    <el-input v-model="form.contact" placeholder="请输入景点管理员"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <el-form-item label="是否热门">
                    <template>
                        <el-radio v-model="form.isnew" :label="true">是</el-radio>
                        <el-radio v-model="form.isnew" :label="false">否</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="是否开通">
                    <template>
                        <el-radio v-model="form.ishot" :label="true">是</el-radio>
                        <el-radio v-model="form.ishot" :label="false">否</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="景点简历">
                    <div id="editor" ref="editorElem" style="text-align:left"></div>
                </el-form-item>
                <el-form-item label="状态">
                    <template>
                        <el-radio v-model="form.status" :label="true">营业</el-radio>
                        <el-radio v-model="form.status" :label="false">非营业</el-radio>
                    </template>
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button @click="handleReset('form')">取 消</el-button>
                <el-button
                    type="primary"
                    @click="handleSubmit('form')"
                >确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import $ from 'jquery'
import axios from 'axios'
import E from 'wangeditor'

export default {
    data() {
        return {
            browse_num:'',
            roleid: '',
            searchData: '',
            goodsData: [],
            pagesize: 10,
            page: 1,
            pagecount: 0,
            infoVisible: false,
            formLabelWidth: '120px',
            tip: '添加',
            editor: null,
            form: {
                browse_num: 0,
                first_cateid: '',
                second_cateid: '',
                goodsname: '',
                img: '',
                price: '',
                market_price: '',
                description: '',
                contact:'',
                phone:'',
                specsid: '',
                specsattr: '',
                isnew: false,
                ishot: false,
                status: true
            },
            firstarr: [],
            secondarr: [],
            specsarr: [],
            specsattrs: [],
            rules: {
                cateid: [
                    {required: true, message: '请选择景点分类', trigger: 'blur'}
                ],
                title: [
                    {required: true, message: '请输入景点标题', trigger: 'blur'},
                    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                ]
            },
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            fileList: []
        }
    },
    mounted() {
        this.getCount();
        this.getPage();
        this.roleid = this.$store.getters.userinfo.roleid;
    },
    methods: {
        onDetails(e){
            e.browse_num++;
            this.http.post("/api/goodsDetils", {id:e.id,browse_num:e.browse_num}).then(res => {

            })
            this.$router.push({
                name:'detail',
                params:e
            })
        },
        onResetSerch() {
            if (!this.searchData) {
                this.getCount();
                this.getPage();
            }
        },
        onSearch() {
            if (this.searchData) {
                this.goodsData = this.goodsData.filter(item => {
                    // 判断indexOf
                    return item.goodsname.toString().indexOf(this.searchData) >= 0;
                });
            }
        },
        getCount() {
            this.http.get("/api/goodscount").then(res => {
                this.pagecount = res.list[0].total;
            })
        },
        getPage() {
            this.http.get('/api/goodslist', {size: this.pagesize, page: this.page}).then(res => {
                this.goodsData = res.list || [];
            })
        },
        getCategory(pid = 0) {
            this.http.get('/api/catelist', {pid: pid}).then(res => {
                if (pid === 0) {
                    this.firstarr = res.list;
                } else {
                    this.secondarr = res.list;
                }
            })
        },
        getSpecs() {
            this.http.get('/api/specslist').then(res => {
                this.specsarr = res.list;
                this.specsarr.map(d => {
                    if (d.id === this.form.specsid) {
                        this.specsattrs = d.attrs;
                    }
                })
            });
        },
        handleCateChange(e) {
            this.secondarr = [];
            this.getCategory(e)
        },
        handleAdd() {
            this.getCategory();
            this.getSpecs();
            $(".el-upload-list--picture-card").html("")
            this.infoVisible = true;
        },
        handleEdit(row) {
            this.infoVisible = true;
            let id = row.id;
            this.tip = '修改'
            this.http.get('/api/goodsinfo', {id}).then(res => {
                let info = res.list[0];
                this.getCategory();
                if (info.first_cateid) {
                    this.getCategory(info.first_cateid);
                }
                info.id = id;
                info.isnew = info.isnew === 1;
                info.ishot = info.ishot === 1;
                info.status = info.status === 1;
                this.form = info;
                this.getSpecs();
                this.form.specsattr = info.specsattr.split(',')
                if (info.img) {
                    this.fileList = [{name: '', url: this.imgdomain + info.img}]
                }
            })
        },
        handleSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (!valid) {
                    return;
                }
                this.form.isnew = this.form.isnew ? 1 : 2;
                this.form.ishot = this.form.ishot ? 1 : 2;
                this.form.status = this.form.status ? 1 : 2;
                this.form.specsattr = this.form.specsattr ? this.form.specsattr.join(",") : ""
                let url = this.form.id ? '/api/goodsedit' : '/api/goodsadd';
                var data = new FormData();
                for (let i in this.form) {
                    data.append(i, this.form[i]);
                }
                axios({
                    method: 'post',
                    url,
                    data,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': sessionStorage.getItem('token')
                    }
                }).then(res => {
                    res = res.data;
                    if (res.code === 200) {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        });
                        this.infoVisible = false;
                        this.getPage();
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })
            });
        },
        handleReset() {
            this.infoVisible = false;
            this.tip = '添加';
            this.form = {
                first_cateid: '',
                second_cateid: '',
                goodsname: '',
                img: '',
                price: '',
                market_price: '',
                description: '',
                specsid: '',
                specsattr: '',
                isnew: false,
                ishot: false,
                status: true
            };
            $(".el-upload-list--picture-card").html("");

        },
        handleOpen() {
            $('#editor').empty();
            this.editor = new E('#editor');
            this.editor.customConfig.onchange = (html) => {
                this.form.description = html;
            };
            this.editor.create();
            this.editor.txt.html(this.form.description);
        },
        handleDelete(row) {
            this.http.post('/api/goodsdelete', {id: row.id}).then(res => {
                console.log(res, 111)
                if (res.code !== 200) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    })
                    // this.categorys = res.list;
                    this.getPage();
                }
            })
        },
        handleRemove() {
            $(".el-upload-list--picture-card").html("")
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleChangeFile(file) {
            this.form.img = file.raw
        },
        handleCurrentChange: function (currentPage) {
            this.page = currentPage;
            this.getPage();
        },
        handleSpecsChange() {
            var nowselect = this.specsarr.find((d, i) => {
                return d.id === this.form.specsid
            });
            this.form.specsid = nowselect.id;
            this.specsattrs = nowselect.attrs;
        }
    }
}
</script>

<style>
/*.page-goods .el-input {
    width: 30%;
    margin-right: 10px;
}*/
</style>
