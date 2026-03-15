<template>
    <div class="app-container">
        <el-row :gutter="20">
            <splitpanes :horizontal="appStore.device === 'mobile'" class="default-theme">
                <!--部门数据-->
                <pane size="10">
                    <el-col>
                        <div class="head-container">
                            <el-input
                                v-model="deptName"
                                placeholder="请输入部门名称"
                                clearable
                                prefix-icon="Search"
                                style="margin-bottom: 20px"
                            />
                        </div>
                        <div class="head-container">
                            <el-tree
                                :data="deptOptions"
                                :props="{ label: 'deptName', children: 'children' }"
                                :expand-on-click-node="false"
                                :filter-node-method="filterNode"
                                ref="deptTreeRef"
                                node-key="deptId"
                                highlight-current
                                default-expand-all
                                @node-click="handleNodeClick"
                            />
                        </div>
                    </el-col>
                </pane>
                <!--用户数据-->
                <pane size="94">
                    <el-col>
                        <el-form
                            :model="queryParams"
                            ref="queryRef"
                            :inline="true"
                            v-show="showSearch"
                            label-width="68px"
                        >
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
                                <el-button
                                    type="primary"
                                    plain
                                    icon="Plus"
                                    @click="handleAdd"
                                    v-hasPermi="['system:user:add']"
                                    >新增</el-button
                                >
                            </el-col>
                            <el-col :span="1.5">
                                <el-button
                                    type="danger"
                                    plain
                                    icon="Delete"
                                    :disabled="multiple"
                                    @click="handleDeleteBatch"
                                    v-hasPermi="['system:user:delete']"
                                    >删除</el-button
                                >
                            </el-col>
                            <el-col :span="1.5">
                                <el-button
                                    type="info"
                                    plain
                                    icon="Upload"
                                    @click="handleImport"
                                    v-hasPermi="['system:user:import']"
                                    >导入</el-button
                                >
                            </el-col>
                            <el-col :span="1.5">
                                <el-button
                                    type="warning"
                                    plain
                                    icon="Download"
                                    @click="handleExport"
                                    v-hasPermi="['system:user:export']"
                                    >导出</el-button
                                >
                            </el-col>
                            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
                        </el-row>

                        <el-table v-loading="loading" :data="userList" border @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="50" align="center" />
                            <el-table-column label="用户名称" prop="username" :show-overflow-tooltip="true" />
                            <el-table-column label="手机号码" prop="mobile" />
                            <el-table-column label="部门" prop="deptName" :show-overflow-tooltip="true" />
                            <el-table-column label="状态" align="center">
                                <template #default="scope">
                                    <el-tag :type="scope.row.status === 0 ? 'primary' : 'info'" size="small">{{
                                        scope.row.statusDesc
                                    }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" align="center" width="200" class-name="small-padding">
                                <template #default="scope">
                                    <el-tooltip content="修改" placement="top">
                                        <el-button
                                            link
                                            type="primary"
                                            icon="Edit"
                                            @click="handleUpdate(scope.row)"
                                            v-hasPermi="['system:user:edit']"
                                        ></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="删除" placement="top" v-if="scope.row.userId !== 1">
                                        <el-button
                                            link
                                            type="primary"
                                            icon="Delete"
                                            @click="handleDelete(scope.row)"
                                            v-hasPermi="['system:user:remove']"
                                        ></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="重置密码" placement="top" v-if="scope.row.userId !== 1">
                                        <el-button
                                            link
                                            type="primary"
                                            icon="Key"
                                            @click="handleResetPwd(scope.row)"
                                            v-hasPermi="['system:user:resetPwd']"
                                        ></el-button>
                                    </el-tooltip>
                                    <el-tooltip content="分配角色" placement="top" v-if="scope.row.userId !== 1">
                                        <el-button
                                            link
                                            type="primary"
                                            icon="CircleCheck"
                                            @click="handleAuthRole(scope.row)"
                                            v-hasPermi="['system:user:edit']"
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
                    </el-col>
                </pane>
            </splitpanes>
        </el-row>

        <!-- 添加或修改用户配置对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
            <el-form :model="form" :rules="rules" ref="userRef" label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" label="用户名称" prop="username">
                            <el-input v-model="form.username" placeholder="请输入用户名称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
                            <el-input
                                v-model="form.password"
                                placeholder="请输入用户密码"
                                type="password"
                                maxlength="20"
                                show-password
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="用户性别">
                            <el-select v-model="form.gender" placeholder="请选择">
                                <el-option
                                    v-for="dict in sys_user_sex"
                                    :key="dict.value"
                                    :label="dict.label"
                                    :value="dict.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码" prop="mobile">
                            <el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="状态">
                            <el-radio-group v-model="form.status">
                                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :value="dict.value">{{
                                    dict.label
                                }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="归属部门" prop="deptId">
                            <el-tree-select
                                v-model="form.deptId"
                                :data="enabledDeptOptions"
                                :props="{ value: 'id', label: 'label', children: 'children' }"
                                value-key="id"
                                placeholder="请选择归属部门"
                                clearable
                                check-strictly
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="岗位">
                            <el-select v-model="form.postIds" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in postOptions"
                                    :key="item.postId"
                                    :label="item.postName"
                                    :value="item.postId"
                                    :disabled="item.status == 1"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色">
                            <el-select v-model="form.roleIds" multiple placeholder="请选择">
                                <el-option
                                    v-for="item in roleOptions"
                                    :key="item.roleId"
                                    :label="item.roleName"
                                    :value="item.roleId"
                                    :disabled="item.status == 1"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注">
                            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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

        <!-- 用户导入对话框 -->
        <!-- <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
            <el-upload
                ref="uploadRef"
                :limit="1"
                accept=".xlsx, .xls"
                :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport"
                :disabled="upload.isUploading"
                :on-progress="handleFileUploadProgress"
                :on-success="handleFileSuccess"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :auto-upload="false"
                drag
            >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <template #tip>
                    <div class="el-upload__tip text-center">
                        <div class="el-upload__tip">
                            <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                        </div>
                        <span>仅允许导入xls、xlsx格式文件。</span>
                        <el-link
                            type="primary"
                            underline="never"
                            style="font-size: 12px; vertical-align: baseline"
                            @click="importTemplate"
                            >下载模板</el-link
                        >
                    </div>
                </template>
            </el-upload>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitFileForm">确 定</el-button>
                    <el-button @click="upload.open = false">取 消</el-button>
                </div>
            </template>
        </el-dialog> -->
    </div>
</template>

<script setup lang="ts" name="User">
import { getToken } from '@/utils/auth';
import useAppStore from '@/store/modules/app';
import { listUser, resetUserPwd, delUser, getUser, updateUser, addUser } from '@/api/system/user';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { listDept } from '@/api/system/dept';
import type { SysUser, UserQueryParams, UserFormDataResult } from '@/types/api/system/user';
import type { SysRole } from '@/types/api/system/role';
import type { SysPost } from '@/types/api/system/post';
import type { Result } from '@/types/api/common';
import modal from '@/plugins/modal';
import { download } from '@/utils/request';
import { validateEmail } from '@/utils/email';

const router = useRouter();
const appStore = useAppStore();

const userList = ref<SysUser[]>([]);
const open = ref<boolean>(false);
const loading = ref<boolean>(false);
const showSearch = ref<boolean>(true);
const ids = ref<number[]>([]);
const single = ref<boolean>(true);
const multiple = ref<boolean>(true);
const total = ref<number>(0);
const title = ref<string>('');
const deptName = ref<string>('');
const deptOptions = ref<SysDept[]>([]);
const enabledDeptOptions = ref<SysDept[] | undefined>([]);
const initPassword = ref<string | undefined>(undefined);
const postOptions = ref<SysPost[]>([]);
const roleOptions = ref<SysRole[]>([]);

// 组件引用
import { ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules, UploadInstance, UploadUserFile, TreeInstance } from 'element-plus';
import { SysDept } from '@/types';
const deptTreeRef = useTemplateRef<TreeInstance>('deptTreeRef');
const userRef = useTemplateRef<FormInstance>('userRef');
const uploadRef = useTemplateRef<UploadInstance>('uploadRef');
const queryRef = useTemplateRef<FormInstance>('queryRef');

interface Upload {
    // 是否显示弹出层（用户导入）
    open: boolean;
    // 弹出层标题（用户导入）
    title: string;
    // 是否禁用上传
    isUploading: boolean;
    // 是否更新已经存在的用户数据
    updateSupport: number;
    // 设置上传的请求头部
    headers: Record<string, string>;
    // 上传的地址
    url: string;
    selectedFile?: UploadUserFile | null;
}

/*** 用户导入参数 */
const upload = reactive<Upload>({
    // 是否显示弹出层（用户导入）
    open: false,
    // 弹出层标题（用户导入）
    title: '',
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的用户数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { Authorization: 'Bearer ' + getToken() },
    // 上传的地址
    url: import.meta.env.VITE_APP_BASE_API + '/system/user/importData',
});

const data = reactive({
    form: {} as SysUser,
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        username: undefined,
        mobile: undefined,
        status: undefined,
        deptId: undefined,
    } as UserQueryParams,
    rules: {
        userName: [
            { required: true, message: '用户名称不能为空', trigger: 'blur' },
            { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '用户密码不能为空', trigger: 'blur' },
            { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' },
            { pattern: /^[^<>"'|\\]+$/, message: '不能包含非法字符：< > " \' \\\ |', trigger: 'blur' },
        ],
        email: [{ validator: validateEmail, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
        mobile: [{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur' }],
    },
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */
const filterNode = (value: string, data: any): boolean => {
    if (!value) return true;
    return data.deptName.indexOf(value) !== -1;
};

/** 根据名称筛选部门树 */
watch(deptName, (val: string) => {
    deptTreeRef.value!.filter(val);
});

/** 查询用户列表 */
function getList() {
    loading.value = true;
    listUser(queryParams.value).then((res) => {
        console.log(res.data.records);
        userList.value = res.data.records;
        total.value = res.data.total;
        loading.value = false;
    });
}

/** 查询部门下拉树结构 */
function getDeptTree() {
    listDept({
        deptName: deptName.value,
    }).then((res) => {
        deptOptions.value = res.data;
        enabledDeptOptions.value = filterDisabledDept(JSON.parse(JSON.stringify(res.data)));
    });
}

/** 过滤禁用的部门 */
function filterDisabledDept(deptList: SysDept[]) {
    return deptList.filter((dept) => {
        if (dept.status) {
            return false;
        }
        if (dept.children && dept.children.length) {
            dept.children = filterDisabledDept(dept.children);
        }
        return true;
    });
}

/** 节点单击事件 */
function handleNodeClick(data: SysDept) {
    if (queryParams.value.deptId && queryParams.value.deptId === data.deptId) {
        deptTreeRef.value!.setCurrentKey(null);
        queryParams.value.deptId = undefined;
    } else {
        queryParams.value.deptId = data.deptId;
    }
    handleQuery();
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    queryRef.value?.resetFields();
    queryParams.value.deptId = undefined;
    deptTreeRef.value!.setCurrentKey(null);
    handleQuery();
}

function handleDeleteBatch() {
    if (ids.value.length === 0) {
        modal.msgError('请选择要删除的用户');
        return;
    }
    deleteAct(ids.value);
}

/** 删除按钮操作 */
function handleDelete(row: SysUser) {
    const userId = row.userId;
    if (!userId) {
        modal.msgError('用户ID不能为空');
        return;
    }
    deleteAct(userId);
}

function deleteAct(data: number | number[]) {
    modal
        .confirm('是否确认删除？')
        .then(function () {
            return delUser(data);
        })
        .then(() => {
            getList();
            modal.msgSuccess('删除成功');
        })
        .catch(() => {});
}

/** 导出按钮操作 */
function handleExport() {
    download(
        'system/user/export',
        {
            ...queryParams.value,
        },
        `user_${new Date().getTime()}.xlsx`,
    );
}

/** 跳转角色分配 */
function handleAuthRole(row: SysUser) {
    const userId = row.userId;
    router.push('/system/user-auth/role/' + userId);
}

/** 重置密码按钮操作 */
function handleResetPwd(row: SysUser) {
    ElMessageBox.prompt('请输入"' + row.username + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: '用户密码长度必须介于 5 和 20 之间',
        inputValidator: (value: string) => {
            if (/<|>|"|'|\||\\/.test(value)) {
                return '不能包含非法字符：< > " \' \\\ |';
            }
            return true;
        },
    })
        .then(({ value }: { value: string }) => {
            resetUserPwd(row.userId!, value).then(() => {
                modal.msgSuccess('修改成功，新密码是：' + value);
            });
        })
        .catch(() => {});
}

/** 选择条数  */
function handleSelectionChange(selection: SysUser[]) {
    ids.value = selection.map((item) => item.userId!);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

/** 导入按钮操作 */
function handleImport() {
    upload.title = '用户导入';
    upload.open = true;
    upload.selectedFile = null;
}

/** 下载模板操作 */
function importTemplate() {
    download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`);
}

/**文件上传中处理 */
const handleFileUploadProgress = (event: any, file: any, fileList: any[]) => {
    upload.isUploading = true;
};

/** 文件选择处理 */
const handleFileChange = (file: UploadUserFile, fileList: UploadUserFile[]) => {
    upload.selectedFile = file;
};

/** 文件删除处理 */
const handleFileRemove = (file: UploadUserFile, fileList: UploadUserFile[]) => {
    upload.selectedFile = undefined;
};

/** 文件上传成功处理 */
const handleFileSuccess = (response: Result, file: any, fileList: any[]) => {
    upload.open = false;
    upload.isUploading = false;
    uploadRef.value?.handleRemove(file);
    ElMessageBox.alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
            response.msg +
            '</div>',
        '导入结果',
        { dangerouslyUseHTMLString: true },
    );
    getList();
};

/** 提交上传文件 */
function submitFileForm() {
    const file = upload.selectedFile;
    if (file && (file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx'))) {
        uploadRef.value?.submit();
    } else {
        modal.msgError('请选择后缀为 “xls”或“xlsx”的文件。');
    }
}

/** 重置操作表单 */
function reset() {
    form.value = {};
    userRef.value?.resetFields();
}

/** 取消按钮 */
function cancel() {
    open.value = false;
    reset();
}

/** 新增按钮操作 */
function handleAdd() {
    reset();
    // postOptions.value = response.posts;
    // roleOptions.value = response.roles;
    open.value = true;
    title.value = '添加用户';
    form.value.password = initPassword.value;
}

/** 修改按钮操作 */
function handleUpdate(row?: SysUser) {
    reset();
    const userId = row?.userId || ids.value[0];
    getUser(userId).then((response) => {
        form.value = response.data!;
        postOptions.value = response.posts;
        roleOptions.value = response.roles;
        form.value.roleIds = response.roleIds;
        open.value = true;
        title.value = '修改用户';
        form.value.password = '';
    });
}

/** 提交按钮 */
function submitForm() {
    userRef.value!.validate((valid: boolean) => {
        if (valid) {
            if (form.value.userId != undefined) {
                updateUser(form.value).then(() => {
                    modal.msgSuccess('修改成功');
                    open.value = false;
                    getList();
                });
            } else {
                addUser(form.value).then(() => {
                    modal.msgSuccess('新增成功');
                    open.value = false;
                    getList();
                });
            }
        }
    });
}

onMounted(() => {
    getDeptTree();
    getList();
    // proxy.getConfigKey('sys.user.initPassword').then((response: AjaxResult) => {
    //     initPassword.value = response.msg;
    // });
});

defineOptions({
    name: 'User',
});
</script>
