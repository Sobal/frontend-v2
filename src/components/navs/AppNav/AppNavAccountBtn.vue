<script setup lang="ts">
import Avatar from '@/components/images/Avatar.vue';
import useBreakpoints from '@/composables/useBreakpoints';
import useWeb3 from '@/services/web3/useWeb3';
import { shorten } from '@/lib/utils';

import AppNavSettings from './AppNavSettings.vue';

const { isMobile } = useBreakpoints();
const { isLoadingProfile, profile, account } = useWeb3();
</script>

<template>
  <BalPopover
    noPad
    :align="isMobile ? 'center' : undefined"
    :detached="isMobile ? true : undefined"
  >
    <template #activator>
      <div class="flex flex-row place-items-center cursor-pointer">
        <BalBtn
          class="text-base"
          :loading="isLoadingProfile"
          loadingLabel=""
          color="white"
          size="md"
          circle
        >
          <Avatar
            :iconURI="profile?.avatar || ''"
            :address="account"
            :size="40"
          />
        </BalBtn>

        <span
          v-if="profile && profile.ens"
          class="hidden lg:inline-block pl-2"
          v-text="profile && profile.ens"
        />
        <span
          v-else
          class="hidden lg:inline-block pl-2 eth-address"
          v-text="shorten(account, 4, 4)"
        />
      </div>
    </template>
    <AppNavSettings />
  </BalPopover>
</template>


