<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
            <el-form-item label="岗位编码" prop="postCode">
                <el-input
                    v-model="queryParams.postCode"
                    placeholder="请输入岗位编码"
                    clearable
                    style="width: 200px"
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="岗位名称" prop="postName">
                <el-input
                    v-model="queryParams.postName"
                    placeholder="请输入岗位名称"
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
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:post:add']"
                    >新增</el-button
                >
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="postList" border>
            <el-table-column label="岗位编码" align="center" prop="postCode" width="180" />
            <el-table-column label="岗位名称" align="center" prop="postName" width="180" />
            <el-table-column label="状态" align="center" prop="status" width="120">
                <template #default="scope">
                    <el-tag type="info" v-if="scope.row.status" size="small">停用</el-tag>
                    <el-tag type="primary" v-else size="small">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" />
            <el-table-column label="岗位排序" align="center" prop="orderNum" width="120" />
            <el-table-column label="操作" width="200" align="center" class-name="small-padding">
                <template #default="scope">
                    <el-tooltip content="修改" placement="top">
                        <el-button
                            link
                            type="primary"
                            icon="Edit"
                            @click="handleEdit(scope.row)"
                            v-hasPermi="['system:post:edit']"
                        ></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button
                            link
                            type="danger"
                            icon="Delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['system:post:delete']"
                        ></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
        />

        <!-- 添加或修改岗位对话框 -->
        <el-dialog :title="title" v-model="open" width="500px" append-to-body>
            <el-form ref="postRef" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="岗位名称" prop="postName">
                    <el-input v-model="form.postName" placeholder="请输入岗位名称" />
                </el-form-item>
                <el-form-item label="岗位编码" prop="postCode">
                    <el-input v-model="form.postCode" placeholder="请输入编码名称" />
                </el-form-item>
                <el-form-item label="岗位顺序" prop="orderNum">
                    <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                </el-form-item>
                <el-form-item label="岗位状态" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio-group v-model="form.status">
                            <el-radio :value="false">正常</el-radio>
                            <el-radio :value="true">停用</el-radio>
                        </el-radio-group>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup lang="ts" name="Post">
import { listPost, createPost, delPost, getPost, updatePost } from '@/api/system/post';
import type { SysPost, PostQueryParams } from '@/types/api/system/post';
import modal from '@/plugins/modal';

import type { FormInstance } from 'element-plus';
const postRef = useTemplateRef<FormInstance>('postRef');
const queryRef = useTemplateRef<FormInstance>('queryRef');

const postList = ref<SysPost[]>([]);
const open = ref<boolean>(false);
const loading = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const ids = ref<number[]>([]);
const total = ref<number>(0);
const title = ref<string>('');

const data = reactive({
    form: {} as SysPost,
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        postCode: undefined,
        postName: undefined,
        status: undefined,
    } as PostQueryParams,
    rules: {
        postName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
        postCode: [{ required: true, message: '岗位编码不能为空', trigger: 'blur' }]
    },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询岗位列表 */
function getList() {
    loading.value = true;
    listPost(queryParams.value).then((res) => {
        postList.value = res.data.records;
        total.value = res.data.total;
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
        postId: undefined,
        postCode: undefined,
        postName: undefined,
        orderNum: 0,
        status: false,
        remark: undefined,
    };
    postRef.value?.resetFields();
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
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
    open.value = true;
    title.value = '添加岗位';
}

/** 修改按钮操作 */
function handleEdit(row: SysPost) {
    reset();
    form.value = {...row};
    open.value = true;
    title.value = '修改岗位';
}

/** 提交按钮 */
function submitForm() {
    postRef.value?.validate((valid: boolean) => {
        if (valid) {
            if (form.value.postId != undefined) {
                updatePost(form.value).then(() => {
                    modal.msgSuccess('修改成功');
                    open.value = false;
                    getList();
                });
            } else {
                createPost(form.value).then(() => {
                    modal.msgSuccess('新增成功');
                    open.value = false;
                    getList();
                });
            }
        }
    });
}

/** 删除按钮操作 */
function handleDelete(row?: SysPost) {
    const postIds = row?.postId || ids.value;
    modal
        .confirm('是否确认删除岗位编号为"' + postIds + '"的数据项？')
        .then(function () {
            return delPost(postIds);
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
</script>
