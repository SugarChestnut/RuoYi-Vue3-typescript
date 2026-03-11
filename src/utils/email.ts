// 自定义邮箱验证函数
export function validateEmail(rule: any, value: string, callback: any) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (value && !emailRegex.test(value)) {
        callback(new Error('请输入正确的邮箱地址'));
    } else {
        callback();
    }
}
