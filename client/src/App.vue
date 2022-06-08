<script>
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
  },
  setup() {
    const visible = ref(false);
    const proxyBaseUrl = ref(`${window.location.host}/proxy`)
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
    ];
    const tableData = ref([]);

    const handleSearch = () => {
      fetch("http://localhost:3000/api/list")
        .then((r) => r.json())
        .then((res) => (tableData.value = res));
    };

    const handleCreate = () => {
      visible.value = true;
    };
    const handleModalConfirm = (done) => {
      return fetch("http://localhost:3000/api/create", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...form,
        }),
      })
        .then((r) => {
          if (r.status !== 200) {
            return Promise.reject(r);
          }
          return r.json();
        })
        .then((res) => {
          tableData.value = res;
          done();
        })
        .catch(done);
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
      proxyBaseUrl,
      handleModalConfirm,
    };
  },
});
</script>

<template>
  <div class="container">
    <Space direction="vertical" fill>
      <Card>
        <Space>
          <Button type="primary" @click="handleSearch">查询</Button>
          <Button type="outline" @click="handleCreate">添加</Button>
        </Space>
      </Card>
      <Card>
        <Table :columns="columns" :data="tableData">
          <template #path="{ rowIndex }">
            <a
              :href="`${proxyBaseUrl}${tableData[rowIndex].path}`"
              target="_blank"
              >{{ `/proxy${tableData[rowIndex].path}` }}</a
            >
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
          <Input v-model="form.path" />
        </FormItem>
        <FormItem label="Target" field="target">
          <Input v-model="form.target" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<style>
.container {
  margin: 24px;
}
</style>
