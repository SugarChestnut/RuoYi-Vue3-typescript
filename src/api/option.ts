import request from '@/utils/http/request';
import type { Option, Result } from '@/types';

export function getDataScope<T>(): Promise<Result<Option<T>[]>> {
    return request({
        url: '/system/option/data_scope',
        method: 'get',
    });
}
