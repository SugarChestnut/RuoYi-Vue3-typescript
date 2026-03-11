import request from '@/utils/request';
import type { PostQueryParams, SysPost, Result, SysPage } from '@/types';

// 查询岗位列表
export function listPost(data: PostQueryParams): Promise<Result<SysPage<SysPost>>> {
    return request({
        url: '/system/post/list',
        method: 'post',
        data: data,
    });
}

// 查询岗位详细
export function getPost(postId: number): Promise<Result<SysPost>> {
    return request({
        url: '/system/post/' + postId,
        method: 'get',
    });
}

// 新增岗位
export function createPost(data: SysPost): Promise<Result> {
    return request({
        url: '/system/post/create',
        method: 'post',
        data: data,
    });
}

// 修改岗位
export function updatePost(data: SysPost): Promise<Result> {
    return request({
        url: '/system/post/update',
        method: 'post',
        data: data,
    });
}

// 删除岗位
export function delPost(postId: number | number[]): Promise<Result> {
    return request({
        url: '/system/post/' + postId,
        method: 'get',
    });
}
