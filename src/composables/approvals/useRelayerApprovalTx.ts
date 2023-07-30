import { Vault__factory } from '@balancer-labs/typechain';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import { computed, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { configService } from '@/services/config/config.service';
import useWeb3 from '@/services/web3/useWeb3';
import { TransactionActionInfo } from '@/types/transactions';

import useRelayerApprovalQuery from '../queries/useRelayerApprovalQuery';
import useEthers from '../useEthers';
import useTransactions from '../useTransactions';
import { TransactionBuilder } from '@/services/web3/transactions/transaction.builder';
import { relayerAddressMap, RelayerType } from './useRelayerApproval';

const vaultAddress = configService.network.addresses.vault;

export default function useRelayerApprovalTx(
  relayer: RelayerType,
  isEnabled: Ref<boolean> = ref(true)
) {
  /**
   * STATE
   */
  const init = ref(false);
  const approving = ref(false);
  const approved = ref(false);

  /**
   * COMPOSABLES
   */
  const { getSigner, account } = useWeb3();
  const relayerAddress = ref(relayerAddressMap[relayer]);
  const { txListener } = useEthers();
  const { addTransaction } = useTransactions();
  const { t } = useI18n();
  const relayerApproval = useRelayerApprovalQuery(relayerAddress);

  /**
   * COMPUTED
   */
  const isUnlocked = computed(
    () =>
      approved.value || (isEnabled.value ? !!relayerApproval.data.value : true)
  );

  const loading = computed(
    (): boolean =>
      relayerApproval.isLoading.value || relayerApproval.isError.value
  );

  const action = computed(
    (): TransactionActionInfo => ({
      label: t('transactionSummary.approveRelayer', [relayer]),
      loadingLabel: t('actionSteps.approve.loadingLabel'),
      confirmingLabel: t('confirming'),
      stepTooltip: t('approveRelayerTooltip'),
      action: approve,
    })
  );

  /**
   * METHODS
   */
  async function approve(): Promise<TransactionResponse> {
    try {
      init.value = true;

      const txBuilder = new TransactionBuilder(getSigner());
      const tx = await txBuilder.contract.sendTransaction({
        contractAddress: configService.network.addresses.vault,
        abi: Vault__factory.abi,
        action: 'setRelayerApproval',
        params: [account.value, relayerAddress.value, true],
      });

      init.value = false;
      approving.value = true;

      handleTransaction(tx);
      return tx;
    } catch (e) {
      console.log(e);
      init.value = false;
      approving.value = false;
      return Promise.reject(e);
    }
  }

  async function handleTransaction(tx): Promise<void> {
    addTransaction({
      id: tx.hash,
      type: 'tx',
      action: 'approve',
      summary: t('transactionSummary.approveRelayer', [relayer]),
      details: {
        contractAddress: vaultAddress,
        spender: relayerAddress.value,
      },
    });

    approved.value = await txListener(tx, {
      onTxConfirmed: async () => {
        approving.value = false;
        relayerApproval.refetch();
      },
      onTxFailed: () => {
        approving.value = false;
      },
    });
  }

  return {
    action,
    init,
    approve,
    approving,
    approved,
    isUnlocked,
    loading,
  };
}
