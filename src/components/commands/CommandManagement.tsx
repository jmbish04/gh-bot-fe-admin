import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Command, 
  Search, 
  Filter, 
  RefreshCw, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Calendar,
  User,
  GitBranch,
  Code,
  Eye,
  Download,
  SortAsc,
  SortDesc,
  MoreHorizontal
} from 'lucide-react';
import { useColbyCommands, useColbyCommand } from '@/hooks/useGitHubBotAPI';
import { useFilters, useHydration } from '@/lib/stores/app-store';
import type { ColbyCommand, CommandFilters } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';

interface CommandCardProps {
  command: ColbyCommand;
  onViewDetails: (command: ColbyCommand) => void;
}

const CommandCard: React.FC<CommandCardProps> = ({ command, onViewDetails }) => {
  const getStatusColor = (status: ColbyCommand['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'working':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'queued':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: ColbyCommand['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'working':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'queued':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: ColbyCommand['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'working':
        return 'Working';
      case 'queued':
        return 'Queued';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{command.command}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <GitBranch className="h-4 w-4" />
              <span className="truncate">{command.repo}</span>
              <span>•</span>
              <User className="h-4 w-4" />
              <span>{command.author}</span>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(command.status)} font-medium`}>
              {getStatusIcon(command.status)}
              <span className="ml-1">{getStatusLabel(command.status)}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Created</span>
            <span>{formatDistanceToNow(new Date(command.createdAt), { addSuffix: true })}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(command)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface CommandDetailsProps {
  command: ColbyCommand | null;
  onClose: () => void;
}

const CommandDetails: React.FC<CommandDetailsProps> = ({ command, onClose }) => {
  if (!command) return null;

  const getStatusColor = (status: ColbyCommand['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'working':
        return 'text-blue-600';
      case 'queued':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: ColbyCommand['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'failed':
        return <XCircle className="h-5 w-5" />;
      case 'working':
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      case 'queued':
        return <Clock className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center space-x-2">
                {getStatusIcon(command.status)}
                <span>Command Details</span>
              </CardTitle>
              <CardDescription className="mt-1">
                {command.command}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Repository</Label>
              <p className="text-sm font-medium">{command.repo}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Author</Label>
              <p className="text-sm font-medium">{command.author}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <p className={`text-sm font-medium ${getStatusColor(command.status)}`}>
                {command.status.charAt(0).toUpperCase() + command.status.slice(1)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(command.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Command</Label>
            <div className="mt-1 p-3 bg-muted rounded-md">
              <code className="text-sm font-mono">{command.command}</code>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button asChild>
              <a 
                href={`https://github.com/${command.repo}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Repository
              </a>
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface FilterPanelProps {
  filters: CommandFilters;
  onFiltersChange: (filters: Partial<CommandFilters>) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onReset }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search commands..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="repo">Repository</Label>
          <Input
            id="repo"
            placeholder="owner/repo"
            value={filters.repo || ''}
            onChange={(e) => onFiltersChange({ repo: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            placeholder="username"
            value={filters.author || ''}
            onChange={(e) => onFiltersChange({ author: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) => onFiltersChange({ status: value as ColbyCommand['status'] || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="queued">Queued</SelectItem>
              <SelectItem value="working">Working</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="limit">Limit</Label>
          <Select
            value={filters.limit?.toString() || '50'}
            onValueChange={(value) => onFiltersChange({ limit: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 results</SelectItem>
              <SelectItem value="50">50 results</SelectItem>
              <SelectItem value="100">100 results</SelectItem>
              <SelectItem value="200">200 results</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={onReset} className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

const CommandManagementInner: React.FC = () => {
  const [selectedCommand, setSelectedCommand] = useState<ColbyCommand | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'status' | 'repo' | 'author'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTab, setSelectedTab] = useState('all');
  
  const { command: commandFilters, setFilters: setCommandFilters, reset: resetFilters } = useFilters();

  const { data: commandsData, isLoading, error, refetch } = useColbyCommands(commandFilters.filters);

  const handleFiltersChange = (newFilters: Partial<CommandFilters>) => {
    setCommandFilters({ ...commandFilters.filters, ...newFilters });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const sortedCommands = useMemo(() => {
    if (!commandsData?.commands) return [];

    const sorted = [...commandsData.commands].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'repo':
          comparison = a.repo.localeCompare(b.repo);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply search filter
    if (commandFilters.filters.search) {
      const searchTerm = commandFilters.filters.search.toLowerCase();
      return sorted.filter(cmd => 
        cmd.command.toLowerCase().includes(searchTerm) ||
        cmd.repo.toLowerCase().includes(searchTerm) ||
        cmd.author.toLowerCase().includes(searchTerm)
      );
    }

    return sorted;
  }, [commandsData?.commands, sortBy, sortOrder, commandFilters.filters.search]);

  const filteredCommands = useMemo(() => {
    let filtered = sortedCommands;

    // Apply tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(cmd => cmd.status === selectedTab);
    }

    return filtered;
  }, [sortedCommands, selectedTab]);

  const commandStats = useMemo(() => {
    if (!commandsData?.commands) return { total: 0, completed: 0, failed: 0, working: 0, queued: 0 };
    
    const commands = commandsData.commands;
    return {
      total: commands.length,
      completed: commands.filter(cmd => cmd.status === 'completed').length,
      failed: commands.filter(cmd => cmd.status === 'failed').length,
      working: commands.filter(cmd => cmd.status === 'working').length,
      queued: commands.filter(cmd => cmd.status === 'queued').length,
    };
  }, [commandsData?.commands]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading commands...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load commands</p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Command Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage GitHub bot command executions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commands</CardTitle>
            <Command className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commandStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{commandStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{commandStats.failed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{commandStats.working}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queued</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{commandStats.queued}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={commandFilters.filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Commands</CardTitle>
                  <CardDescription>
                    {filteredCommands.length} commands found
                    {commandsData && ` (${commandsData.commands.length} total)`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="status">Status</option>
                    <option value="repo">Repository</option>
                    <option value="author">Author</option>
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="queued">Queued</TabsTrigger>
                  <TabsTrigger value="working">Working</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                </TabsList>
                
                <TabsContent value={selectedTab} className="mt-4">
                  {filteredCommands.length === 0 ? (
                    <div className="text-center py-8">
                      <Command className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No commands found matching your criteria</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredCommands.map((command) => (
                        <CommandCard
                          key={command.id}
                          command={command}
                          onViewDetails={setSelectedCommand}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Command Details Modal */}
      <CommandDetails
        command={selectedCommand}
        onClose={() => setSelectedCommand(null)}
      />
    </div>
  );
};

const CommandManagement: React.FC = () => {
  const hasHydrated = useHydration();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until both hydration and mounting are complete
  if (!hasHydrated || !mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading commands...</p>
        </div>
      </div>
    );
  }

  return <CommandManagementInner />;
};

export { CommandManagement };
export default CommandManagement;