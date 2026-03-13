<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
            <el-form-item label="部门名称" prop="deptName">
                <el-input
                    v-model="queryParams.deptName"
                    placeholder="请输入部门名称"
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
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:dept:add']"
                    >新增</el-button
                >
            </el-col>
            <el-col :span="1.5">
                <el-button type="info" plain icon="Sort" @click="toggleExpandAll">展开/折叠</el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table
            v-if="refreshTable"
            v-loading="loading"
            :data="deptList"
            border
            row-key="deptId"
            :default-expand-all="isExpandAll"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="deptName" label="部门名称" width="200"></el-table-column>
            <el-table-column prop="phone" label="联系电话" width="200"></el-table-column>
            <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
            <el-table-column prop="leader" label="负责人" width="200"></el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                    <el-tag type="info" v-if="scope.row.status" size="small">停用</el-tag>
                    <el-tag type="primary" v-else size="small">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding" width="200">
                <template #default="scope">
                    <el-tooltip content="修改" placement="top">
                        <el-button
                            link
                            type="primary"
                            icon="Edit"
                            @click="handleEdit(scope.row)"
                            v-hasPermi="['system:dept:edit']"
                        ></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button
                            link
                            type="danger"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:dept:delete']"
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 添加或修改部门对话框 -->
        <el-dialog :title="title" v-model="open" width="650px" append-to-body>
            <el-form ref="deptRef" :model="form" :rules="rules" label-width="90px">
                <el-row>
                    <el-col :span="24" v-if="form.parentId !== 0">
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
                        <el-form-item label="负责人" prop="leader">
                            <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
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
                                <el-radio :value="false">正常</el-radio>
                                <el-radio :value="true">停用</el-radio>
                            </el-radio-group>
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
import { listDept, delDept, createDept, updateDept } from '@/api/system/dept';
import type { SysDept, DeptQueryParams } from '@/types';
import modal from '@/plugins/modal';
import { validateEmail } from '@/utils/email';

import type { FormInstance } from 'element-plus';
const queryRef = useTemplateRef<FormInstance>('queryRef');
const deptRef = useTemplateRef<FormInstance>('deptRef');

const deptList = ref<SysDept[]>([]);
const open = ref<boolean>(false);
const loading = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const title = ref<string>('');
const deptOptions = ref<SysDept[]>([]);
const isExpandAll = ref<boolean>(false);
const refreshTable = ref<boolean>(true);

const data = reactive({
    form: {} as SysDept,
    queryParams: {
        deptName: undefined,
    } as DeptQueryParams,
    rules: {
        deptName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '显示排序不能为空', trigger: 'blur' }],
        email: [{ validator: validateEmail, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        phone: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
    },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询部门列表 */
function getList() {
    loading.value = true;
    listDept(queryParams.value).then((res) => {
        deptList.value = res.data;
        loading.value = false;
    });
}

/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
}

/** 表单重置 */
function reset() {
    form.value = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: 0,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: false,
        remark: undefined,
    };
    deptRef.value?.resetFields();
}

/** 搜索按钮操作 */
function handleQuery() {
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    queryRef.value?.resetFields();
    handleQuery();
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    deptOptions.value = getTreeselect(deptList.value);
    open.value = true;
    title.value = '添加部门';
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

/** 展开/折叠操作 */
function toggleExpandAll() {
    refreshTable.value = false;
    isExpandAll.value = !isExpandAll.value;
    nextTick(() => {
        refreshTable.value = true;
    });
}

/** 修改按钮操作 */
function handleEdit(row: SysDept) {
    reset();
    if (row.parentId === 0) row.parentId = undefined;
    form.value = row;
    title.value = '修改部门';
    deptOptions.value = getTreeselect(deptList.value);
    open.value = true;
}

/** 提交按钮 */
function submitForm() {
    deptRef.value!.validate((valid: boolean) => {
        if (valid) {
            if (form.value.deptId != undefined) {
                updateDept(form.value).then(() => {
                    modal.msgSuccess('修改成功');
                    open.value = false;
                    getList();
                });
            } else {
                createDept(form.value).then(() => {
                    modal.msgSuccess('新增成功');
                    open.value = false;
                    getList();
                });
            }
        }
    });
}

/** 删除按钮操作 */
function handleDelete(row: SysDept) {
    modal
        .confirm('是否确认删除名称为"' + row.deptName + '"的数据项?')
        .then(function () {
            return delDept(row.deptId!);
        })
        .then(() => {
            getList();
            modal.msgSuccess('删除成功');
        })
        .catch(() => {});
}

onMounted(() => {
    getList();
});

defineOptions({
    name: 'Dept',
});
</script>
