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
          <a
            :href="`${proxyBaseUrl}${tableData[rowIndex].path}`"
            target="_blank"
            >{{ tableData[rowIndex].path }}</a
          >
        </template>
        <template #action="{ rowIndex }">
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
      request.delete(`${config.BASE_URL}/api/${id}`).then((list) => {
        tableData.value = list;
      });
    };
    const handleCreate = () => {
      form.path = "";
      form.target = "";
      visible.value = true;
    };
    const handleModalConfirm = (done) => {
      const data = { ...form }
      if (!data.path.startsWith("/")) {
        data.path = `/${data.path}`;
      }
      return request
        .post("/api/create", {
          ...data,
        })
        .then((res) => {
          tableData.value = res;
          done();
        }).catch(() => {
          done(false)
        })
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
      handleSearch,
      handleCreate,
      handleDelete,
      proxyBaseUrl,
      handleModalConfirm,
    };
  },
});
</script>

<style>
.container {
  margin: 24px;
}
</style>
