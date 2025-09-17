// Static Dashboard Component - No React hydration needed
export const StaticDashboard = () => {
  return `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p class="text-muted-foreground">
            Monitor and manage your GitHub Bot operations
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-cw h-4 w-4 mr-2" aria-hidden="true">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div class="tracking-tight text-sm font-medium">Total Repositories</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-branch h-4 w-4 text-muted-foreground" aria-hidden="true">
              <line x1="6" x2="6" y1="3" y2="15"></line>
              <circle cx="18" cy="6" r="3"></circle>
              <circle cx="6" cy="18" r="3"></circle>
              <path d="M18 9a9 9 0 0 1-9 9"></path>
            </svg>
          </div>
          <div class="p-6 pt-0">
            <div class="text-2xl font-bold">1,234</div>
            <p class="text-xs text-muted-foreground">+20.1% from last month</p>
          </div>
        </div>

        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div class="tracking-tight text-sm font-medium">Active Commands</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-command h-4 w-4 text-muted-foreground" aria-hidden="true">
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
            </svg>
          </div>
          <div class="p-6 pt-0">
            <div class="text-2xl font-bold">42</div>
            <p class="text-xs text-muted-foreground">+5 from last hour</p>
          </div>
        </div>

        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div class="tracking-tight text-sm font-medium">Research Status</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-open h-4 w-4 text-muted-foreground" aria-hidden="true">
              <path d="M12 7v14"></path>
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
            </svg>
          </div>
          <div class="p-6 pt-0">
            <div class="text-2xl font-bold">Active</div>
            <p class="text-xs text-muted-foreground">Analyzing 15 repositories</p>
          </div>
        </div>

        <div class="rounded-xl border bg-card text-card-foreground shadow">
          <div class="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div class="tracking-tight text-sm font-medium">Success Rate</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big h-4 w-4 text-muted-foreground" aria-hidden="true">
              <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
              <path d="m9 11 3 3L22 4"></path>
            </svg>
          </div>
          <div class="p-6 pt-0">
            <div class="text-2xl font-bold">98.5%</div>
            <p class="text-xs text-muted-foreground">+2.1% from last week</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="flex flex-col space-y-1.5 p-6">
          <div class="font-semibold leading-none tracking-tight">Quick Actions</div>
          <div class="text-sm text-muted-foreground">Common operations and controls</div>
        </div>
        <div class="p-6 pt-0">
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button class="gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2 h-20 flex flex-col items-center justify-center space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play h-6 w-6" aria-hidden="true">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
              <span>Start Research</span>
            </button>
            <button class="gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-20 flex flex-col items-center justify-center space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause h-6 w-6" aria-hidden="true">
                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              </svg>
              <span>Pause Research</span>
            </button>
            <button class="gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-20 flex flex-col items-center justify-center space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-command h-6 w-6" aria-hidden="true">
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
              </svg>
              <span>Run Command</span>
            </button>
            <button class="gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-4 py-2 h-20 flex flex-col items-center justify-center space-y-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-database h-6 w-6" aria-hidden="true">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
                <path d="M3 12A9 3 0 0 0 21 12"></path>
              </svg>
              <span>View Operations</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="rounded-xl border bg-card text-card-foreground shadow">
        <div class="flex flex-col space-y-1.5 p-6">
          <div class="font-semibold leading-none tracking-tight">Recent Activity</div>
          <div class="text-sm text-muted-foreground">Latest operations and updates</div>
        </div>
        <div class="p-6 pt-0">
          <div class="space-y-4">
            <div class="flex items-center space-x-4">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium">Research completed for repository</p>
                <p class="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
              <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">Completed</div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium">Command executed successfully</p>
                <p class="text-xs text-muted-foreground">5 minutes ago</p>
              </div>
              <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">Success</div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div class="flex-1 space-y-1">
                <p class="text-sm font-medium">Research started for 10 repositories</p>
                <p class="text-xs text-muted-foreground">10 minutes ago</p>
              </div>
              <div class="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">In Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};
