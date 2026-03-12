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
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="roleRef" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="form.roleName" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item prop="roleKey">
                    <template #label>
                        <span>
                            <el-tooltip
                                content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)"
                                placement="top"
                            >
                                <el-icon><question-filled /></el-icon>
                            </el-tooltip>
                            权限字符
                        </span>
                    </template>
                    <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio :value="false">正常</el-radio>
                        <el-radio :value="true">停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单权限">
                    <el-tree
                        class="tree-border"
                        :data="menuOptions"
                        show-checkbox
                        ref="menuRef"
                        node-key="menuId"
                        empty-text="加载中，请稍候"
                        :props="{ label: 'title', children: 'children' }"
                    ></el-tree>
                </el-form-item>
                <el-form-item label="权限范围">
                    <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
                        <el-option
                            v-for="item in dataScopeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="数据权限" v-show="form.dataScope && form.dataScope == '2'">
                    <el-tree
                        class="tree-border"
                        :data="deptOptions"
                        show-checkbox
                        ref="deptRef"
                        node-key="deptId"
                        empty-text="加载中，请稍候"
                        :props="{ label: 'deptName', children: 'children' }"
                    ></el-tree>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="Role">
import {
    createRole,
    changeRoleStatus,
    delRole,
    getRole,
    listRole,
    updateRole,
    deptTreeSelect,
    getRoleMenu,
    getRoleDept,
} from '@/api/system/role';
import { roleMenuTreeselect, getTree as getMenuTree } from '@/api/system/menu';
import { listDept } from '@/api/system/dept';
import type { SysRole, RoleQueryParams } from '@/types/api/system/role';
import type { RoleDeptTreeResult } from '@/types/api/system/role';
import type { SysMenu, SysDept, Option } from '@/types';
import modal from '@/plugins/modal';
import { getDataScope } from '@/api/system/option';

import { FormInstance, TreeInstance } from 'element-plus';
const queryRef = useTemplateRef<FormInstance>('queryRef');
const roleRef = useTemplateRef<FormInstance>('roleRef');
const menuRef = useTemplateRef<TreeInstance>('menuRef');
const deptRef = useTemplateRef<TreeInstance>('deptRef');

const router = useRouter();
const roleList = ref<SysRole[]>([]);
const open = ref<boolean>(false);
const loading = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const ids = ref<number[]>([]);
const total = ref<number>(0);
const title = ref<string>('');
const menuOptions = ref<SysMenu[]>([]);
const deptOptions = ref<SysDept[]>([]);
const openDataScope = ref<boolean>(false);
const dataScopeOptions = ref<Option<string>[]>([]);

const data = reactive({
    form: {} as SysRole,
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: false,
    } as RoleQueryParams,
    rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
        roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
    },
});
const { queryParams, form, rules } = toRefs(data);

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
        .confirm('确认要"' + text + '""' + row.roleName + '"角色吗?')
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
    router.push('/system/role-auth/user/' + row.roleId);
}

/** 重置新增的表单以及其他数据  */
function reset() {
    menuRef.value?.setCheckedKeys([]);
    deptRef.value?.setCheckedKeys([]);
    form.value = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        status: false,
        menuIds: [],
        deptIds: [],
        remark: undefined,
    };
    roleRef.value?.resetFields();
}

/** 弹出添加角色弹框 */
function handleAdd() {
    reset();
    getMenuTree({}).then((res) => {
        menuOptions.value = res.data;
    });
    getDataScope<string>().then((res) => {
        dataScopeOptions.value = res.data;
    });
    open.value = true;
    title.value = '添加角色';
}

/** 选择角色权限范围触发 */
function dataScopeSelectChange(value: string) {
    if (value !== '2') {
        deptRef.value!.setCheckedKeys([]);
    }
    if (value == '2') {
        listDept({}).then((res) => {
            deptOptions.value = res.data;
        });
    }
}

/** 修改角色 */
async function handleEdit(row: SysRole) {
    reset();
    form.value = {...row};
    getMenuTree({}).then((res) => {
        menuOptions.value = res.data;
    });
    await getDataScope<string>().then((res) => {
        dataScopeOptions.value = res.data;
    });
    // 获取角色分配的菜单
    getRoleMenu(row.roleId!).then((res) => {
        nextTick(() => {
            res.data.forEach((v) => {
                nextTick(() => {
                    menuRef.value!.store.nodesMap[v].expanded = true;
                    menuRef.value?.setChecked(v, true, false);
                });
            });
        });
    });

    if (row.dataScope && row.dataScope === '2') {
        // 获取角色分配部门
        getRoleDept(row.roleId!).then((res) => {
            nextTick(() => {
                res.data.forEach((v) => {
                    nextTick(() => {
                        deptRef.value?.setChecked(v, true, false);
                    });
                });
            });
        });
    }
    title.value = '修改角色';
    open.value = true;
}

/** 所有菜单节点数据 */
function getMenuAllCheckedKeys(): number[] {
    // 目前被选中的菜单节点
    let checkedKeys = menuRef.value!.getCheckedKeys() as number[];
    // 半选中的菜单节点
    let halfCheckedKeys = menuRef.value!.getHalfCheckedKeys() as number[];
    checkedKeys.unshift(...halfCheckedKeys);
    return checkedKeys;
}

/** 所有部门节点数据 */
function getDeptAllCheckedKeys(): number[] {
    // 目前被选中的部门节点
    let checkedKeys = deptRef.value!.getCheckedKeys() as number[];
    // 半选中的部门节点
    let halfCheckedKeys = deptRef.value!.getHalfCheckedKeys() as number[];
    checkedKeys.unshift(...halfCheckedKeys);
    return checkedKeys;
}

/** 提交按钮 */
function submitForm() {
    form.value.menuIds = getMenuAllCheckedKeys();
    form.value.deptIds = getDeptAllCheckedKeys();
    roleRef.value!.validate((valid: boolean) => {
        if (valid) {
            if (form.value.roleId != undefined) {
                updateRole(form.value).then(() => {
                    modal.msgSuccess('修改成功');
                    open.value = false;
                    getList();
                });
            } else {
                createRole(form.value).then(() => {
                    modal.msgSuccess('新增成功');
                    open.value = false;
                    getList();
                });
            }
        }
    });
}

/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
}

onMounted(() => {
    getList();
});
</script>
