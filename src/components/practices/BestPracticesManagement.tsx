import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Search, 
  Filter, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Eye,
  Download,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Tag,
  Calendar,
  User,
  Code,
  Shield,
  Zap,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { 
  useBestPractices, 
  useBestPractice, 
  useApproveBestPractice, 
  useRejectBestPractice 
} from '@/hooks/useGitHubBotAPI';
import { useFilters, useHydration } from '@/lib/stores/app-store';
import type { BestPractice, BestPracticeFilters } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';

interface PracticeCardProps {
  practice: BestPractice;
  onViewDetails: (practice: BestPractice) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PracticeCard: React.FC<PracticeCardProps> = ({ 
  practice, 
  onViewDetails, 
  onApprove, 
  onReject 
}) => {
  const getStatusColor = (status: BestPractice['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: BestPractice['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: BestPractice['status']) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'performance':
        return <Zap className="h-4 w-4" />;
      case 'code quality':
        return <Code className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{practice.title}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              {getCategoryIcon(practice.category)}
              <span>{practice.category}</span>
              <span>•</span>
              <Calendar className="h-4 w-4" />
              <span>{formatDistanceToNow(new Date(practice.createdAt), { addSuffix: true })}</span>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`${getStatusColor(practice.status)} font-medium`}>
              {getStatusIcon(practice.status)}
              <span className="ml-1">{getStatusLabel(practice.status)}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {practice.description}
          </p>
          
          {practice.tags && practice.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {practice.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {practice.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{practice.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewDetails(practice)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {practice.status === 'pending' && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onApprove(practice.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onReject(practice.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </>
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

interface PracticeDetailsProps {
  practice: BestPractice | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PracticeDetails: React.FC<PracticeDetailsProps> = ({ 
  practice, 
  onClose, 
  onApprove, 
  onReject 
}) => {
  if (!practice) return null;

  const getStatusColor = (status: BestPractice['status']) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: BestPractice['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5" />;
      case 'rejected':
        return <XCircle className="h-5 w-5" />;
      case 'pending':
        return <Clock className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl flex items-center space-x-2">
                {getStatusIcon(practice.status)}
                <span>{practice.title}</span>
              </CardTitle>
              <CardDescription className="mt-1">
                {practice.category} • {formatDistanceToNow(new Date(practice.createdAt), { addSuffix: true })}
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
              <Label className="text-sm font-medium text-muted-foreground">Category</Label>
              <p className="text-sm font-medium">{practice.category}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <p className={`text-sm font-medium ${getStatusColor(practice.status)}`}>
                {practice.status.charAt(0).toUpperCase() + practice.status.slice(1)}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(practice.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Updated</Label>
              <p className="text-sm font-medium">
                {formatDistanceToNow(new Date(practice.updatedAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
            <p className="text-sm mt-1">{practice.description}</p>
          </div>

          {practice.tags && practice.tags.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {practice.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {practice.examples && practice.examples.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Examples</Label>
              <div className="mt-1 space-y-2">
                {practice.examples.map((example, index) => (
                  <div key={index} className="p-3 bg-muted rounded-md">
                    <code className="text-sm font-mono">{example}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {practice.implementation && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Implementation</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <pre className="text-sm whitespace-pre-wrap">{practice.implementation}</pre>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            {practice.status === 'pending' && (
              <>
                <Button 
                  onClick={() => onApprove(practice.id)}
                  className="text-green-600 hover:text-green-700"
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => onReject(practice.id)}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </>
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
  filters: BestPracticeFilters;
  onFiltersChange: (filters: Partial<BestPracticeFilters>) => void;
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
            placeholder="Search practices..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g., security, performance"
            value={filters.category || ''}
            onChange={(e) => onFiltersChange({ category: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || ''}
            onValueChange={(value) => onFiltersChange({ status: value as BestPractice['status'] || undefined })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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

const BestPracticesManagementInner: React.FC = () => {
  const [selectedPractice, setSelectedPractice] = useState<BestPractice | null>(null);
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'title' | 'category' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTab, setSelectedTab] = useState('all');
  
  const { bestPractice: practiceFilters, setFilters: setPracticeFilters, reset: resetFilters } = useFilters();
  const approvePractice = useApproveBestPractice();
  const rejectPractice = useRejectBestPractice();

  const { data: practicesData, isLoading, error, refetch } = useBestPractices(practiceFilters.filters);

  const handleFiltersChange = (newFilters: Partial<BestPracticeFilters>) => {
    setPracticeFilters({ ...practiceFilters.filters, ...newFilters });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleApprove = async (id: string) => {
    try {
      await approvePractice.mutateAsync(id);
      setSelectedPractice(null);
    } catch (error) {
      console.error('Failed to approve practice:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectPractice.mutateAsync(id);
      setSelectedPractice(null);
    } catch (error) {
      console.error('Failed to reject practice:', error);
    }
  };

  const sortedPractices = useMemo(() => {
    if (!practicesData?.practices) return [];

    const sorted = [...practicesData.practices].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'updatedAt':
          comparison = a.updatedAt - b.updatedAt;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply search filter
    if (practiceFilters.filters.search) {
      const searchTerm = practiceFilters.filters.search.toLowerCase();
      return sorted.filter(practice => 
        practice.title.toLowerCase().includes(searchTerm) ||
        practice.description.toLowerCase().includes(searchTerm) ||
        practice.category.toLowerCase().includes(searchTerm) ||
        practice.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    return sorted;
  }, [practicesData?.practices, sortBy, sortOrder, practiceFilters.filters.search]);

  const filteredPractices = useMemo(() => {
    let filtered = sortedPractices;

    // Apply tab filter
    if (selectedTab !== 'all') {
      filtered = filtered.filter(practice => practice.status === selectedTab);
    }

    return filtered;
  }, [sortedPractices, selectedTab]);

  const practiceStats = useMemo(() => {
    if (!practicesData?.practices) return { total: 0, approved: 0, rejected: 0, pending: 0 };
    
    const practices = practicesData.practices;
    return {
      total: practices.length,
      approved: practices.filter(p => p.status === 'approved').length,
      rejected: practices.filter(p => p.status === 'rejected').length,
      pending: practices.filter(p => p.status === 'pending').length,
    };
  }, [practicesData?.practices]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading best practices...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load best practices</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Best Practices Management</h1>
          <p className="text-muted-foreground">
            Review and manage code best practices and suggestions
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Practices</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{practiceStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{practiceStats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{practiceStats.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{practiceStats.pending}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={practiceFilters.filters}
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
                  <CardTitle>Best Practices</CardTitle>
                  <CardDescription>
                    {filteredPractices.length} practices found
                    {practicesData && ` (${practicesData.practices.length} total)`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="updatedAt">Updated Date</option>
                    <option value="title">Title</option>
                    <option value="category">Category</option>
                    <option value="status">Status</option>
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                
                <TabsContent value={selectedTab} className="mt-4">
                  {filteredPractices.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No practices found matching your criteria</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {filteredPractices.map((practice) => (
                        <PracticeCard
                          key={practice.id}
                          practice={practice}
                          onViewDetails={setSelectedPractice}
                          onApprove={handleApprove}
                          onReject={handleReject}
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

      {/* Practice Details Modal */}
      <PracticeDetails
        practice={selectedPractice}
        onClose={() => setSelectedPractice(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

const BestPracticesManagement: React.FC = () => {
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
          <p className="text-muted-foreground">Loading best practices...</p>
        </div>
      </div>
    );
  }

  return <BestPracticesManagementInner />;
};

export { BestPracticesManagement };
export default BestPracticesManagement;