<template>
</template>
<script setup>
definePageMeta({
  middleware: (to) => {
    return navigateTo("/login");
  },
});
</script>