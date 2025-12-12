<template>
  <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border transition-colors duration-300">
    <div class="container max-w-[1100px] mx-auto px-5 py-4">
      <div class="flex justify-between items-center">
        <div id="branding">
          <h1 class="scroll-m-20 text-xl font-semibold tracking-tight">
            <router-link 
              to="/" 
              class="text-foreground no-underline hover:text-muted-foreground transition-colors"
            >
              Konstantin Grotov
            </router-link>
          </h1>
        </div>
        
        <div class="flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink as-child :active="$route.path === '/'">
                  <router-link to="/">
                    Home
                  </router-link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink as-child :active="$route.path === '/experience'">
                  <router-link to="/experience">
                    Experience
                  </router-link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink as-child :active="$route.path === '/research'">
                  <router-link to="/research">
                    Research
                  </router-link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
import NavigationMenu from './ui/NavigationMenu.vue'
import NavigationMenuList from './ui/NavigationMenuList.vue'
import NavigationMenuItem from './ui/NavigationMenuItem.vue'
import NavigationMenuLink from './ui/NavigationMenuLink.vue'
</script>

<style scoped>
@media screen and (max-width: 768px) and (orientation: portrait) {
  nav ul {
    gap: 1rem;
  }
  
  nav a {
    font-size: 0.875rem;
  }
}
</style>

