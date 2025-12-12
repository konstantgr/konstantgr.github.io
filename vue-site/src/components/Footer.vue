<template>
  <footer class="border-t border-border bg-background transition-colors duration-300">
    <div class="container max-w-[1100px] mx-auto px-5 py-8">
      <div class="flex flex-col items-center gap-4">
        <p class="text-sm font-medium leading-none m-0">{{ profile.name }}</p>
        <p class="text-sm text-muted-foreground">{{ profile.location }}</p>
        
        <ul class="list-none p-0 m-0 flex items-center gap-4">
          <li>
            <a 
              :href="profile.social.linkedin" 
              target="_blank" 
              class="text-muted-foreground hover:text-foreground transition-colors no-underline"
              aria-label="LinkedIn"
            >
              <i class="fab fa-linkedin text-xl"></i>
            </a>
          </li>
          <li>
            <a 
              :href="profile.social.scholar" 
              target="_blank" 
              class="text-muted-foreground hover:text-foreground transition-colors no-underline"
              aria-label="Google Scholar"
            >
              <i class="fab fa-google-scholar text-xl"></i>
            </a>
          </li>
          <li>
            <a 
              :href="profile.social.github" 
              target="_blank" 
              class="text-muted-foreground hover:text-foreground transition-colors no-underline"
              aria-label="GitHub"
            >
              <i class="fab fa-github text-xl"></i>
            </a>
          </li>
        </ul>
        
        <p class="text-sm text-muted-foreground mt-2">opinions are my own</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import profileData from '@/data/profile.json'

const profile = profileData
</script>

