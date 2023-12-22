import { computed, onMounted, onUnmounted, ref } from 'vue';

export default function useBreakpoints() {
  const windowWidth = ref(window.innerWidth);

  const onWidthChange = () => (windowWidth.value = window.innerWidth);
  onMounted(() => window.addEventListener('resize', onWidthChange));
  onUnmounted(() => window.removeEventListener('resize', onWidthChange));

  const bp = computed(() => {
    // TODO - Variable Breakpoints for Safari and Chrome which are different PX
    if (windowWidth.value < 440) return 'xs';
    if (windowWidth.value < 640) return 'sm';
    if (windowWidth.value < 748) return 'md';
    if (windowWidth.value < 1024) return 'lg';
    if (windowWidth.value < 1280) return 'xl';
    if (windowWidth.value < 2048) return '2xl';
    return '3xl';
  });

  const width = computed(() => windowWidth.value);

  const upToLargeBreakpoint = computed(() =>
    ['xs', 'sm', 'md', 'lg'].includes(bp.value)
  );

  const upToMediumBreakpoint = computed(() =>
    ['xs', 'sm', 'md'].includes(bp.value)
  );

  const isMobile = computed(() => ['xs', 'sm', 'md', 'lg'].includes(bp.value));
  const isDesktop = computed(() =>
    ['xl', '2xl', '3xl', '4xl'].includes(bp.value)
  );

  const upToSmallBreakpoint = computed(() => ['xs', 'sm'].includes(bp.value));

  return {
    width,
    bp,
    isMobile,
    isDesktop,
    upToLargeBreakpoint,
    upToMediumBreakpoint,
    upToSmallBreakpoint,
  };
}
