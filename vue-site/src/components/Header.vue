<template>
  <header class="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border transition-colors duration-300">
    <div class="container max-w-[1100px] mx-auto px-5 py-2 sm:py-4">
      <div class="flex flex-wrap sm:flex-nowrap justify-between items-center gap-x-4 gap-y-1">
        <div id="branding">
          <h1 class="scroll-m-20 text-xl font-semibold tracking-tight whitespace-nowrap">
            <router-link 
              to="/" 
              class="text-foreground no-underline hover:text-muted-foreground transition-colors"
            >
              Konstantin Grotov
            </router-link>
          </h1>
        </div>
        
        <ThemeToggle class="sm:order-3" />

        <div class="order-last w-full sm:order-2 sm:w-auto sm:ml-auto">
          <NavigationMenu class="max-w-full sm:max-w-max">
            <NavigationMenuList class="w-full justify-between sm:w-auto sm:justify-center">
              <NavigationMenuItem>
                <NavigationMenuLink as-child :active="$route.path === '/'">
                  <router-link to="/">
                    Home
                  </router-link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink as-child :active="$route.path.startsWith('/blog')">
                  <router-link to="/blog">
                    Blog
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

