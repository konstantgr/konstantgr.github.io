<template>
  <section class="rounded-xl border border-border bg-muted/40 p-6 md:p-8">
    <h2 class="text-xl font-semibold tracking-tight m-0">Get in touch</h2>
    <p class="mt-2 mb-5 text-muted-foreground">
      Questions, corrections, or ideas about this post? I'd like to hear them.
    </p>
    <div class="flex flex-wrap gap-3">
      <a v-if="profile.email" :href="`mailto:${profile.email}`" class="contact-btn">
        <i class="fas fa-envelope"></i> Email
      </a>
      <a :href="profile.social.linkedin" target="_blank" rel="noopener" class="contact-btn">
        <i class="fab fa-linkedin"></i> LinkedIn
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import profile from '@/data/profile.json'
</script>

<style scoped>
.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid hsl(var(--border));
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s;
}
.contact-btn:hover {
  border-color: hsl(var(--foreground));
  transform: translateY(-1px);
}
</style>
