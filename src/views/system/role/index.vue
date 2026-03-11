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
            <el-table-column label="操作" align="center" width="210" class-name="small-padding">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.row)" v-hasPermi="['system:role:edit']" icon="Edit"
                        >修改</el-button
                    >
                    <el-button
                        size="small"
                        type="danger"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['system:role:remove']"
                        icon="Delete"
                        >删除</el-button
                    >
                    <!-- <el-tooltip content="数据权限" placement="top" v-if="scope.row.roleId !== 1">
                        <el-button
                            link
                            type="primary"
                            icon="CircleCheck"
                            @click="handleDataScope(scope.row)"
                            v-hasPermi="['system:role:edit']"
                        ></el-button>
                    </el-tooltip>
                    <el-tooltip content="分配用户" placement="top" v-if="scope.row.roleId !== 1">
                        <el-button
                            link
                            type="primary"
                            icon="User"
                            @click="handleAuthUser(scope.row)"
                            v-hasPermi="['system:role:edit']"
                        ></el-button>
                    </el-tooltip> -->
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
                    <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')"
                        >展开/折叠</el-checkbox
                    >
                    <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')"
                        >全选/全不选</el-checkbox
                    >
                    <el-checkbox v-model="form.menuCheckStrictly!" @change="handleCheckedTreeConnect($event, 'menu')"
                        >父子联动</el-checkbox
                    >
                    <el-tree
                        class="tree-border"
                        :data="menuOptions"
                        show-checkbox
                        ref="menuRef"
                        node-key="menuId"
                        :check-strictly="!form.menuCheckStrictly"
                        empty-text="加载中，请稍候"
                        :props="{ label: 'title', children: 'children' }"
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

        <!-- 分配角色数据权限对话框 -->
        <el-dialog :title="title" v-model="openDataScope" width="500px" append-to-body>
            <el-form :model="form" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="form.roleName" :disabled="true" />
                </el-form-item>
                <el-form-item label="权限字符">
                    <el-input v-model="form.roleKey" :disabled="true" />
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
                <el-form-item label="数据权限" v-show="form.dataScope == 2">
                    <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')"
                        >展开/折叠</el-checkbox
                    >
                    <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')"
                        >全选/全不选</el-checkbox
                    >
                    <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')"
                        >父子联动</el-checkbox
                    >
                    <el-tree
                        class="tree-border"
                        :data="deptOptions"
                        show-checkbox
                        default-expand-all
                        ref="deptRef"
                        node-key="id"
                        :check-strictly="!form.deptCheckStrictly"
                        empty-text="加载中，请稍候"
                        :props="{ label: 'label', children: 'children' }"
                    ></el-tree>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitDataScope">确 定</el-button>
                    <el-button @click="cancelDataScope">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="Role">
import {
    addRole,
    changeRoleStatus,
    dataScope,
    delRole,
    getRole,
    listRole,
    updateRole,
    deptTreeSelect,
} from '@/api/system/role';
import { roleMenuTreeselect, getTree as getMenuTree } from '@/api/system/menu';
import type { SysRole, RoleQueryParams } from '@/types/api/system/role';
import type { TreeSelect } from '@/types/api/common';
import type { RoleDeptTreeResult } from '@/types/api/system/role';
import type { SysMenu, SysDept } from '@/types';
import modal from '@/plugins/modal';

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
const dateRange = ref<string[]>([]);
const menuOptions = ref<SysMenu[]>([]);
const menuExpand = ref<boolean>(false);
const menuNodeAll = ref<boolean>(false);
const deptExpand = ref<boolean>(true);
const deptNodeAll = ref<boolean>(false);
const deptOptions = ref<SysDept[]>([]);
const openDataScope = ref<boolean>(false);

/** 数据范围选项*/
const dataScopeOptions = ref([
    { value: '1', label: '全部数据权限' },
    { value: '2', label: '自定数据权限' },
    { value: '3', label: '本部门数据权限' },
    { value: '4', label: '本部门及以下数据权限' },
    { value: '5', label: '仅本人数据权限' },
]);

const data = reactive({
    form: {
        menuCheckStrictly: true,
        deptCheckStrictly: true,
    } as SysRole,
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
    dateRange.value = [];
    queryRef.value?.resetFields();
    handleQuery();
}

/** 删除按钮操作 */
function handleDelete(row?: SysRole) {
    const roleIds = row?.roleId || ids.value;
    modal
        .confirm('是否确认删除角色编号为"' + roleIds + '"的数据项?')
        .then(function () {
            return delRole(roleIds);
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

/** 更多操作 */
function handleCommand(command: string, row: SysRole) {
    switch (command) {
        case 'handleDataScope':
            handleDataScope(row);
            break;
        case 'handleAuthUser':
            handleAuthUser(row);
            break;
        default:
            break;
    }
}

/** 分配用户 */
function handleAuthUser(row: SysRole) {
    router.push('/system/role-auth/user/' + row.roleId);
}

/** 查询菜单树结构 */
function getMenuTreeselect() {
    // menuTreeselect().then((response) => {
    //     menuOptions.value = response.data;
    // });
}

/** 所有部门节点数据 */
function getDeptAllCheckedKeys(): number[] {
    // 目前被选中的部门节点
    let checkedKeys = deptRef.value!.getCheckedKeys() as number[];
    // 半选中的部门节点
    let halfCheckedKeys = deptRef.value!.getHalfCheckedKeys() as number[];
    checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
    return checkedKeys;
}

/** 重置新增的表单以及其他数据  */
function reset() {
    menuRef.value?.setCheckedKeys([]);
    menuExpand.value = false;
    menuNodeAll.value = false;
    deptExpand.value = true;
    deptNodeAll.value = false;
    form.value = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        status: false,
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined,
    };
    roleRef.value?.resetFields();
}

/** 添加角色 */
function handleAdd() {
    reset();
    getMenuTree({}).then((res) => {
        menuOptions.value = res.data;
    });
    open.value = true;
    title.value = '添加角色';
}

/** 修改角色 */
function handleEdit(row?: SysRole) {
    // reset();
    // const roleId = row?.roleId || ids.value[0];
    // const roleMenu = getRoleMenuTreeselect(roleId);
    // getRole(roleId).then((response) => {
    //     form.value = response.data!;
    //     open.value = true;
    //     nextTick(() => {
    //         roleMenu.then((res: RoleMenuTreeselectResult) => {
    //             const checkedKeys = res.checkedKeys;
    //             checkedKeys.forEach((v) => {
    //                 nextTick(() => {
    //                     menuRef.value?.setChecked(v, true, false);
    //                 });
    //             });
    //         });
    //     });
    // });
    // title.value = '修改角色';
}

/** 根据角色ID查询菜单树结构 */
function getRoleMenuTreeselect(roleId: number): RoleMenuTreeselectResult {
    // return roleMenuTreeselect(roleId).then((response) => {
    //     menuOptions.value = response.menus;
    //     return response;
    // });
    return { checkedKeys: [] };
}

/** 根据角色ID查询部门树结构 */
function getDeptTree(roleId: number) {
    Promise<RoleDeptTreeResult>;
    return deptTreeSelect(roleId).then((response) => {
        deptOptions.value = response.depts;
        return response;
    });
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value: any, type: string) {
    if (type == 'menu') {
        let treeList = menuOptions.value!;
        for (let i = 0; i < treeList.length; i++) {
            menuRef.value!.store.nodesMap[treeList[i].menuId!].expanded = menuExpand.value;
        }
    } else if (type == 'dept') {
        let treeList = deptOptions.value!;
        for (let i = 0; i < treeList.length; i++) {
            deptRef.value!.store.nodesMap[treeList[i].deptId!].expanded = deptExpand.value;
        }
    }
}

/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value: any, type: string) {
    // if (type == 'menu') {
    //     menuRef.value!.setCheckedNodes(menuNodeAll.value ? menuOptions.value : []);
    // } else if (type == 'dept') {
    //     deptRef.value!.setCheckedNodes(deptNodeAll.value ? deptOptions.value : []);
    // }
}

/** 树权限（父子联动） */
function handleCheckedTreeConnect(value: any, type: string) {
    if (type == 'menu') {
        form.value.menuCheckStrictly = form.value.menuCheckStrictly;
    } else if (type == 'dept') {
        form.value.deptCheckStrictly = form.value.deptCheckStrictly;
    }
}

/** 所有菜单节点数据 */
function getMenuAllCheckedKeys(): number[] {
    // 目前被选中的菜单节点
    let checkedKeys = menuRef.value!.getCheckedKeys() as number[];
    // 半选中的菜单节点
    let halfCheckedKeys = menuRef.value!.getHalfCheckedKeys() as number[];
    checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
    return checkedKeys;
}

/** 提交按钮 */
function submitForm() {
    roleRef.value!.validate((valid: boolean) => {
        if (valid) {
            if (form.value.roleId != undefined) {
                form.value.menuIds = getMenuAllCheckedKeys();
                updateRole(form.value).then(() => {
                    modal.msgSuccess('修改成功');
                    open.value = false;
                    getList();
                });
            } else {
                form.value.menuIds = getMenuAllCheckedKeys();
                addRole(form.value).then(() => {
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

/** 选择角色权限范围触发 */
function dataScopeSelectChange(value: string) {
    if (value !== '2') {
        deptRef.value!.setCheckedKeys([]);
    }
}

/** 分配数据权限操作 */
function handleDataScope(row: SysRole) {
    reset();
    const deptTreeSelect = getDeptTree(row.roleId!);
    getRole(row.roleId!).then((response) => {
        form.value = response.data!;
        openDataScope.value = true;
        nextTick(() => {
            deptTreeSelect.then((res) => {
                nextTick(() => {
                    if (deptRef.value) {
                        deptRef.value.setCheckedKeys(res.checkedKeys);
                    }
                });
            });
        });
    });
    title.value = '分配数据权限';
}

/** 提交按钮（数据权限） */
function submitDataScope() {
    if (form.value.roleId != undefined) {
        form.value.deptIds = getDeptAllCheckedKeys();
        dataScope(form.value).then(() => {
            modal.msgSuccess('修改成功');
            openDataScope.value = false;
            getList();
        });
    }
}

/** 取消按钮（数据权限）*/
function cancelDataScope() {
    openDataScope.value = false;
    reset();
}

onMounted(() => {
    getList();
});
</script>
