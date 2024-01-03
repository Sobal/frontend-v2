import debounce from 'lodash/debounce';
import { captureException } from '@sentry/browser';
import { ScopeContext } from '@sentry/types/types/scope';
import { useI18n } from 'vue-i18n';
import { TransactionError } from '@/types/transactions';
import { TransactionAction } from '@/composables/useTransactions';
import { UseQueryReturnType } from '@tanstack/vue-query';
import { WalletError, WalletErrorMetadata } from '@/types';
import { configService } from '@/services/config/config.service';

interface Params {
  error: Error | unknown;
  action?: TransactionAction | 'unknown';
  msgPrefix?: string;
  context?: Partial<ScopeContext>;
  query?: UseQueryReturnType<any, any>;
}

type ErrorTags = { [key: string]: string };

export const captureBalancerException = debounce(
  _captureBalancerException,
  1000
);

function _captureBalancerException({
  error,
  action = 'unknown',
  msgPrefix = '',
  context = {},
  query,
}: Params): void {
  if (!shouldCaptureError(error, query)) return;
  console.error(error);

  const balError = getBalError(error);
  const message = formatErrorMsgForSentry(error, balError, msgPrefix);
  const metadata = (error as WalletError).metadata || {};
  const tags = getTags(action, context, balError, metadata);
  const originalError = getOriginalError(error);

  const _error = constructError(message, action, error);
  captureException(_error, {
    ...context,
    extra: {
      ...context?.extra,
      ...metadata,
      balError,
      originalError,
    },
    tags,
  });
}

function formatErrorMsgForSentry(
  error,
  balError: string | null,
  msgPrefix: string
): string {
  let msg = '';
  if (typeof error.reason === 'string') {
    msg = error.reason;
  } else if (typeof error.message === 'string') {
    msg = error.message;
  } else if (typeof error.case === 'string') {
    msg = error.case;
  } else if (typeof error.cause.message === 'string') {
    msg = error.cause.message;
  } else if (typeof error === 'string') {
    msg = error;
  } else {
    msg = 'Unable to extract error message';
  }

  const balErrorStr = balError ? `BAL#${balError}` : '';

  return `${msgPrefix} ${balErrorStr} ${msg}`;
}

/**
 * Checks for BAL error code in reason and returns it if found.
 */
function getBalError(error): string | null {
  const reason: string =
    (error as { reason?: string }).reason || 'no reason available';
  const balError = reason.match(/BAL#[0-9]{3}/g);

  return balError && balError[0] ? balError[0].slice(-3) : null;
}

/**
 * Try to find the original error.
 */
function getOriginalError(error: Error | unknown): Error | undefined {
  if ((error as WalletError).data?.originalError) {
    return (error as WalletError).data?.originalError as Error;
  } else if ((error as Error).cause instanceof Error) {
    return (error as Error).cause as Error;
  }

  return undefined;
}

/**
 * Extract tags for Sentry from error.
 */
function getTags(
  action: TransactionAction | 'unknown',
  context: Partial<ScopeContext>,
  balError: string | null,
  metadata: WalletErrorMetadata
): ErrorTags {
  const tags: { [key: string]: string } = {
    ...context?.tags,
    action,
  };

  if (balError) {
    tags.balError = balError;
  }

  if (metadata?.chainId) {
    tags.chainId = `${metadata.chainId}`;
  }

  if (metadata.action) {
    tags.action = metadata.action;
  }

  return tags;
}

class SentryError extends Error {
  constructor(name: string, message: string, cause: Error | unknown) {
    super(message);

    if (cause instanceof Error && cause.stack) {
      this.stack = cause.stack;
    }

    this.name = name;
    this.cause = cause;
  }
}

function constructError(
  message: string,
  action: TransactionAction | 'unknown',
  originalError: Error | unknown
) {
  switch (action) {
    case 'swap':
      return new SentryError('BatchSwapError', message, originalError);
    case 'invest':
      return new SentryError('JoinPoolError', message, originalError);
    case 'withdraw':
      return new SentryError('ExitPoolError', message, originalError);
    case 'createPool':
      return new SentryError('CreatePoolError', message, originalError);
    case 'userGaugeCheckpoint':
      return new SentryError('CheckpointGaugeError', message, originalError);
    case 'sync':
      return new SentryError('VebalSyncError', message, originalError);
    case 'extendLock':
      return new SentryError('ExtendLockError', message, originalError);
    case 'unlock':
      return new SentryError('UnlockError', message, originalError);
    case 'stake':
      return new SentryError('StakeError', message, originalError);
    case 'unstake':
      return new SentryError('UnstakeError', message, originalError);
    default:
      return new SentryError('Error', message, originalError);
  }
}

/**
 * Checks if error has any metadata that matches given set of RegExps.
 *
 * @param {Error} error Error to check
 * @param {RegExp[]} messages Array of RegExps to match against error metadata
 */
function isErrorOfType(error: any, messages: RegExp[]): boolean {
  if (!error) return false;

  if (
    typeof error === 'string' &&
    messages.some(msg => msg.test(error.toLowerCase()))
  )
    return true;

  if (
    error.message &&
    messages.some(msg => msg.test(error.message.toLowerCase()))
  )
    return true;

  if (
    typeof error.reason === 'string' &&
    messages.some(
      msg => msg.test(error.reason) || msg.test(error.reason.toLowerCase())
    )
  )
    return true;

  if (
    error.cause?.message &&
    messages.some(msg => msg.test(error.cause.message.toLowerCase()))
  )
    return true;

  if (
    typeof error.cause === 'string' &&
    messages.some(msg => msg.test(error.cause.toLowerCase()))
  )
    return true;

  if (error.b && messages.some(msg => msg.test(error.b.toLowerCase())))
    return true;

  if (error?.code && error.code === 4001) {
    return true;
  }

  if (error.cause?.code && error.cause?.code === 4001) {
    return true;
  }

  if (error.cause instanceof Error) return isUserRejected(error.cause);

  return false;
}

/**
 * Checks if error is caused by user rejecting/canceling the transaction.
 */
function isUserRejected(error): boolean {
  const messages = [
    /rejected/,
    /user rejected transaction/,
    /request rejected/,
    /user rejected methods./,
    /user rejected the transaction/,
    /user rejected the request/,
    /rejected by user/,
    /user canceled/,
    /cancelled by user/,
    /transaction declined/,
    /transaction was rejected/,
    /user denied transaction signature/,
    /user disapproved requested methods/,
    /canceled/,
    /cancelled/,
    /user rejected signing/,
    /user cancelled/,
    /no matching key/,
  ];

  return isErrorOfType(error, messages);
}

/**
 * Checks if error is caused by user not having enough gas or setting gas too low.
 */
function isUserNotEnoughGas(error): boolean {
  const messages = [
    /insufficient funds for gas/,
    /the signed fee is insufficient/,
    /EffectivePriorityFeePerGas too low/i,
    /Комиссия за газ обновлена/i,
    /insufficient eth to pay the network fees/,
    /insufficient funds for intrinsic transaction cost/,
  ];

  return isErrorOfType(error, messages);
}

/**
 * Checks if error is caused by user's wallet having bad config / state
 */
function isWalletConfigError(error): boolean {
  const messages = [/invalid rpc url/, /nonce has already been used/];

  return isErrorOfType(error, messages);
}

/**
 * Checks if error is a testnet faucet refill error.
 */
function isFaucetRefillError(error): boolean {
  const messages = [
    /execution reverted: ERR_NEEDS_REFILL/i,
    /execution reverted: ERR_DRIP_THROTTLE/i,
  ];
  return isErrorOfType(error, messages);
}

/**
 * Checks if error is a bot associated error.
 */
function isBotError(error): boolean {
  const messages = [/ResourceExhausted/i];

  return isErrorOfType(error, messages);
}

/**
 * Checks if error is caused by the user or the state of their wallet.
 */
export function isUserError(error): boolean {
  return (
    isUserRejected(error) ||
    isUserNotEnoughGas(error) ||
    isWalletConfigError(error)
  );
}

/**
 * Checks if query has already failed, if more than once, we will ignore the error.
 */
export function shouldCaptureQueryError(
  query: UseQueryReturnType<any, any> | undefined
): boolean {
  if (!query) return true;
  return query.failureCount.value <= 1;
}

/**
 * Checks if error is an error we want to send to Sentry.
 */
export function shouldCaptureError(
  error,
  query: UseQueryReturnType<any, any> | undefined
): boolean {
  return (
    !configService.isDevEnv &&
    !isUserError(error) &&
    !isFaucetRefillError(error) &&
    !isBotError(error) &&
    shouldCaptureQueryError(query)
  );
}

/**
 * Composable for formatting error messages.
 */
export function useErrorMsg() {
  const { t } = useI18n();

  const gasTooLowError: TransactionError = {
    title: t('transactionErrors.gasTooLow.title'),
    description: t('transactionErrors.gasTooLow.description'),
  };

  const cannotEstimateGasError: TransactionError = {
    title: t('transactionErrors.cannotEstGas.title'),
    description: t('transactionErrors.cannotEstGas.description'),
  };

  const slippageError: TransactionError = {
    title: t('transactionErrors.slippage.title'),
    description: t('transactionErrors.slippage.description'),
  };

  function defaultError(message = ''): TransactionError {
    return {
      title: t('transactionErrors.default.title'),
      description: message.trim(),
    };
  }

  function formatErrorMsg(error): TransactionError | null {
    // if (isUserError(error)) return null;
    if (isErrorOfType(error, [/-32010/])) return gasTooLowError;
    if (isErrorOfType(error, [/BAL#507/i])) return slippageError;
    if (isErrorOfType(error, [/BAL#505/i])) return slippageError;
    if (isErrorOfType(error, [/UNPREDICTABLE_GAS_LIMIT/i]))
      return cannotEstimateGasError;

    return defaultError(
      typeof error === 'string' ? error : error.message ?? ''
    );
  }

  return {
    formatErrorMsg,
  };
}
