<template>
    <div class="login_bg">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="login">
                <div class="content">
                    <h1>旅游景点管理系统</h1>
                    <el-form-item label-width="0px" prop="username">
                        <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label-width="0px" prop="password">
                        <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label-width="0px" style="margin-bottom: 0">
                        <el-button type="success" @click="submitForm('ruleForm')">登录</el-button>
                    </el-form-item>
                    <el-form-item label-width="0px">
                        <el-button @click="onRegister">注册</el-button>
                    </el-form-item>
                </div>
            </el-form>
        <el-dialog
            :title="'管理员注册'"
            :visible.sync="infoVisible"
            width="30%"
            @close="handleReset"
        >
            <el-form
                :model="form"
                ref="form"
                label-width="80px"
                class="demo-form"
            >
                <el-form-item
                    label="角色"
                    prop="roleid"
                    :rules="[
                      { required: true, message: '请选择用户角色', trigger: 'blur' }
                    ]"
                >
                    <el-select
                        style="width: 100%;"
                        v-model="form.roleid"
                        placeholder="请选择角色"
                    >
                        <el-option
                            v-for="item in roles"
                            :key="item.id"
                            :label="item.rolename"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="用户名"
                    prop="username"
                    :rules="[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                    ]"
                >
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item
                    label="密码"
                    prop="password"
                    :rules="[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                    ]"
                >
                    <el-input
                        v-model="form.password"
                        type="password"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    @click="handleSubmit('form')"
                >确 定</el-button>
                <el-button @click="handleReset('form')">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ruleForm: {
                username: '',password:''
            },
            infoVisible: false,
            form: {
                roleid: '',
                username: '',
                password: '',
                status: true,
                collection: [],
            },
            roles: [],
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
            },
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.http.post('/api/userlogin',this.ruleForm).then(res=>{
                        if(res.code === 200){
                            sessionStorage.setItem("user",JSON.stringify(res.list));
                            sessionStorage.setItem("token",res.list.token);
                            this.$router.push('/index');
                        }else{
                            this.$message({
                                message: res.msg,
                                type: 'error'
                            });
                        }
                    })
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        getRole() {
            this.http.get('/api/rolelist', { status: 1 }).then(res => {
                this.roles = res.list;
            })
        },
        onRegister(){
            this.infoVisible = true;
            // this.getRole();
        },
        handleReset(){
            this.infoVisible = false;
            this.form = {
                roleid: '',
                username: '',
                password: '',
                status: true,
                collection: [],
            }
        },
        handleSubmit(formName){
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    return false;
                }
                let url = '/api/useradd';
                this.form.status = this.form.status ? 1 : 2;
                this.http.post(url, this.form).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'success'
                        });
                        this.handleReset();
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'error'
                        });
                    }
                })
                .catch(err=>{
                    console.log(err)
                })
            });
        },
    },
    mounted() {
        this.http.get('/api/rolelist').then(res => {
            this.roles = res.list || [];
        })
    }
}
</script>
<style scoped>
.login_bg {
    width: 100%;
    height: 100%;
    /* 线型渐变 */
    /*background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);*/
    background-image: url("../../../pulic/img/login-bg.jpg");
    background-repeat: no-repeat;
    background-position: top center;
    background-size: 100%;
}
.login {
    overflow: hidden;
}
.login h1 {
    color: #5c0909;
    text-align: center;
    margin-bottom: 30px;
}
.content{
    width: 400px;
    height: 350px;
    /*height: 300px;*/
    padding: 50px 50px 0;
    margin: 180px auto 0;
    text-align: center;
    background: #fff;
    opacity: .8;
}
.dialog-footer{
    text-align: center;
}
.dialog-footer .el-button{
    margin-top: 0;
    margin-bottom: 20px;
    margin-left: 0!important;
}

.el-button{
    width:400px;
    margin-top: 20px;
}
.el-input__inner{
    color: #000!important;
}
</style>
