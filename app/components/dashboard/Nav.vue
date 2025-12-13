<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  UserCog,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Calendar,
} from 'lucide-vue-next'

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/assessments', label: 'Assessments', icon: ClipboardList },
  { href: '/dashboard/class', label: 'Class Management', icon: Calendar },
  { href: '/dashboard/consultants', label: 'Consultants', icon: UserCog },
  { href: '/dashboard/students', label: 'Students', icon: Users },
]

const router = useRouter()
const mobileOpen = ref(false)

// Mock user - replace with actual auth composable
const user = ref({
  name: 'Admin',
  email: 'admin@university.edu',
})

const handleLogout = () => {
  // Replace with actual logout logic
  console.log('Logging out...')
  router.push('/login')
}
</script>

<template>
  <div>
    <!-- Mobile header -->
    <div class="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
      <div class="flex items-center gap-2">
        <GraduationCap class="h-6 w-6 text-primary" />
        <span class="font-semibold">FairGrade</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        @click="mobileOpen = !mobileOpen"
      >
        <X v-if="mobileOpen" class="h-5 w-5" />
        <Menu v-else class="h-5 w-5" />
      </Button>
    </div>

    <!-- Mobile nav overlay -->
    <div
      v-if="mobileOpen"
      class="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      @click="mobileOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform lg:translate-x-0',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )"
    >
      <div class="flex flex-col h-full">
        <div class="p-6 border-b border-sidebar-border">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-sidebar-primary/10 rounded-lg">
              <GraduationCap class="h-6 w-6 text-sidebar-primary" />
            </div>
            <div>
              <h2 class="font-semibold text-sidebar-foreground">
                FairGrade
              </h2>
              <p class="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.href"
            :to="item.href"
            :class="cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
            )"
            active-class="bg-sidebar-accent text-sidebar-accent-foreground"
            @click="mobileOpen = false"
          >
            <component :is="item.icon" class="h-5 w-5" />
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div class="p-4 border-t border-sidebar-border">
          <div class="flex items-center gap-3 px-3 py-2 mb-3">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-sm font-medium text-primary">
                {{ user?.name?.charAt(0) || 'A' }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-sidebar-foreground truncate">
                {{ user?.name || 'Admin' }}
              </p>
              <p class="text-xs text-muted-foreground truncate">
                {{ user?.email }}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            class="w-full justify-start text-muted-foreground hover:text-destructive"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  </div>
</template>