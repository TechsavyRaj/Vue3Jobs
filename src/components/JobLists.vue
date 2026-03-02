<script setup>
import JobList from "@/components/JobList.vue";
import {RouterLink} from "vue-router";
import {onMounted, reactive} from "vue";
import api from "@/services/api";
import { PulseLoader } from 'vue3-spinner';

const state = reactive({
  jobs: [],
  isLoading : true
});

onMounted(async () => {
  try{
    const response = await api.get('/api/jobs');
    state.jobs = response.data;
  } catch (error) {
    console.error('Error fetching jobs.', error);
  } finally {
    state.isLoading = false;
  }
})

defineProps({
  limit: Number,
  showJobs: {
    type: Boolean,
    default: false
  },
})
</script>

<template>
  <section class="bg-green-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Browse Jobs
      </h2>
      <!-- Spinner-->
      <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
        <PulseLoader/>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <JobList v-for="job in state.jobs.slice(0, limit || state.jobs.length)" :key="job.id" :job="job"
                 class="bg-white rounded-xl shadow-md relative"/>
      </div>
    </div>
  </section>
  <section v-if="showJobs" class="m-auto max-w-lg my-10 px-6">
    <RouterLink to="/jobs" class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700">
      View All Jobs
    </RouterLink>
  </section>
</template>