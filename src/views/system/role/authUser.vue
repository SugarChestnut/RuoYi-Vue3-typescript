<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true">
            <el-form-item label="用户名称" prop="username">
                <el-input
                    v-model="queryParams.username"
                    placeholder="请输入用户名称"
                    clearable
                    style="width: 200px"
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
                <el-input
                    v-model="queryParams.mobile"
                    placeholder="请输入手机号码"
                    clearable
                    style="width: 200px"
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="openSelectUser" v-hasPermi="['system:role:auth']"
                    >添加用户</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button
                    type="danger"
                    plain
                    icon="CircleClose"
                    :disabled="multiple"
                    @click="cancelAuthUserAll"
                    v-hasPermi="['system:role:unauth']"
                    >批量取消授权</el-button
                >
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column :label="queryParams.roleName" align="center">
                <template #header="scope">
                    <span>角色名称：{{ queryParams.roleName }}</span>
                </template>
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="用户名称" prop="username" :show-overflow-tooltip="true" />
                <el-table-column label="手机" prop="mobile" :show-overflow-tooltip="true" />
                <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true" />
                <el-table-column label="状态" align="center" prop="statusDesc">
                    <template #default="scope">
                        <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">{{
                            scope.row.statusDesc
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-button
                            link
                            type="primary"
                            icon="CircleClose"
                            @click="cancelAuthUser(scope.row)"
                            v-hasPermi="['system:role:remove']"
                            >取消授权</el-button
                        >
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />
        <select-user ref="selectRef" :roleId="queryParams.roleId!" @ok="handleQuery" />
    </div>
</template>

<script setup lang="ts" name="AuthUser">
import selectUser from './selectUser.vue';
import { authUserCancel } from '@/api/system/role';
import { listAuthUser } from '@/api/system/user';
import type { SysUser, AuthUserQueryParams } from '@/types/api/system/user';
import modal from '@/plugins/modal';

import type { FormInstance } from 'element-plus';
import type { SelectUserInstance } from '@/types/component/SelectUser';
const queryRef = useTemplateRef<FormInstance>('queryRef');
const selectRef = useTemplateRef<SelectUserInstance>('selectRef');

const route = useRoute();
const userList = ref<SysUser[]>([]);
const loading = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const multiple = ref<boolean>(true);
const total = ref<number>(0);
const userIds = ref<number[]>([]);

const queryParams = reactive<AuthUserQueryParams>({
    pageNum: 1,
    pageSize: 10,
    roleId: route.params.roleId as unknown as number,
    roleName: route.params.roleName as string,
    username: undefined,
    mobile: undefined,
});

/** 查询授权用户列表 */
function getList() {
    loading.value = true;
    listAuthUser(queryParams).then((res) => {
        userList.value = res.data.records;
        total.value = res.data.total;
        loading.value = false;
    });
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    queryRef.value?.resetFields();
    handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection: SysUser[]) {
    userIds.value = selection.map((item) => item.userId!);
    multiple.value = !selection.length;
}

/** 打开授权用户表弹窗 */
function openSelectUser() {
    selectRef.value!.show();
}

/** 取消授权按钮操作 */
function cancelAuthUser(row: SysUser) {
    modal
        .confirm('确认要取消该用户"' + row.username + '"角色吗？')
        .then(function () {
            return authUserCancel({
                roleId: queryParams.roleId!,
                userIds: [row.userId!],
            });
        })
        .then(() => {
            getList();
            modal.msgSuccess('取消授权成功');
        })
        .catch(() => {});
}

/** 批量取消授权按钮操作 */
function cancelAuthUserAll() {
    modal
        .confirm('是否取消选中用户授权数据项?')
        .then(function () {
            return authUserCancel({
                roleId: queryParams.roleId!,
                userIds: userIds.value,
            });
        })
        .then(() => {
            getList();
            modal.msgSuccess('取消授权成功');
        })
        .catch(() => {});
}

onMounted(() => {
    getList();
});
</script>
