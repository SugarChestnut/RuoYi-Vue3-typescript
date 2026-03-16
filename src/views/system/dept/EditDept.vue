<template>
    <div>
        <el-dialog :title="title" v-model="visible" width="650px" append-to-body @close="reset">
            <el-form ref="deptRef" :model="form" :rules="rules" label-width="90px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="上级部门" prop="parentId">
                            <el-tree-select
                                v-model="form.parentId"
                                :data="deptOptions"
                                :props="{ label: 'deptName', children: 'children' }"
                                value-key="deptId"
                                placeholder="选择上级部门"
                                check-strictly
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门名称" prop="deptName">
                            <el-input v-model="form.deptName" placeholder="请输入部门名称" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示排序" prop="orderNum">
                            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人" prop="leaderId">
                            <el-select
                                v-model="form.leaderId"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="请输入负责人"
                                :remote-method="handleUserSelect"
                                :loading="loading"
                                style="width: 240px"
                            >
                                <el-option
                                    v-for="user in userOptions"
                                    :key="user.userId"
                                    :label="user.username"
                                    :value="user.userId!"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系电话" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门状态">
                            <el-radio-group v-model="form.status">
                                <el-radio :value="0">正常</el-radio>
                                <el-radio :value="1">停用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="基础角色" prop="roleIds">
                            <el-select
                                v-model="form.roleIds"
                                multiple
                                filterable
                                remote
                                reserve-keyword
                                placeholder="Please enter a keyword"
                                :remote-method="remoteMethod"
                                :loading="loading"
                                style="width: 240px"
                            >
                                <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
                        </el-form-item>
                    </el-col>
                </el-row>
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

<script setup lang="ts" name="Dept">
import { createDept, updateDept, listDept } from '@/api/system/dept';
import { listUser } from '@/api/system/user';

import type { SysDept, SysUser } from '@/types';
import type { BaseInstance } from '@/types/vue-instance';
import type { FormInstance } from 'element-plus';

import modal from '@/plugins/modal';
import { validateEmail } from '@/utils/email';

const props = defineProps<{
    title: string;
    dept?: SysDept;
}>();
const emit = defineEmits(['ok']);

const deptRef = useTemplateRef<FormInstance>('deptRef');
const visible = ref<boolean>(false);
const loading = ref<boolean>(false);
const title = ref<string>('');
const deptOptions = ref<SysDept[]>([]);
const userOptions = ref<SysUser[]>([]);

const data = reactive({
    form: {} as SysDept,
    rules: {
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
        email: [{ validator: validateEmail, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
    },
});

const { form, rules } = toRefs(data);

watch(
    () => props.dept,
    (newDept) => {
        if (newDept && newDept.deptId) {
            // 编辑模式：深拷贝避免直接修改 props
            form.value = {
                deptId: newDept.deptId,
                deptName: newDept.deptName,
                parentId: newDept.parentId === 0 ? undefined : newDept.parentId,
                orderNum: newDept.orderNum,
                leader: newDept.leader,
                phone: newDept.phone,
                email: newDept.email,
                status: newDept.status,
            };
        } else {
            // 新增模式：重置表单
            form.value = {} as SysDept;
        }
    },
    { immediate: true, deep: true },
);

/** 取消按钮 */
function cancel() {
    visible.value = false;
    reset();
}

/** 表单重置 */
function reset() {
    form.value = {
        orderNum: 0,
        status: 0,
    };
    deptRef.value?.resetFields();
    deptOptions.value = [];
}

function handleUserSelect(query: string) {
    loading.value = true;
    listUser({ username: query, pageNum: 1, pageSize: 10 })
        .then((res) => {
            loading.value = false;
            userOptions.value = res.data.records || [];
        })
        .catch(() => {
            loading.value = false;
        });
}

/** 查询菜单下拉树结构 */
function getTreeselect(depts: SysDept[]) {
    if (form.value.deptId === undefined) {
        return depts;
    }
    depts.forEach((dept) => {
        dept.children = getTreeselect(dept.children || []);
    });
    return depts.filter((dept) => dept.deptId !== form.value.deptId);
}

/** 提交按钮 */
function submitForm() {
    deptRef.value!.validate((valid: boolean) => {
        if (valid) {
            if (form.value.deptId != undefined) {
                updateDept(form.value).then(() => {
                    modal.msgSuccess('修改成功');
                    visible.value = false;
                    emit('ok');
                });
            } else {
                createDept(form.value).then(() => {
                    modal.msgSuccess('新增成功');
                    visible.value = false;
                    emit('ok');
                });
            }
        }
    });
}

function show() {
    visible.value = true;
    listDept({}).then((res) => {
        deptOptions.value = getTreeselect(res.data || []);
    });
}

defineExpose<BaseInstance>({
    show,
});
</script>
