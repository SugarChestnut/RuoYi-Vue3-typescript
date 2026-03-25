import Cookies from 'js-cookie';

const accessToken = 'Access-Token';

export function getAccessToken(): string | undefined {
    const token = Cookies.get(accessToken);
    if (token && 'undefined' === token) return undefined;
    return token;
}
export function setAccessToken(token: string): string | undefined {
    return Cookies.set(accessToken, token);
}

export function removeAccessToken(): void {
    Cookies.remove(accessToken);
}
