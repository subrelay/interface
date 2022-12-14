<template>
  <n-modal
    class="account_modal"
    :show="props.modelValue"
    @update:show="emits('update:modelValue', $event)"
    :showIcon="false"
    title="Dialog"
  >
    <n-card
      :bordered="false"
      :segmented="{ content: true }"
      style="width: 600px"
      title="Select Account"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="emits('update:modelValue', false)">
          <Icon icon="gg:close" :inline="true" width="20" />
        </n-button>
      </template>

      <n-space vertical>
        <n-card
          small
          hoverable
          class="cursor-pointer"
          v-for="(account, index) in accounts"
          @click="onSelectAccount(account)"
          :key="index"
          :bordered="currentAcc.address === account.address"
          :embedded="currentAcc.address === account.address"
        >
          <n-space align="center" justify="space-between">
            <n-space align="center">
              <PolkadotAccountIcon @click="onCopy(account)" />
              <div>
                <div class="account_name">{{ account.name }}</div>
                <n-text depth="3" class="account_address">
                  {{ account.address }}
                </n-text>
              </div>
            </n-space>

            <Icon
              width="24"
              icon="line-md:confirm"
              v-if="currentAcc.address === account.address"
            />
          </n-space>
        </n-card>
      </n-space>

      <template #action>
        <div style="text-align: right">
          <n-button
            type="primary"
            @click="onConfirm"
            :disabled="!currentAcc.address"
          >
            Confirm
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import PolkadotAccountIcon from '@/components/Misc/PolkadotAccountIcon';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean },
  isSigningIn: { type: Boolean, default: true },
});
const emits = defineEmits(['update:modelValue']);

const store = useStore();
const router = useRouter();
const message = useMessage();

const accounts = ref([
  { name: 'Foo', address: '22EUKZfNUV6JPZ1baLscJShX7djtDDZnkiFZwqF7Fk8X5oUp' },
  { name: 'Bar', address: '26VUtimeU2asGUt9EWQr4AomgUgrxVp9ZLXmWQwNvT7N2zGg' },
  {
    name: 'Lorem',
    address: '26VUtimeU2asGUt9EWQr4AomgUgrxVp9ZLXmWQwNvT7N2zGz',
  },
]);

const currentAcc = ref({});
const storedAccount = computed(() => store.state.global.walletAccount);

function onSelectAccount(account) {
  currentAcc.value = account;
}

function onConfirm() {
  store.commit('global/setWalletAccount', currentAcc.value);
  emits('update:modelValue', false);

  // this is a temporary method.
  // update later to use official Auth method instead,
  // to detect login event.
  if (props.isSigningIn) {
    router.push({ name: 'workflows' });
  }
}
function onCopy({ address }) {
  navigator.clipboard.writeText(address);
  message.success('Copied!');
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      currentAcc.value = storedAccount.value;
    }
  }
);
</script>

<style lang="scss" scoped>
.account_modal {
  .account_name {
    font-weight: bold;
  }

  .account_address {
    font-size: 0.75rem;
  }
}
</style>
