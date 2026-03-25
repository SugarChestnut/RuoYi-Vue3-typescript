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
            <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="scope">
                    <el-tag type="info" v-if="scope.row.status" size="small">停用</el-tag>
                    <el-tag type="primary" v-else size="small">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding" width="150">
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
        <edit-dept ref="editDeptRef" @ok="getList" :title="title" :dept="dept" />
    </div>
</template>

<script setup lang="ts" name="Dept">
import EditDept from './EditDept.vue';

import { listDept, delDept } from '@/api/system/dept';
import type { SysDept, DeptQueryParams } from '@/types';
import type { BaseInstance } from '@/types/vue-instance';
import type { FormInstance } from 'element-plus';

import modal from '@/plugins/modal';

const queryRef = useTemplateRef<FormInstance>('queryRef');
const editDeptRef = useTemplateRef<BaseInstance>('editDeptRef');
const deptList = ref<SysDept[]>([]);
const loading = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const title = ref<string>('');
const isExpandAll = ref<boolean>(false);
const refreshTable = ref<boolean>(true);

const data = reactive({
    dept: {} as SysDept,
    queryParams: {
        deptName: undefined,
    } as DeptQueryParams,
});

const { queryParams, dept } = toRefs(data);

/** 查询部门列表 */
function getList() {
    loading.value = true;
    listDept(queryParams.value)
        .then((res) => {
            deptList.value = res.data;
            loading.value = false;
        })
        .finally(() => {
            loading.value = false;
        });
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
    dept.value = {} as SysDept;
    title.value = '添加部门';
    editDeptRef.value?.show();
}

/** 修改按钮操作 */
function handleEdit(row: SysDept) {
    dept.value = row;
    title.value = '修改部门';
    editDeptRef.value?.show();
}

/** 展开/折叠操作 */
function toggleExpandAll() {
    refreshTable.value = false;
    isExpandAll.value = !isExpandAll.value;
    nextTick(() => {
        refreshTable.value = true;
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
