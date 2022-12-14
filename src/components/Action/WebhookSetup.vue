<template>
  <n-form
    ref="formRef"
    label-placement="top"
    label-width="auto"
    @keyup.enter="onContinue"
    :model="EditorData.workflow.tasks[actionIdx].config.config"
  >
    <n-form-item path="url" label="URL" :rule="urlRule">
      <n-input
        clearable
        v-model:value="EditorData.workflow.tasks[1].config.config.url"
      />
    </n-form-item>

    <n-form-item path="headers[0].key" label="Header key" :rule="keyRule">
      <n-input
        clearable
        v-model:value="
          EditorData.workflow.tasks[actionIdx].config.config.headers[0].key
        "
      />
    </n-form-item>

    <n-form-item path="headers[0].value" label="Header value" :rule="valueRule">
      <n-input
        clearable
        v-model:value="
          EditorData.workflow.tasks[actionIdx].config.config.headers[0].value
        "
      />
    </n-form-item>
    <n-button class="action_button" type="primary" @click="onContinue">
      Continue
    </n-button>
  </n-form>
</template>

<script setup>
import ChainDropdown from '@/components/Common/ChainDropdown';
import EditorData from '@/store/localStore/EditorData';
import { useFormValidation } from '@/composables';
import { ref, computed, inject } from 'vue';

const [{ formRef }, { validateForm }] = useFormValidation('action');

const actionIdx = computed(() => EditorData.actionIdx);

const keyRule = ref({
  required: true,
  trigger: ['input'],
  validator(_rule, value) {
    eventBus.emit('toggleTestAction', { isDisabled: true });
    if (!value) {
      return new Error('Required!');
    } else if (/(-_)+|(_-)+|(-{2,})|(_{2,})|[^a-zA-Z0-9_-]/g.test(value)) {
      return new Error('Invalid value');
    }
    return true;
  },
});

const valueRule = ref({
  required: true,
  trigger: ['input'],
  type: ['string', 'number'],
  validator(_rule, value) {
    eventBus.emit('toggleTestAction', { isDisabled: true });
    if (!value) {
      return new Error('Required!');
    } else if (/(\W{2,})|[^a-zA-Z0-9\W-_] /.test(value)) {
      return new Error('Invalid value');
    }
    return true;
  },
});

const urlRule = ref({
  required: true,
  trigger: ['input'],
  validator(_rule, value) {
    eventBus.emit('toggleTestAction', { isDisabled: true });
    if (!value) {
      return new Error('Required!');
    } else if (
      !/^(http(s)?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(
        value
      )
    ) {
      return new Error('Invalid URL');
    }
    return true;
  },
});

const eventBus = inject('eventBus');
const emitContinue = inject('emitContinue');

function onContinue(e) {
  e.preventDefault();

  validateForm({}, () => {
    eventBus.emit('toggleTestAction', { isDisabled: false });
    emitContinue();
    EditorData.setComplete('action', true);
  });
}
</script>
