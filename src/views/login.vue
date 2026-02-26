<template>
    <div class="login">
        <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">{{ title }}</h3>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
                    <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input
                    v-model="loginForm.password"
                    type="password"
                    size="large"
                    auto-complete="off"
                    placeholder="密码"
                    @keyup.enter="handleLogin"
                >
                    <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
                <el-input
                    v-model="loginForm.code"
                    size="large"
                    auto-complete="off"
                    placeholder="验证码"
                    style="width: 63%"
                    @keyup.enter="handleLogin"
                >
                    <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img" />
                </div>
            </el-form-item>
            <el-form-item style="width: 100%">
                <el-button
                    :loading="loading"
                    size="large"
                    type="primary"
                    style="width: 100%"
                    @click.prevent="handleLogin"
                >
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                <div style="float: right" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <span>{{ footerContent }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getCodeImg } from '@/api/login';
import useUserStore from '@/store/modules/user';
import defaultSettings from '@/settings';
import type { CaptchaInfoResult } from '@/types/api/login';
import type { LoginForm } from '@/types/api/login';
import modal from '@/plugins/modal';

const loginRef = ref();

const title = import.meta.env.VITE_APP_TITLE;
const footerContent = defaultSettings.footerContent;
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loginForm = ref<LoginForm>({
    username: 'superadmin',
    password: '123456',
    code: '',
    uuid: '',
});

// 验证码开关
const captchaEnabled = ref(false);

const loginRules = {
    username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
    password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
    code: [{ required: captchaEnabled.value, trigger: 'change', message: '请输入验证码' }],
};

const codeUrl = ref('');
const loading = ref(false);

// 注册开关
const register = ref(false);
const redirect = ref<string | undefined>(undefined);

// watch(
//     route,
//     (newRoute: any) => {
//         redirect.value = (newRoute.query && newRoute.query.redirect) as string | undefined;
//     },
//     { immediate: true },
// );

function handleLogin(): void {
    loginRef.value.validate((valid: boolean) => {
        if (valid) {
            loading.value = true;
            // 调用action的登录方法
            userStore
                .login(loginForm.value)
                .then(() => {
                    const query = route.query;
                    const otherQueryParams = Object.keys(query).reduce((acc: Record<string, any>, cur) => {
                        if (cur !== 'redirect') {
                            acc[cur] = query[cur];
                        }
                        return acc;
                    }, {});
                    const redirect = route.query?.redirect as string;
                    const redirectUrl = redirect ? decodeURIComponent(redirect) : '';
                    router.push({ path: redirectUrl || '/', query: otherQueryParams });
                })
                .catch((e) => {
                    loading.value = false;
                    modal.msgError(e);
                    if (captchaEnabled.value) {
                        getCode();
                    }
                });
        }
    });
}

function getCode(): void {
    getCodeImg().then((res) => {
        if (res.flag) {
            codeUrl.value = 'data:image/gif;base64,' + res.data?.img;
            loginForm.value.uuid = res.data?.uuid;
        }
    });
}

onMounted(() => {
    if (captchaEnabled.value) {
        getCode();
    }
});
</script>

<style lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-image: url('../assets/images/login-background.jpg');
    background-size: cover;
}
.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
}

.login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;
    z-index: 1;
    .el-input {
        height: 40px;
        input {
            height: 40px;
        }
    }
    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 0px;
    }
}
.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}
.login-code {
    width: 33%;
    height: 40px;
    float: right;
    img {
        cursor: pointer;
        vertical-align: middle;
    }
}
.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}
.login-code-img {
    height: 40px;
    padding-left: 12px;
}
</style>
