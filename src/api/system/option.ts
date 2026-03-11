import request from '@/utils/request';
import type { Option, Result } from '@/types';

export function dataRole(): Promise<Result<Option[]>> {
    return request({
        url: '/system/option/data_role',
        method: 'get',
    });
}
