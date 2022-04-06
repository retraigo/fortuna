<template>
  <div
    v-if="isOn"
    class="inset-0 w-full fixed h-full z-50 block"
  >
    <div class="hidden rotate-[360deg] -rotate-[360-deg]" />
    <div class="inset-0 w-full fixed h-full z-70 block bg-gray-800/80 blur-xl" />
    <div class="flex flex-col items-center justify-center relative w-full h-full">
      <div class="absolute z-90 w-48 h-48 bg-nett-maid/40 rounded-full animate-ping transition duration-500 ease-in-out transform" />
      <img
        src="/icon.webp"
        :class="`block absolute z-100 w-48 h-48 transition duration-[2000ms] ease-in-out transform ${reverse ? '-' : ''}rotate-[360deg]`"
        alt="Loading..."
      />
    </div>
  </div>
  <div v-else />
</template>
<script>
export default {
  data() {
    return {
      isOn: false,
      reverse: false,
    };
  },
  methods: {
    start() {
      this.isOn = true;
    },
    finish() {
      this.isOn = false;
    },
    updateStage() {
      this.reverse = !this.reverse;
    },
  },
  mounted() {
    setInterval(() => {
      this.updateStage();
    }, 3000);
  },
};
</script>