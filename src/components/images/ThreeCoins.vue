<script lang="ts" setup>
import leftIcon from '@/assets/images/landing/gray_icon_left.png';
import middleIcon from '@/assets/images/landing/green_icon_middle.png';
import rightIcon from '@/assets/images/landing/gray_icon_right.png';
</script><template>
  <div class="flex flex-row justify-center mt-5">
    <BalImage
      class="graphic"
      width="114"
      height="87"
      :src="leftIcon"
      alt="Information Icon"
    />
    <BalImage
      class="mx-5 graphic"
      width="114"
      height="87"
      :src="middleIcon"
      alt="Information Icon"
    />
    <BalImage
      class="graphic"
      width="114"
      height="87"
      :src="rightIcon"
      alt="Information Icon"
    />
  </div>
</template>