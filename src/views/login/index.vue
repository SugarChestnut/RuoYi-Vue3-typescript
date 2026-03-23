<template>
    <div class="login-container">
        <!-- Left Content Section -->
        <div class="login-left">
            <div class="brand-header">
                <div class="brand-logo">
                    <el-icon class="logo-icon"><Star /></el-icon>
                </div>
                <span class="brand-name">YourBrand</span>
            </div>

            <div class="characters-container">
                <!-- Cartoon Characters -->
                <div class="characters-wrapper">
                    <!-- Purple tall rectangle character - Back layer -->
                    <div ref="purpleRef" class="character purple-char" :style="purpleStyle">
                        <!-- Eyes -->
                        <div class="eyes-container" :style="purpleEyesStyle">
                            <EyeBall
                                :size="18"
                                :pupil-size="7"
                                :max-distance="5"
                                eye-color="white"
                                pupil-color="#2D2D2D"
                                :is-blinking="isPurpleBlinking"
                                :force-look-x="purpleForceLookX"
                                :force-look-y="purpleForceLookY"
                            />
                            <EyeBall
                                :size="18"
                                :pupil-size="7"
                                :max-distance="5"
                                eye-color="white"
                                pupil-color="#2D2D2D"
                                :is-blinking="isPurpleBlinking"
                                :force-look-x="purpleForceLookX"
                                :force-look-y="purpleForceLookY"
                            />
                        </div>
                    </div>

                    <!-- Black tall rectangle character - Middle layer -->
                    <div ref="blackRef" class="character black-char" :style="blackStyle">
                        <!-- Eyes -->
                        <div class="eyes-container" :style="blackEyesStyle">
                            <EyeBall
                                :size="16"
                                :pupil-size="6"
                                :max-distance="4"
                                eye-color="white"
                                pupil-color="#2D2D2D"
                                :is-blinking="isBlackBlinking"
                                :force-look-x="blackForceLookX"
                                :force-look-y="blackForceLookY"
                            />
                            <EyeBall
                                :size="16"
                                :pupil-size="6"
                                :max-distance="4"
                                eye-color="white"
                                pupil-color="#2D2D2D"
                                :is-blinking="isBlackBlinking"
                                :force-look-x="blackForceLookX"
                                :force-look-y="blackForceLookY"
                            />
                        </div>
                    </div>

                    <!-- Orange semi-circle character - Front left -->
                    <div ref="orangeRef" class="character orange-char" :style="orangeStyle">
                        <!-- Eyes - just pupils, no white -->
                        <div class="eyes-container" :style="orangeEyesStyle">
                            <Pupil
                                :size="12"
                                :max-distance="5"
                                pupil-color="#2D2D2D"
                                :force-look-x="orangeForceLookX"
                                :force-look-y="orangeForceLookY"
                            />
                            <Pupil
                                :size="12"
                                :max-distance="5"
                                pupil-color="#2D2D2D"
                                :force-look-x="orangeForceLookX"
                                :force-look-y="orangeForceLookY"
                            />
                        </div>
                    </div>

                    <!-- Yellow tall rectangle character - Front right -->
                    <div ref="yellowRef" class="character yellow-char" :style="yellowStyle">
                        <!-- Eyes - just pupils, no white -->
                        <div class="eyes-container" :style="yellowEyesStyle">
                            <Pupil
                                :size="12"
                                :max-distance="5"
                                pupil-color="#2D2D2D"
                                :force-look-x="yellowForceLookX"
                                :force-look-y="yellowForceLookY"
                            />
                            <Pupil
                                :size="12"
                                :max-distance="5"
                                pupil-color="#2D2D2D"
                                :force-look-x="yellowForceLookX"
                                :force-look-y="yellowForceLookY"
                            />
                        </div>
                        <!-- Horizontal line for mouth -->
                        <div class="mouth-line" :style="yellowMouthStyle" />
                    </div>
                </div>
            </div>

            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact</a>
                <span>{{ footerContent }}</span>
            </div>

            <!-- Decorative elements -->
            <div class="decorative-grid" />
            <div class="decorative-blur blur-1" />
            <div class="decorative-blur blur-2" />
        </div>

        <!-- Right Login Section -->
        <div class="login-right">
            <div class="login-box">
                <!-- Mobile Logo -->
                <div class="mobile-brand">
                    <div class="brand-logo mobile">
                        <el-icon class="logo-icon"><Star /></el-icon>
                    </div>
                    <span class="brand-name">YourBrand</span>
                </div>

                <!-- Header -->
                <div class="login-header">
                    <h1 class="welcome-title">Welcome back!</h1>
                    <p class="subtitle">Please enter your details</p>
                </div>

                <!-- Login Form -->
                <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form" label-position="top">
                    <el-form-item prop="username">
                        <template #label>
                            <span class="form-label">账号</span>
                        </template>
                        <el-input
                            v-model="loginForm.username"
                            type="text"
                            size="large"
                            placeholder="请输入账号"
                            @focus="isTyping = true"
                            @blur="isTyping = false"
                        />
                    </el-form-item>

                    <el-form-item prop="password">
                        <template #label>
                            <span class="form-label">密码</span>
                        </template>
                        <el-input
                            v-model="loginForm.password"
                            :type="showPassword ? 'text' : 'password'"
                            size="large"
                            placeholder="请输入密码"
                        >
                            <template #suffix>
                                <el-icon class="eye-icon" @click="showPassword = !showPassword">
                                    <View v-if="showPassword" />
                                    <Hide v-else />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="code" v-if="captchaEnabled">
                        <div class="code-row">
                            <el-input
                                v-model="loginForm.code"
                                size="large"
                                placeholder="验证码"
                                class="code-input"
                            />
                            <div class="login-code">
                                <img :src="codeUrl" @click="getCode" class="login-code-img" />
                            </div>
                        </div>
                    </el-form-item>

                    <div class="form-options">
                        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
                        <a href="#" class="forgot-link">忘记密码？</a>
                    </div>

                    <div v-if="error" class="error-message">
                        {{ error }}
                    </div>

                    <el-form-item>
                        <el-button
                            :loading="loading"
                            size="large"
                            type="primary"
                            class="login-btn"
                            @click.prevent="handleLogin"
                        >
                            <span v-if="!loading">登录</span>
                            <span v-else>登录中...</span>
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- Social Login -->
                <div class="social-login">
                    <el-button size="large" class="google-btn" @click.prevent="handleGoogleLogin">
                        <img src="https://www.google.com/favicon.ico" alt="Google" class="google-icon" />
                        <span>Log in with Google</span>
                    </el-button>
                </div>

                <!-- Sign Up Link -->
                <div class="signup-link">没有账号？<a href="#">注册</a></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { getCodeImg } from '@/api/login';
import useUserStore from '@/store/modules/user';
import { Star, View, Hide } from '@element-plus/icons-vue';
import type { LoginForm } from '@/types/api/login';
import Pupil from '@/views/login/Pupil.vue';
import EyeBall from '@/views/login/EyeBall.vue';
import defaultSettings from '@/settings';

// Login logic
const loginRef = ref();
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const loginForm = ref<LoginForm>({
    username: '',
    password: '',
    code: '',
    uuid: '',
});
const footerContent = defaultSettings.footerContent;
const captchaEnabled = ref(false);
const showPassword = ref(false);
const rememberMe = ref(false);
const loading = ref(false);
const error = ref('');
const codeUrl = ref('');

const isTyping = ref(false);
const isPurpleBlinking = ref(false);
const isBlackBlinking = ref(false);
const isLookingAtEachOther = ref(false);
const isPurplePeeking = ref(false);

const purpleRef = ref<HTMLDivElement | null>(null);
const blackRef = ref<HTMLDivElement | null>(null);
const yellowRef = ref<HTMLDivElement | null>(null);
const orangeRef = ref<HTMLDivElement | null>(null);

const mouseX = ref(0);
const mouseY = ref(0);

const loginRules = {
    username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
    password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
    code: [{ required: captchaEnabled.value, trigger: 'change', message: '请输入验证码' }],
};

// Mouse tracking
const handleMouseMove = (e: MouseEvent) => {
    mouseX.value = e.clientX;
    mouseY.value = e.clientY;
};

onMounted(() => {
    window.addEventListener('mousemove', handleMouseMove);
    if (captchaEnabled.value) {
        getCode();
    }
    startBlinking();
});

onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove);
});

// Blinking effects
const startBlinking = () => {
    const schedulePurpleBlink = () => {
        setTimeout(
            () => {
                isPurpleBlinking.value = true;
                setTimeout(() => {
                    isPurpleBlinking.value = false;
                    schedulePurpleBlink();
                }, 150);
            },
            Math.random() * 4000 + 3000,
        );
    };

    const scheduleBlackBlink = () => {
        setTimeout(
            () => {
                isBlackBlinking.value = true;
                setTimeout(() => {
                    isBlackBlinking.value = false;
                    scheduleBlackBlink();
                }, 150);
            },
            Math.random() * 4000 + 3000,
        );
    };

    schedulePurpleBlink();
    scheduleBlackBlink();
};

// Watch for typing
watch(isTyping, (newVal) => {
    if (newVal) {
        isLookingAtEachOther.value = true;
        setTimeout(() => {
            isLookingAtEachOther.value = false;
        }, 800);
    } else {
        isLookingAtEachOther.value = false;
    }
});

// Watch for password visibility
watch([() => loginForm.value.password, showPassword], ([password, visible]) => {
    if (password.length > 0 && visible) {
        const schedulePeek = () => {
            setTimeout(
                () => {
                    isPurplePeeking.value = true;
                    setTimeout(() => {
                        isPurplePeeking.value = false;
                    }, 800);
                },
                Math.random() * 3000 + 2000,
            );
        };
        schedulePeek();
    } else {
        isPurplePeeking.value = false;
    }
});

// Calculate position for characters
const calculatePosition = (ref: Ref<HTMLDivElement | null>) => {
    if (!ref.value) return { faceX: 0, faceY: 0, bodySkew: 0 };

    const rect = ref.value.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;

    const deltaX = mouseX.value - centerX;
    const deltaY = mouseY.value - centerY;

    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));

    return { faceX, faceY, bodySkew };
};

const purplePos = computed(() => calculatePosition(purpleRef));
const blackPos = computed(() => calculatePosition(blackRef));
const yellowPos = computed(() => calculatePosition(yellowRef));
const orangePos = computed(() => calculatePosition(orangeRef));

// Character styles
const purpleStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    const isPasswordHidden = loginForm.value.password.length > 0 && !showPassword.value;

    return {
        left: '70px',
        width: '180px',
        height: isTyping.value || isPasswordHidden ? '440px' : '400px',
        backgroundColor: '#6C3FF5',
        borderRadius: '10px 10px 0 0',
        zIndex: 1,
        transform: isPasswordVisible
            ? 'skewX(0deg)'
            : isTyping.value || isPasswordHidden
              ? `skewX(${(purplePos.value.bodySkew || 0) - 12}deg) translateX(40px)`
              : `skewX(${purplePos.value.bodySkew || 0}deg)`,
        transformOrigin: 'bottom center',
    };
});

const purpleEyesStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;

    return {
        left: isPasswordVisible ? '20px' : isLookingAtEachOther.value ? '55px' : `${45 + purplePos.value.faceX}px`,
        top: isPasswordVisible ? '35px' : isLookingAtEachOther.value ? '65px' : `${40 + purplePos.value.faceY}px`,
    };
});

const purpleForceLookX = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    if (isPasswordVisible) return isPurplePeeking.value ? 4 : -4;
    if (isLookingAtEachOther.value) return 3;
    return undefined;
});

const purpleForceLookY = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    if (isPasswordVisible) return isPurplePeeking.value ? 5 : -4;
    if (isLookingAtEachOther.value) return 4;
    return undefined;
});

const blackStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    const isPasswordHidden = loginForm.value.password.length > 0 && !showPassword.value;

    return {
        left: '240px',
        width: '120px',
        height: '310px',
        backgroundColor: '#2D2D2D',
        borderRadius: '8px 8px 0 0',
        zIndex: 2,
        transform: isPasswordVisible
            ? 'skewX(0deg)'
            : isLookingAtEachOther.value
              ? `skewX(${(blackPos.value.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
              : isTyping.value || isPasswordHidden
                ? `skewX(${(blackPos.value.bodySkew || 0) * 1.5}deg)`
                : `skewX(${blackPos.value.bodySkew || 0}deg)`,
        transformOrigin: 'bottom center',
    };
});

const blackEyesStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;

    return {
        left: isPasswordVisible ? '10px' : isLookingAtEachOther.value ? '32px' : `${26 + blackPos.value.faceX}px`,
        top: isPasswordVisible ? '28px' : isLookingAtEachOther.value ? '12px' : `${32 + blackPos.value.faceY}px`,
    };
});

const blackForceLookX = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    if (isPasswordVisible) return -4;
    if (isLookingAtEachOther.value) return 0;
    return undefined;
});

const blackForceLookY = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    if (isPasswordVisible) return -4;
    if (isLookingAtEachOther.value) return -4;
    return undefined;
});

const orangeStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;

    return {
        left: '0px',
        width: '240px',
        height: '200px',
        zIndex: 3,
        backgroundColor: '#FF9B6B',
        borderRadius: '120px 120px 0 0',
        transform: isPasswordVisible ? 'skewX(0deg)' : `skewX(${orangePos.value.bodySkew || 0}deg)`,
        transformOrigin: 'bottom center',
    };
});

const orangeEyesStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;

    return {
        left: isPasswordVisible ? '50px' : `${82 + (orangePos.value.faceX || 0)}px`,
        top: isPasswordVisible ? '85px' : `${90 + (orangePos.value.faceY || 0)}px`,
    };
});

const orangeForceLookX = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    return isPasswordVisible ? -5 : undefined;
});

const orangeForceLookY = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    return isPasswordVisible ? -4 : undefined;
});

const yellowStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;

    return {
        left: '310px',
        width: '140px',
        height: '230px',
        backgroundColor: '#E8D754',
        borderRadius: '70px 70px 0 0',
        zIndex: 4,
        transform: isPasswordVisible ? 'skewX(0deg)' : `skewX(${yellowPos.value.bodySkew || 0}deg)`,
        transformOrigin: 'bottom center',
    };
});

const yellowEyesStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;

    return {
        left: isPasswordVisible ? '20px' : `${52 + (yellowPos.value.faceX || 0)}px`,
        top: isPasswordVisible ? '35px' : `${40 + (yellowPos.value.faceY || 0)}px`,
    };
});

const yellowMouthStyle = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;

    return {
        left: isPasswordVisible ? '10px' : `${40 + (yellowPos.value.faceX || 0)}px`,
        top: isPasswordVisible ? '88px' : `${88 + (yellowPos.value.faceY || 0)}px`,
    };
});

const yellowForceLookX = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    return isPasswordVisible ? -5 : undefined;
});

const yellowForceLookY = computed(() => {
    const isPasswordVisible = loginForm.value.password.length > 0 && showPassword.value;
    return isPasswordVisible ? -4 : undefined;
});

// Login handlers
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
                    loading.value = false;
                })
                .catch((e) => {
                    loading.value = false;
                    error.value = e;
                    if (captchaEnabled.value) {
                        getCode();
                    }
                });
        }
    });
}

function handleGoogleLogin(): void {
}

function getCode(): void {
    getCodeImg().then((res) => {
        if (res.flag) {
            codeUrl.value = 'data:image/gif;base64,' + res.data?.img;
            loginForm.value.uuid = res.data?.uuid;
        }
    });
}
</script>

<style lang="scss" scoped>
.login-container {
    display: grid;
    grid-template-columns: 1fr 800px;
    min-height: 100vh;
    width: 100vw;
    font-width: 0.875em;
    line-height: calc(1.25 / 0.875);
}

.login-left {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgb(0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%);
    padding: 48px;
    color: white;
    overflow: hidden;
}

.brand-header {
    position: relative;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.125rem;
    font-weight: 600;
}

.brand-logo {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;

    &.mobile {
        background: rgba(99, 102, 241, 0.1);
    }
}

.logo-icon {
    font-size: 16px;
}

.brand-name {
    color: white;
}

.characters-container {
    position: relative;
    z-index: 20;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 500px;
}

.characters-wrapper {
    position: relative;
    width: 550px;
    height: 400px;
}

.character {
    position: absolute;
    bottom: 0;
    transition: all 0.7s ease-in-out;
}

.eyes-container {
    position: absolute;
    display: flex;
    gap: 32px;
    transition: all 0.5s ease-in-out;
}

.mouth-line {
    position: absolute;
    width: 80px;
    height: 4px;
    background: #2d2d2d;
    border-radius: 2px;
    transition: all 0.5s ease-out;
}

.footer-links {
    position: relative;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 32px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    a {
        color: rgba(255, 255, 255, 0.6);
        text-decoration: none;
        transition: color 0.2s;
        &:hover {
            color: white;
        }
    }
}

.decorative-grid {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
}

.decorative-blur {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);

    &.blur-1 {
        top: 25%;
        right: 25%;
        width: 256px;
        height: 256px;
        background: rgba(255, 255, 255, 0.1);
    }

    &.blur-2 {
        bottom: 25%;
        left: 25%;
        width: 384px;
        height: 384px;
        background: rgba(255, 255, 255, 0.05);
    }
}

.login-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: white;
}

.login-box {
    width: 100%;
    max-width: 420px;
}

.mobile-brand {
    display: none;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 48px;

    .brand-name {
        color: #1f2937;
    }

    .logo-icon {
        color: rgb(99, 102, 241);
    }
}

.login-header {
    text-align: center;
    margin-bottom: 40px;
}

.welcome-title {
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.025em;
    margin: 0 0 8px 0;
    color: #1f2937;
}

.subtitle {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
}

.login-form {
    :deep(.el-form-item) {
        margin-bottom: 20px;
    }

    :deep(.el-form-item__label) {
        padding-bottom: 6px;
        line-height: 1.4;
    }

    :deep(.el-input__wrapper) {
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) inset;
        padding: 0 12px;

        &.is-focus {
            box-shadow: 0 0 0 1px rgb(99, 102, 241) inset;
        }
    }

    :deep(.el-input__inner) {
        height: 48px;
        font-size: 14px;
    }
}

.form-label {
    font-size: 14px;
    font-weight: 500;
    color: #1f2937;
}

.code-row {
    display: flex;
    gap: 12px;

    .code-input {
        flex: 1;
    }
}

.login-code {
    .login-code-img {
        height: 48px;
        border-radius: 8px;
        cursor: pointer;
        border: 1px solid #e5e7eb;
    }
}

.eye-icon {
    cursor: pointer;
    color: #6b7280;
    font-size: 18px;

    &:hover {
        color: #1f2937;
    }
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    :deep(.el-checkbox__label) {
        font-size: 14px;
        color: #4b5563;
    }

    .forgot-link {
        font-size: 14px;
        color: rgb(0, 0, 0);
        text-decoration: none;
        font-weight: 500;

        &:hover {
            text-decoration: underline;
        }
    }
}

.error-message {
    padding: 12px;
    font-size: 14px;
    color: #f87171;
    background: rgba(248, 113, 113, 0.1);
    border: 1px solid rgba(248, 113, 113, 0.2);
    border-radius: 8px;
    margin-bottom: 16px;
}

.login-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 800;
    background-color: oklch(0.205 0 0);
}

.social-login {
    margin-top: 24px;
}

.google-btn {
    width: 100%;
    height: 48px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 800;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #1f2937;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    &:hover {
        background: #f9fafb;
    }

    .google-icon {
        width: 20px;
        height: 20px;
    }
}

.signup-link {
    text-align: center;
    margin-top: 32px;
    font-size: 14px;
    font-weight: 400;
    color: #6b7280;
    a {
        color: #1f2937;
        font-weight: 600;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
}

@media (max-width: 1024px) {
    .login-container {
        grid-template-columns: 1fr;
    }

    .login-left {
        display: none;
    }

    .mobile-brand {
        display: flex;
    }
}

</style>
