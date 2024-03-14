<template>

    <div>
    hhh
    {{route.params.id }}
    <slot />
    </div>
    
    </template>
    
    <script setup>
    
    // import {useRoute} from 'vue-router'
    
    
	
		const route = useRoute()
        console.log("1111111111111");
    	// console.log(route.params.id)
	
    </script>

<style lang="ts" scoped>

</style>