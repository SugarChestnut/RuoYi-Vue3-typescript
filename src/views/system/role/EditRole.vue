<template>
    <div>
        <el-dialog :title="title" v-model="visible" width="500px" append-to-body @close="reset">
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
<script setup lang="ts">
import type { SysRole, RoleQueryParams } from '@/types/api/system/role';
import type { SysMenu } from '@/types/api/system/menu';
import type { SysDept } from '@/types/api/system/dept';
import type { TreeInstance, FormInstance } from 'element-plus';
import type { EditRoleInstance } from '@/types/vue-instance';
import type { Option } from '@/types/api/common';

import { listDept } from '@/api/system/dept';
import { createRole, updateRole, getRoleMenu, getRoleDept } from '@/api/system/role';
import { getTree as getMenuTree } from '@/api/system/menu';
import { getDataScope } from '@/api/option';

import modal from '@/plugins/modal';

const props = defineProps<{
    role?: SysRole;
    title: string;
}>();
const emit = defineEmits(['ok']);

const menuRef = useTemplateRef<TreeInstance>('menuRef');
const deptRef = useTemplateRef<TreeInstance>('deptRef');
const roleRef = useTemplateRef<FormInstance>('roleRef');
const visible = ref<boolean>(false);
const menuOptions = ref<SysMenu[]>([]);
const deptOptions = ref<SysDept[]>([]);
const dataScopeOptions = ref<Option<string>[]>([]);

const data = reactive({
    form: {} as SysRole,
    rules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        roleKey: [{ required: true, message: '权限字符不能为空', trigger: 'blur' }],
        roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }],
    },
});
const { form, rules } = toRefs(data);

watch(
    () => props.role,
    (newRole) => {
        if (newRole && newRole.roleId) {
            // 编辑模式：深拷贝避免直接修改 props
            data.form = {...newRole};
        } else {
            // 新增模式：重置表单
            data.form = {} as SysRole;
        }
    },
    { immediate: true, deep: true },
);

/** 提交按钮 */
function submitForm() {
    form.value.menuIds = getMenuAllCheckedKeys();
    form.value.deptIds = getDeptAllCheckedKeys();
    roleRef.value!.validate((valid: boolean) => {
        if (valid) {
            if (form.value.roleId != undefined) {
                updateRole(form.value).then(() => {
                    modal.msgSuccess('修改成功');
                    visible.value = false;
                    emit('ok');
                });
            } else {
                createRole(form.value).then(() => {
                    modal.msgSuccess('新增成功');
                    visible.value = false;
                    emit('ok');
                });
            }
        }
    });
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

/** 取消按钮 */
function cancel() {
    visible.value = false;
    reset();
}

/** 重置新增的表单以及其他数据  */
function reset() {
    menuRef.value?.setCheckedKeys([]);
    menuOptions.value = []
    deptRef.value?.setCheckedKeys([]);
    deptOptions.value = []
    form.value = {
        status: false,
        menuIds: [],
        deptIds: []
    };
    roleRef.value?.resetFields();
}

async function show() {
    visible.value = true;
    await getMenuTree({}).then((res) => {
        menuOptions.value = res.data;
    });
    await getDataScope<string>().then((res) => {
        dataScopeOptions.value = res.data;
    });

    // 获取角色分配的菜单
    if (form.value.roleId) {
        getRoleMenu(form.value.roleId!).then((res) => {
            nextTick(() => {
                res.data.forEach((v) => {
                    nextTick(() => {
                        menuRef.value!.store.nodesMap[v].expanded = true;
                        menuRef.value?.setChecked(v, true, false);
                    });
                });
            });
        });

        if (form.value.dataScope && form.value.dataScope === '2') {
            await listDept({}).then((res) => {
                deptOptions.value = res.data;
            });
            // 获取角色分配部门
            getRoleDept(form.value.roleId!).then((res) => {
                nextTick(() => {
                    res.data.forEach((v) => {
                        nextTick(() => {
                            deptRef.value!.store.nodesMap[v].expanded = true;
                            deptRef.value?.setChecked(v, true, false);
                        });
                    });
                });
            });
        }
    }
}

defineExpose<EditRoleInstance>({
    show,
});
</script>
