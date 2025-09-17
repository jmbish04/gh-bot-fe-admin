import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  GitBranch, 
  Command, 
  BookOpen, 
  Play, 
  Pause, 
  RefreshCw,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  Shield,
  Code,
  Star,
  Users,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
// import { useDashboardData, useResearchStatus, useStartResearch, useStopResearch, useStats, useOperations } from '@/hooks/useGitHubBotAPI';
import { useNotifications } from '@/lib/stores/app-store';
import { formatDistanceToNow } from 'date-fns';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  status 
}) => {
  const statusColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${status ? statusColors[status] : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp 
              className={`h-3 w-3 mr-1 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`} 
            />
            <span className={`text-xs ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = 'default',
  disabled = false,
  loading = false,
}) => {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled || loading}
      className="h-auto p-4 flex flex-col items-start space-y-2"
    >
      <div className="flex items-center space-x-2">
        <Icon className="h-4 w-4" />
        <span className="font-medium">{title}</span>
        {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
      </div>
      <p className="text-xs text-left opacity-80">{description}</p>
    </Button>
  );
};

interface RecentActivityProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: number;
    status?: 'success' | 'warning' | 'error' | 'info';
  }>;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ title, items }) => {
  const statusIcons = {
    success: CheckCircle,
    warning: AlertCircle,
    error: AlertCircle,
    info: Clock,
  };

  const statusColors = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
    info: 'text-blue-600',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Latest activity across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            items.map((item) => {
              const StatusIcon = item.status ? statusIcons[item.status] : Clock;
              return (
                <div key={item.id} className="flex items-start space-x-3">
                  <StatusIcon 
                    className={`h-4 w-4 mt-0.5 ${
                      item.status ? statusColors[item.status] : 'text-muted-foreground'
                    }`} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  // Mock data for now to avoid QueryClient issues
  const dashboardData = {
    totalRepositories: 42,
    activeOperations: 8,
    completedCommands: 156,
    pendingBestPractices: 12,
    recentActivity: [
      { id: '1', type: 'research', message: 'Repository analysis completed', timestamp: new Date() },
      { id: '2', type: 'command', message: 'Code quality check finished', timestamp: new Date() },
      { id: '3', type: 'operation', message: 'Best practice validation started', timestamp: new Date() },
    ]
  };
  const researchStatus = { isRunning: false, progress: 0 };
  const statsData = {
    totalRepositories: 42,
    activeOperations: 8,
    completedCommands: 156,
    pendingBestPractices: 12,
    successRate: 94.5,
    averageProcessingTime: 2.3
  };
  const operationsData = {
    operations: [
      { id: '1', name: 'Repository Analysis', status: 'running', progress: 75, startTime: new Date() },
      { id: '2', name: 'Code Quality Check', status: 'completed', progress: 100, startTime: new Date() },
      { id: '3', name: 'Best Practice Validation', status: 'pending', progress: 0, startTime: new Date() },
    ]
  };
  const isLoading = false;
  const error = null;
  const startResearch = () => Promise.resolve();
  const stopResearch = () => Promise.resolve();
  const { addNotification } = useNotifications();

  const handleStartResearch = async () => {
    try {
      await startResearch();
      addNotification({
        type: 'success',
        title: 'Research Started',
        message: 'Repository research has been initiated successfully.',
        read: false
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Research Failed',
        message: 'Failed to start repository research.',
        read: false
      });
    }
  };

  const handleStopResearch = async () => {
    try {
      await stopResearch();
      addNotification({
        type: 'success',
        title: 'Research Stopped',
        message: 'Repository research has been stopped.',
        read: false
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Stop Failed',
        message: 'Failed to stop repository research.',
        read: false
      });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-500">Failed to load dashboard data</span>
      </div>
    );
  }

  const stats = statsData || dashboardData?.stats;
  const operations = operationsData?.operations || dashboardData?.operations || [];
  const recentCommands = dashboardData?.recentCommands || [];
  const recentPractices = dashboardData?.recentPractices || [];

  const activeOperations = operations.filter(op => op.status === 'running').length;
  const isResearchRunning = researchStatus?.status === 'running';

  // Calculate additional metrics
  const completedOperations = operations.filter(op => op.status === 'completed').length;
  const failedOperations = operations.filter(op => op.status === 'failed').length;
  const systemHealth = activeOperations > 0 ? 'healthy' : 'degraded';

  // Chart data
  const operationTrendData = [
    { name: 'Mon', operations: 12, success: 11, failed: 1 },
    { name: 'Tue', operations: 19, success: 18, failed: 1 },
    { name: 'Wed', operations: 15, success: 14, failed: 1 },
    { name: 'Thu', operations: 22, success: 21, failed: 1 },
    { name: 'Fri', operations: 18, success: 17, failed: 1 },
    { name: 'Sat', operations: 8, success: 8, failed: 0 },
    { name: 'Sun', operations: 6, success: 6, failed: 0 },
  ];

  const commandDistributionData = [
    { name: 'Completed', value: stats?.commands ? Math.floor(stats.commands * 0.85) : 85, color: '#10b981' },
    { name: 'Running', value: activeOperations, color: '#3b82f6' },
    { name: 'Failed', value: failedOperations, color: '#ef4444' },
    { name: 'Pending', value: stats?.commands ? Math.floor(stats.commands * 0.1) : 10, color: '#f59e0b' },
  ];

  const repositoryAnalysisData = [
    { name: 'Jan', repositories: 45, analyzed: 42 },
    { name: 'Feb', repositories: 52, analyzed: 48 },
    { name: 'Mar', repositories: 48, analyzed: 45 },
    { name: 'Apr', repositories: 61, analyzed: 58 },
    { name: 'May', repositories: 55, analyzed: 52 },
    { name: 'Jun', repositories: 67, analyzed: 63 },
  ];

  const performanceMetrics = [
    { name: 'Response Time', value: 2.3, unit: 's', color: '#3b82f6' },
    { name: 'Success Rate', value: 98.5, unit: '%', color: '#10b981' },
    { name: 'Uptime', value: 99.9, unit: '%', color: '#8b5cf6' },
    { name: 'Throughput', value: 150, unit: '/min', color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">GitHub Bot Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your GitHub workflow automation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={systemHealth === 'healthy' ? 'default' : 'secondary'}>
            {systemHealth === 'healthy' ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                System Healthy
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                System Degraded
              </>
            )}
          </Badge>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Repositories"
              value={stats?.repositories || 0}
              description="Analyzed repositories"
              icon={Database}
              status={stats?.repositories ? 'success' : 'info'}
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Active Operations"
              value={activeOperations}
              description="Currently running"
              icon={Activity}
              status={activeOperations > 0 ? 'warning' : 'info'}
            />
            <StatCard
              title="Completed Commands"
              value={stats?.commands || 0}
              description="Total executed"
              icon={Command}
              status={stats?.commands ? 'success' : 'info'}
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Best Practices"
              value={stats?.practices || 0}
              description="Available practices"
              icon={BookOpen}
              status={stats?.practices ? 'success' : 'info'}
            />
          </div>

          {/* Additional Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Completed Operations"
              value={completedOperations}
              description="Successfully finished"
              icon={CheckCircle}
              status="success"
            />
            <StatCard
              title="Failed Operations"
              value={failedOperations}
              description="Require attention"
              icon={AlertCircle}
              status={failedOperations > 0 ? 'error' : 'info'}
            />
            <StatCard
              title="Analyses"
              value={stats?.analyses || 0}
              description="AI analyses performed"
              icon={BarChart3}
              status="info"
            />
            <StatCard
              title="System Uptime"
              value="99.9%"
              description="Last 30 days"
              icon={Zap}
              status="success"
            />
          </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common operations and controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <QuickAction
              title="Start Research"
              description="Begin repository analysis sweep"
              icon={Play}
              onClick={handleStartResearch}
              disabled={isResearchRunning}
              loading={startResearch.isPending}
            />
            <QuickAction
              title="Stop Research"
              description="Halt current research operation"
              icon={Pause}
              onClick={handleStopResearch}
              disabled={!isResearchRunning}
              loading={stopResearch.isPending}
              variant="destructive"
            />
            <QuickAction
              title="View Commands"
              description="Browse command history"
              icon={Command}
              onClick={() => window.location.href = '/admin/commands'}
            />
            <QuickAction
              title="Manage Practices"
              description="Review best practices"
              icon={BookOpen}
              onClick={() => window.location.href = '/admin/practices'}
            />
            <QuickAction
              title="Monitor Operations"
              description="View live operations"
              icon={Activity}
              onClick={() => window.location.href = '/admin/operations'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Research Status */}
      {researchStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <span>Research Status</span>
              <Badge variant={isResearchRunning ? 'default' : 'secondary'}>
                {researchStatus.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">
                  {researchStatus.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${researchStatus.progress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Operation:</span>
                  <p className="font-medium">{researchStatus.current_operation}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Repositories:</span>
                  <p className="font-medium">
                    {researchStatus.processed_repositories} / {researchStatus.total_repositories}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <RecentActivity
              title="Recent Commands"
              items={recentCommands.slice(0, 5).map(cmd => ({
                id: cmd.id,
                title: `${cmd.command} in ${cmd.repo}`,
                description: `Author: ${cmd.author}`,
                timestamp: cmd.createdAt,
                status: cmd.status === 'completed' ? 'success' : 
                       cmd.status === 'failed' ? 'error' : 'info',
              }))}
            />
            <RecentActivity
              title="Recent Practices"
              items={recentPractices.slice(0, 5).map(practice => ({
                id: practice.id,
                title: practice.title,
                description: practice.category,
                timestamp: practice.createdAt,
                status: practice.status === 'approved' ? 'success' : 
                       practice.status === 'rejected' ? 'error' : 'warning',
              }))}
            />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Operation Trends</span>
                </CardTitle>
                <CardDescription>Performance over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={operationTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="success" 
                        stackId="1" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.6}
                        name="Successful"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="failed" 
                        stackId="1" 
                        stroke="#ef4444" 
                        fill="#ef4444" 
                        fillOpacity={0.6}
                        name="Failed"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="h-5 w-5" />
                  <span>Command Distribution</span>
                </CardTitle>
                <CardDescription>Breakdown by status and type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={commandDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {commandDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5" />
                  <span>Repository Analysis Trends</span>
                </CardTitle>
                <CardDescription>Repository discovery and analysis over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={repositoryAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="repositories" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Total Repositories"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="analyzed" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Analyzed"
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Live Operations</span>
              </CardTitle>
              <CardDescription>Real-time operation monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              {operations.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No operations currently running</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {operations.slice(0, 5).map((operation) => (
                    <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" />
                        <div>
                          <p className="font-medium">{operation.type}</p>
                          <p className="text-sm text-muted-foreground">{operation.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{operation.status}</Badge>
                        <span className="text-sm text-muted-foreground">{operation.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {performanceMetrics.map((metric) => (
              <Card key={metric.name}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: metric.color }}
                    />
                    <span>{metric.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div 
                      className="text-3xl font-bold" 
                      style={{ color: metric.color }}
                    >
                      {metric.value}{metric.unit}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {metric.name === 'Response Time' && 'Average processing time'}
                      {metric.name === 'Success Rate' && 'Operation success rate'}
                      {metric.name === 'Uptime' && 'System availability'}
                      {metric.name === 'Throughput' && 'Operations per minute'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>System Performance</span>
                </CardTitle>
                <CardDescription>Key performance indicators over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={operationTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="operations" fill="#3b82f6" name="Total Operations" />
                      <Bar dataKey="success" fill="#10b981" name="Successful" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Resource Utilization</span>
                </CardTitle>
                <CardDescription>System resource usage patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">62%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <span className="text-sm text-muted-foreground">38%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '38%' }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Network</span>
                    <span className="text-sm text-muted-foreground">23%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '23%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>AI Analysis Insights</span>
              </CardTitle>
              <CardDescription>Key insights from AI-powered analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <p className="text-sm text-muted-foreground">Code Quality Score</p>
                  <p className="text-xs text-muted-foreground mt-1">Above average</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">156</div>
                  <p className="text-sm text-muted-foreground">Best Practices Found</p>
                  <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">23</div>
                  <p className="text-sm text-muted-foreground">Security Issues</p>
                  <p className="text-xs text-muted-foreground mt-1">-5 this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { Dashboard };
export default Dashboard;
