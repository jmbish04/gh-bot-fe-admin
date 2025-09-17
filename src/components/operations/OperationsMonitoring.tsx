import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Search, 
  Filter, 
  RefreshCw, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Calendar,
  User,
  Zap,
  Database,
  GitBranch,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  useOperations, 
  useOperation, 
  useCancelOperation 
} from '@/hooks/useGitHubBotAPI';
import { useNotifications, useHydration } from '@/lib/stores/app-store';
import type { Operation } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';

interface OperationCardProps {
  operation: Operation;
  onViewDetails: (operation: Operation) => void;
  onCancel: (id: string) => void;
}

const OperationCard: React.FC<OperationCardProps> = ({ 
  operation, 
  onViewDetails, 
  onCancel 
}) => {
  const getStatusColor = (status: Operation['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'running':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: Operation['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: Operation['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'running':
        return 'Running';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'research':
        return <GitBranch className="h-4 w-4" />;
      case 'analysis':
        return <BarChart3 className="h-4 w-4" />;
      case 'command':
        return <Zap className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate flex items-center space-x-2">
              {getTypeIcon(operation.type)}
              <span>{operation.type}</span>
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {operation.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(operation.status)} font-medium`}>
              {getStatusIcon(operation.status)}
              <span className="ml-1">{getStatusLabel(operation.status)}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Progress Bar */}
          {operation.status === 'running' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{operation.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(operation.progress)}`}
                  style={{ width: `${operation.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Started</span>
            <span>{formatDistanceToNow(new Date(operation.startedAt), { addSuffix: true })}</span>
          </div>

          {operation.completedAt && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Completed</span>
              <span>{formatDistanceToNow(new Date(operation.completedAt), { addSuffix: true })}</span>
            </div>
          )}

          {operation.metadata && Object.keys(operation.metadata).length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Metadata:</span> {Object.keys(operation.metadata).length} items
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(operation)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {operation.status === 'running' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onCancel(operation.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface OperationDetailsProps {
  operation: Operation | null;
  onClose: () => void;
  onCancel: (id: string) => void;
}

const OperationDetails: React.FC<OperationDetailsProps> = ({ 
  operation, 
  onClose, 
  onCancel 
}) => {
  if (!operation) return null;

  const getStatusColor = (status: Operation['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'running':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: Operation['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'failed':
        return <XCircle className="h-5 w-5" />;
      case 'running':
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      case 'cancelled':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center space-x-2">
                {getStatusIcon(operation.status)}
                <span>Operation Details</span>
              </CardTitle>
              <CardDescription className="mt-1">
                {operation.type} • {operation.description}
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
              <Label className="text-sm font-medium text-muted-foreground">Type</Label>
              <p className="text-sm font-medium">{operation.type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <p className={`text-sm font-medium ${getStatusColor(operation.status)}`}>
                {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Started</Label>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(operation.startedAt), { addSuffix: true })}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
              <p className="text-sm font-medium">{operation.progress}%</p>
            </div>
          </div>

          {operation.status === 'running' && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Progress</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{operation.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(operation.progress)}`}
                    style={{ width: `${operation.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="text-sm mt-1">{operation.description}</p>
          </div>

          {operation.completedAt && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Completed</Label>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(operation.completedAt), { addSuffix: true })}
              </p>
            </div>
          )}

          {operation.metadata && Object.keys(operation.metadata).length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Metadata</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(operation.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            {operation.status === 'running' && (
              <Button 
                variant="destructive"
                onClick={() => onCancel(operation.id)}
              >
                <Pause className="h-4 w-4 mr-2" />
                Cancel Operation
              </Button>
            )}
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
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFiltersChange, onReset }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

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
            placeholder="Search operations..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="analysis">Analysis</SelectItem>
              <SelectItem value="command">Command</SelectItem>
              <SelectItem value="database">Database</SelectItem>
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

const OperationsMonitoringInner: React.FC = () => {
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [sortBy, setSortBy] = useState<'startedAt' | 'status' | 'type' | 'progress'>('startedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTab, setSelectedTab] = useState('all');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
  });
  
  const cancelOperation = useCancelOperation();
  const { addNotification } = useNotifications();

  const { data: operationsData, isLoading, error, refetch } = useOperations();

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: '',
      type: '',
    });
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelOperation.mutateAsync(id);
      addNotification({
        type: 'success',
        title: 'Operation Cancelled',
        message: 'The operation has been cancelled successfully.',
        read: false,
      });
      setSelectedOperation(null);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Cancel Failed',
        message: 'Failed to cancel the operation.',
        read: false,
      });
    }
  };

  const sortedOperations = useMemo(() => {
    if (!operationsData?.operations) return [];

    const sorted = [...operationsData.operations].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'startedAt':
          comparison = a.startedAt - b.startedAt;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'progress':
          comparison = a.progress - b.progress;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return sorted.filter(op => 
        op.type.toLowerCase().includes(searchTerm) ||
        op.description.toLowerCase().includes(searchTerm) ||
        op.status.toLowerCase().includes(searchTerm)
      );
    }

    return sorted;
  }, [operationsData?.operations, sortBy, sortOrder, filters.search]);

  const filteredOperations = useMemo(() => {
    let filtered = sortedOperations;

    // Apply tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(op => op.status === selectedTab);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(op => op.status === filters.status);
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(op => op.type.toLowerCase() === filters.type.toLowerCase());
    }

    return filtered;
  }, [sortedOperations, selectedTab, filters]);

  const operationStats = useMemo(() => {
    if (!operationsData?.operations) return { total: 0, running: 0, completed: 0, failed: 0, cancelled: 0 };
    
    const operations = operationsData.operations;
    return {
      total: operations.length,
      running: operations.filter(op => op.status === 'running').length,
      completed: operations.filter(op => op.status === 'completed').length,
      failed: operations.filter(op => op.status === 'failed').length,
      cancelled: operations.filter(op => op.status === 'cancelled').length,
    };
  }, [operationsData?.operations]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading operations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load operations</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Operations Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor live operations and system activity
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
            <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{operationStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{operationStats.running}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{operationStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{operationStats.failed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <AlertTriangle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{operationStats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
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
                  <CardTitle>Operations</CardTitle>
                  <CardDescription>
                    {filteredOperations.length} operations found
                    {operationsData && ` (${operationsData.operations.length} total)`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="startedAt">Started Date</option>
                    <option value="status">Status</option>
                    <option value="type">Type</option>
                    <option value="progress">Progress</option>
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
                  <TabsTrigger value="running">Running</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="failed">Failed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                
                <TabsContent value={selectedTab} className="mt-4">
                  {filteredOperations.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No operations found matching your criteria</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredOperations.map((operation) => (
                        <OperationCard
                          key={operation.id}
                          operation={operation}
                          onViewDetails={setSelectedOperation}
                          onCancel={handleCancel}
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

      {/* Operation Details Modal */}
      <OperationDetails
        operation={selectedOperation}
        onClose={() => setSelectedOperation(null)}
        onCancel={handleCancel}
      />
    </div>
  );
};

const OperationsMonitoring: React.FC = () => {
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
          <p className="text-muted-foreground">Loading operations...</p>
        </div>
      </div>
    );
  }

  return <OperationsMonitoringInner />;
};

export { OperationsMonitoring };
export default OperationsMonitoring;