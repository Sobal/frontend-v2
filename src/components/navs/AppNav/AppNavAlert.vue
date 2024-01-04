<template>
  <div
    role="alert"
    aria-live="polite"
    class="mt-3 rounded-md"
    :class="['app-nav-alert', classes]"
    @click="handleClick"
  >
    <div class="flex flex-1 justify-center fade-in-slow">
      <BalIcon v-if="iconName" :name="iconName" class="mr-3" />
      <div>
        <p class="alert-label">
          {{ alert.label }}
        </p>
        <BalBtn
          v-if="alert.action && alert.actionLabel"
          class="cursor-pointer"
          color="white"
          size="xs"
          :label="alert.actionLabel"
          @click="alert.action"
        />
      </div>
    </div>

    <div v-if="!alert.persistent" class="flex items-start">
      <BalIcon
        name="x"
        class="mt-0.5 cursor-pointer fade-in-slow"
        @click.stop="handleClose"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import useAlerts, { Alert, AlertType } from '@/composables/useAlerts';

export default defineComponent({
  props: {
    alert: { type: Object as PropType<Alert>, required: true },
  },

  setup(props) {
    const { removeAlert } = useAlerts();

    const colorClass = computed(() => {
      switch (props.alert.type) {
        case AlertType.ERROR:
          return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white';
        case AlertType.FEATURE:
          return 'bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-black';
        default:
          return 'bg-black text-white';
      }
    });

    const iconName = computed(() => {
      switch (props.alert.type) {
        case AlertType.ERROR:
          return 'alert-triangle';
        default:
          return null;
      }
    });

    const classes = computed(() => {
      return {
        [colorClass.value]: true,
        'cursor-pointer': props.alert.actionOnClick,
      };
    });

    function handleClose() {
      removeAlert(props.alert.id);
    }

    function handleClick() {
      if (props.alert.actionOnClick && props.alert.action) {
        props.alert.action();
      }
    }

    return { classes, iconName, handleClose, handleClick };
  },
});
</script>

<style>
.app-nav-alert {
  @apply flex content-start justify-between py-2 xs:py-4 px-4;

  min-height: 54px;
}

.alert-label {
  @apply font-medium pb-1 block md:inline pr-4;
}
</style>
