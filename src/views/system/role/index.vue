<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" v-show="showSearch" :inline="true" label-width="68px">
            <el-form-item label="角色名称" prop="roleName">
                <el-input
                    v-model="queryParams.roleName"
                    placeholder="请输入角色名称"
                    clearable
                    style="width: 200px"
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="权限字符" prop="roleKey">
                <el-input
                    v-model="queryParams.roleKey"
                    placeholder="请输入权限字符"
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
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:role:add']"
                    >新增</el-button
                >
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <!-- 表格数据 -->
        <el-table v-loading="loading" :data="roleList" border>
            <!-- <el-table-column label="角色编号" prop="roleId" width="120" /> -->
            <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="200" />
            <el-table-column label="状态" align="center" width="150" class-name="small-padding">
                <template #default="scope">
                    <el-switch
                        v-model="scope.row.status"
                        :active-value="false"
                        :inactive-value="true"
                        size="small"
                        @change="handleStatusChange(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
            <el-table-column label="操作" align="center" width="200" class-name="small-padding">
                <template #default="scope">
                    <el-tooltip content="修改" placement="top">
                        <el-button
                            link
                            type="primary"
                            icon="Edit"
                            @click="handleEdit(scope.row)"
                            v-hasPermi="['system:role:edit']"
                        ></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button
                            link
                            type="danger"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:role:remove']"
                        ></el-button>
                    </el-tooltip>
                    <el-tooltip content="分配用户" placement="top">
                        <el-button
                            link
                            type="info"
                            icon="User"
                            @click="handleAuthUser(scope.row)"
                            v-hasPermi="['system:role:edit']"
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page="queryParams.pageNum"
            :limit="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改角色配置对话框 -->
        <edit-role ref="editRoleRef" :title="title" :role="role" @ok="getList" />
    </div>
</template>

<script setup lang="ts" name="Role">
import EditRole from './EditRole.vue';

import { changeRoleStatus, delRole, listRole } from '@/api/system/role';

import type { SysRole, RoleQueryParams } from '@/types/api/system/role';
import type { FormInstance } from 'element-plus';
import type { EditRoleInstance } from '@/types/vue-instance';

import modal from '@/plugins/modal';

const queryRef = useTemplateRef<FormInstance>('queryRef');
const editRoleRef = useTemplateRef<EditRoleInstance>('editRoleRef');

const router = useRouter();
const roleList = ref<SysRole[]>([]);
const loading = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const total = ref<number>(0);
const title = ref<string>('');

const data = reactive({
    role: {} as SysRole,
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: false,
    } as RoleQueryParams,
});
const { queryParams, role } = toRefs(data);

/** 查询角色列表 */
function getList() {
    loading.value = true;
    listRole(queryParams.value).then((res) => {
        roleList.value = res.data.records;
        total.value = res.data.total;
        loading.value = false;
    });
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    queryParams.value.pageNum = 1;
    queryRef.value?.resetFields();
    handleQuery();
}

/** 删除按钮操作 */
function handleDelete(row: SysRole) {
    modal
        .confirm('是否确认删除角色"' + row.roleName + '"?')
        .then(function () {
            return delRole(row.roleId!);
        })
        .then(() => {
            getList();
            modal.msgSuccess('删除成功');
        })
        .catch(() => {});
}

/** 角色状态修改 */
function handleStatusChange(row: SysRole) {
    const text = row.status ? '停用' : '启用';
    modal
        .confirm('确认要' + text + '"' + row.roleName + '"角色吗?')
        .then(function () {
            return changeRoleStatus(row.roleId!, row.status!);
        })
        .then(() => {
            modal.msgSuccess(text + '成功');
        })
        .catch(function () {
            row.status = !row.status;
        });
}

/** 分配用户 */
function handleAuthUser(row: SysRole) {
    router.push('/system/role-auth/user/' + row.roleId + '/' + row.roleName);
}

/** 弹出添加角色弹框 */
function handleAdd() {
    role.value = {} as SysRole;
    title.value = '添加角色';
    editRoleRef.value?.show();
}

/** 修改角色 */
function handleEdit(row: SysRole) {
    role.value = row;
    title.value = '修改角色';
    editRoleRef.value?.show();
}

onMounted(() => {
    getList();
});
</script>
