import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Star, 
  ExternalLink, 
  Filter, 
  SortAsc, 
  SortDesc,
  GitBranch,
  Code,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Play,
  Pause
} from 'lucide-react';
import { useResearchResults, useResearchStatus, useStartResearch, useStopResearch } from '@/hooks/useGitHubBotAPI';
import { useFilters, useHydration } from '@/lib/stores/app-store';
import type { Repository, RepositoryFilters } from '@/types/api';
import { formatDistanceToNow } from 'date-fns';

interface RepositoryCardProps {
  repository: Repository;
  onViewDetails: (repo: Repository) => void;
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({ repository, onViewDetails }) => {
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{repository.full_name}</CardTitle>
            <CardDescription className="flex items-center space-x-2 mt-1">
              <Star className="h-4 w-4" />
              <span>{repository.stars.toLocaleString()}</span>
              <span>•</span>
              <a 
                href={repository.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-3 w-3" />
                <span>View on GitHub</span>
              </a>
            </CardDescription>
          </div>
          <Badge className={`${getScoreColor(repository.score)} font-medium`}>
            {getScoreLabel(repository.score)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Score</span>
            <span className="text-sm text-muted-foreground">
              {(repository.score * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                repository.score >= 0.8 ? 'bg-green-500' :
                repository.score >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${repository.score * 100}%` }}
            />
          </div>
          
          {repository.short_summary && (
            <div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {repository.short_summary}
              </p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(repository)}
            className="w-full"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface RepositoryDetailsProps {
  repository: Repository | null;
  onClose: () => void;
}

const RepositoryDetails: React.FC<RepositoryDetailsProps> = ({ repository, onClose }) => {
  if (!repository) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{repository.full_name}</CardTitle>
              <CardDescription className="flex items-center space-x-2 mt-1">
                <Star className="h-4 w-4" />
                <span>{repository.stars.toLocaleString()} stars</span>
                <span>•</span>
                <a 
                  href={repository.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>View on GitHub</span>
                </a>
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Analysis Score</h3>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold">
                {(repository.score * 100).toFixed(1)}%
              </div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      repository.score >= 0.8 ? 'bg-green-500' :
                      repository.score >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${repository.score * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {repository.short_summary && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p className="text-muted-foreground">{repository.short_summary}</p>
            </div>
          )}

          {repository.long_summary && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Detailed Analysis</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {repository.long_summary}
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button asChild>
              <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Repository
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
  filters: RepositoryFilters;
  onFiltersChange: (filters: Partial<RepositoryFilters>) => void;
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
            placeholder="Search repositories..."
            value={filters.search || ''}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minScore">Min Score</Label>
            <Input
              id="minScore"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={filters.minScore || ''}
              onChange={(e) => onFiltersChange({ minScore: parseFloat(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label htmlFor="maxScore">Max Score</Label>
            <Input
              id="maxScore"
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={filters.maxScore || ''}
              onChange={(e) => onFiltersChange({ maxScore: parseFloat(e.target.value) || undefined })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minStars">Min Stars</Label>
            <Input
              id="minStars"
              type="number"
              min="0"
              value={filters.minStars || ''}
              onChange={(e) => onFiltersChange({ minStars: parseInt(e.target.value) || undefined })}
            />
          </div>
          <div>
            <Label htmlFor="maxStars">Max Stars</Label>
            <Input
              id="maxStars"
              type="number"
              min="0"
              value={filters.maxStars || ''}
              onChange={(e) => onFiltersChange({ maxStars: parseInt(e.target.value) || undefined })}
            />
          </div>
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

        <Button variant="outline" onClick={onReset} className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
};

const ResearchModuleInner: React.FC = () => {
  const [selectedRepository, setSelectedRepository] = useState<Repository | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'stars' | 'name'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const { repository, reset: resetFilters } = useFilters();
  const repositoryFilters = repository;
  const setRepositoryFilters = repository.setFilters;
  const { data: researchStatus } = useResearchStatus();
  const startResearch = useStartResearch();
  const stopResearch = useStopResearch();

  const { data: researchData, isLoading, error } = useResearchResults({
    min_score: repositoryFilters.filters.minScore,
    limit: 100,
  });

  const handleFiltersChange = (newFilters: Partial<RepositoryFilters>) => {
    setRepositoryFilters({ ...repositoryFilters.filters, ...newFilters });
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleStartResearch = async () => {
    try {
      await startResearch.mutateAsync();
    } catch (error) {
      console.error('Failed to start research:', error);
    }
  };

  const handleStopResearch = async () => {
    try {
      await stopResearch.mutateAsync();
    } catch (error) {
      console.error('Failed to stop research:', error);
    }
  };

  const sortedRepositories = useMemo(() => {
    if (!researchData?.results) return [];

    const sorted = [...researchData.results].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'stars':
          comparison = a.stars - b.stars;
          break;
        case 'name':
          comparison = a.full_name.localeCompare(b.full_name);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Apply search filter
    if (repositoryFilters.filters.search) {
      const searchTerm = repositoryFilters.filters.search.toLowerCase();
      return sorted.filter(repo => 
        repo.full_name.toLowerCase().includes(searchTerm) ||
        repo.short_summary?.toLowerCase().includes(searchTerm) ||
        repo.long_summary?.toLowerCase().includes(searchTerm)
      );
    }

    return sorted;
  }, [researchData?.results, sortBy, sortOrder, repositoryFilters.filters.search]);

  const filteredRepositories = useMemo(() => {
    return sortedRepositories.filter(repo => {
      if (repositoryFilters.filters.minStars && repo.stars < repositoryFilters.filters.minStars) return false;
      if (repositoryFilters.filters.maxStars && repo.stars > repositoryFilters.filters.maxStars) return false;
      if (repositoryFilters.filters.category && !repo.short_summary?.toLowerCase().includes(repositoryFilters.filters.category.toLowerCase())) return false;
      return true;
    });
  }, [sortedRepositories, repositoryFilters.filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading research results...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load research results</p>
          <Button onClick={() => window.location.reload()}>
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
          <h1 className="text-3xl font-bold tracking-tight">Research & Analysis</h1>
          <p className="text-muted-foreground">
            Discover and analyze repositories with AI-powered insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {researchStatus?.status === 'running' ? (
            <Button variant="destructive" onClick={handleStopResearch} disabled={stopResearch.isPending}>
              <Pause className="h-4 w-4 mr-2" />
              Stop Research
            </Button>
          ) : (
            <Button onClick={handleStartResearch} disabled={startResearch.isPending}>
              <Play className="h-4 w-4 mr-2" />
              Start Research
            </Button>
          )}
        </div>
      </div>

      {/* Research Status */}
      {researchStatus && researchStatus.status !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5" />
              <span>Research Status</span>
              <Badge variant={researchStatus.status === 'running' ? 'default' : 'secondary'}>
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

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <div className="lg:col-span-1">
          <FilterPanel
            filters={repositoryFilters.filters}
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
                  <CardTitle>Research Results</CardTitle>
                  <CardDescription>
                    {filteredRepositories.length} repositories found
                    {researchData && ` (${researchData.total_projects} total)`}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'score' | 'stars' | 'name')}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="score">Score</option>
                    <option value="stars">Stars</option>
                    <option value="name">Name</option>
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
              {filteredRepositories.length === 0 ? (
                <div className="text-center py-8">
                  <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No repositories found matching your criteria</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredRepositories.map((repository) => (
                    <RepositoryCard
                      key={repository.full_name}
                      repository={repository}
                      onViewDetails={setSelectedRepository}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Repository Details Modal */}
      <RepositoryDetails
        repository={selectedRepository}
        onClose={() => setSelectedRepository(null)}
      />
    </div>
  );
};

const ResearchModule: React.FC = () => {
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
          <p className="text-muted-foreground">Loading research module...</p>
        </div>
      </div>
    );
  }

  return <ResearchModuleInner />;
};

export { ResearchModule };
export default ResearchModule;
