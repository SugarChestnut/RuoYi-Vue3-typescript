import Cookies from 'js-cookie';

const TokenKey = 'Admin-Token';

export function getToken(): string | undefined {
    const token = Cookies.get(TokenKey);
    if (token && 'undefined' === token) return undefined;
    return token;
}

export function setToken(token: string): string | undefined {
    return Cookies.set(TokenKey, token);
}

export function removeToken(): void {
    Cookies.remove(TokenKey);
}
