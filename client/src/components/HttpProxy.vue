<template>
  <Space direction="vertical" fill>
    <Card>
      <Space>
        <Button type="primary" @click="handleCreate">添加</Button>
      </Space>
    </Card>
    <Card>
      <Table :columns="columns" :data="tableData">
        <template #path="{ rowIndex }">
          <Space>
            <a
              :href="`${proxyBaseUrl}${tableData[rowIndex].path}`"
              target="_blank"
              >{{ tableData[rowIndex].path }}</a
            >
            <icon-copy
              class="icon"
              @click="handleCopy(`${proxyBaseUrl}${tableData[rowIndex].path}`)"
            />
          </Space>
        </template>
        <template #target="{ rowIndex }">
          <Space>
            <p>{{ tableData[rowIndex].target }}</p>
            <a :href="getSafeHttpUrl(tableData[rowIndex].target)" target="_blank">
              <icon-launch
                class="icon"
                @click="handleCopy(`${proxyBaseUrl}${tableData[rowIndex].path}`)"
              />
            </a>
          </Space>
        </template>
        <template #action="{ rowIndex }">
          <Space>
            <Button
              type="primary"
              @click="handleStatus(tableData[rowIndex], rowIndex)"
              :status="tableData[rowIndex].status === 0 ? 'success' : 'warning'"
              >{{ tableData[rowIndex].status === 0 ? "启用" : "禁用" }}</Button
            >
            <Button type="primary" @click="handleUpdate(tableData[rowIndex])"
              >编辑</Button
            >
            <Popconfirm
              content="确认删除？"
              @ok="handleDelete(tableData[rowIndex].id)"
            >
              <Button type="outline" status="danger">
                <template #icon>
                  <icon-delete />
                </template>
                删除</Button
              >
            </Popconfirm>
          </Space>
        </template>
      </Table>
    </Card>
  </Space>
  <Modal
    title="添加代理"
    v-model:visible="visible"
    @cancel="handleModalCancel"
    @before-ok="handleModalConfirm"
  >
    <Form :model="form">
      <FormItem label="Path" field="path">
        <Input v-model="form.path" autofocus />
      </FormItem>
      <FormItem label="Target" field="target">
        <Input v-model="form.target" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script>
import request from "@/utils/request";
import config from "@/config/api";
import { copyText } from "vue3-clipboard";
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import {
  Table,
  Card,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Message,
  FormItem,
  Popconfirm,
} from "@arco-design/web-vue";
import { ref, defineComponent, onMounted, reactive } from "vue";
export default defineComponent({
  components: {
    Table,
    Card,
    Button,
    Space,
    Modal,
    Input,
    Form,
    FormItem,
    Popconfirm,
  },
  setup() {
    const visible = ref(false);
    const isUpdate = ref(false);
    const proxyBaseUrl = ref(`${config.BASE_URL}/proxy`);
    const form = reactive({ path: "", target: "" });
    const columns = [
      {
        title: "Path",
        dataIndex: "path",
        slotName: "path",
      },
      {
        title: "Target",
        dataIndex: "target",
        slotName: "target",
      },
      {
        title: "Action",
        dataIndex: "action",
        slotName: "action",
      },
    ];
    const tableData = ref([]);

    const handleSearch = () => {
      request.get("/api/list").then((res) => (tableData.value = res));
    };
    const handleDelete = (id) => {
      request.delete(`/api/${id}`).then((list) => {
        tableData.value = list;
      });
    };
    const handleCreate = () => {
      form.path = "";
      form.target = "";
      visible.value = true;
    };
    const handleUpdate = (item) => {
      isUpdate.value = true;
      visible.value = true;
      form.path = item.path;
      form.target = item.target;
      form.id = item.id;
    };
    const getSafeHttpUrl = (url) => {
      if (/https?:\/\//.test(url)) {
        return url
      }
      return `https://${url}`
    }
    const handleStatus = (item, index) => {
      const status = ~item.status + 2;
      request
        .put(`/api/${item.id}`, {
          status,
        })
        .then((data) => {
          handleSearch();
        });
    };
    const handleModalConfirm = (done) => {
      const data = { ...form };
      if (!data.path.startsWith("/")) {
        data.path = `/${data.path}`;
      }
      if (isUpdate.value) {
        return request
          .put(`/api/${data.id}`, data)
          .then((data) => {
            handleSearch();
            isUpdate.value = false;
            done();
          })
          .catch(() => {
            done(false);
          });
      }
      return request
        .post("/api/create", {
          ...data,
        })
        .then((res) => {
          tableData.value = res;
          done();
        })
        .catch(() => {
          done(false);
        });
    };
    const handleCopy = (text) => {
      copyText(text, undefined, () => {
        Message.success("复制成功");
      });
    };
    const handleModalCancel = () => {
      visible.value = false;
    };

    onMounted(() => {
      handleSearch();
    });

    return {
      form,
      visible,
      columns,
      tableData,
      handleCopy,
      handleUpdate,
      handleStatus,
      handleSearch,
      handleCreate,
      handleDelete,
      proxyBaseUrl,
      getSafeHttpUrl,
      handleModalConfirm,
    };
  },
});
</script>

<style>
.container {
  margin: 24px;
}
.icon {
  cursor: pointer;
}
</style>
