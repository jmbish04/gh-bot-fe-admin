import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useGitHubBotAPI';
import { WebSocketMessage, StatsUpdateMessage, OperationUpdateMessage, CommandUpdateMessage, ResearchUpdateMessage, NotificationMessage } from '@/types/api';
import { useNotifications } from '@/lib/stores/app-store';

interface UseWebSocketOptions {
  url: string;
  enabled?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  lastMessage: WebSocketMessage | null;
}

export const useWebSocket = ({
  url,
  enabled = true,
  reconnectInterval = 5000,
  maxReconnectAttempts = 5,
}: UseWebSocketOptions) => {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    lastMessage: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  const connect = () => {
    if (!enabled || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setState(prev => ({ ...prev, lastMessage: message }));

          // Handle different message types
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
        }));

        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && enabled) {
          scheduleReconnect();
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setState(prev => ({
          ...prev,
          error: 'WebSocket connection error',
          isConnecting: false,
        }));
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to create WebSocket connection',
        isConnecting: false,
      }));
    }
  };

  const scheduleReconnect = () => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      setState(prev => ({
        ...prev,
        error: 'Max reconnection attempts reached',
      }));
      return;
    }

    reconnectAttemptsRef.current++;
    console.log(`Scheduling reconnection attempt ${reconnectAttemptsRef.current} in ${reconnectInterval}ms`);

    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval);
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect');
      wsRef.current = null;
    }

    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
      lastMessage: null,
    });
  };

  const sendMessage = (message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'stats_update':
        // Invalidate stats queries to trigger refetch
        queryClient.invalidateQueries({ queryKey: queryKeys.stats });
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
        break;

      case 'operation_update':
        // Invalidate operations queries
        queryClient.invalidateQueries({ queryKey: queryKeys.operations });
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
        
        // Add notification for important operation updates
        const operationMessage = message as OperationUpdateMessage;
        if (operationMessage.data.status === 'completed' || operationMessage.data.status === 'failed') {
          addNotification({
            type: operationMessage.data.status === 'completed' ? 'success' : 'error',
            title: `Operation ${operationMessage.data.status}`,
            message: operationMessage.data.description,
          });
        }
        break;

      case 'command_update':
        // Invalidate commands queries
        queryClient.invalidateQueries({ queryKey: ['commands'] });
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
        
        // Add notification for command updates
        const commandMessage = message as CommandUpdateMessage;
        if (commandMessage.data.status === 'completed' || commandMessage.data.status === 'failed') {
          addNotification({
            type: commandMessage.data.status === 'completed' ? 'success' : 'error',
            title: `Command ${commandMessage.data.status}`,
            message: `${commandMessage.data.command} in ${commandMessage.data.repo}`,
          });
        }
        break;

      case 'research_update':
        // Invalidate research queries
        queryClient.invalidateQueries({ queryKey: queryKeys.research.status });
        queryClient.invalidateQueries({ queryKey: queryKeys.research.results() });
        queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
        
        // Add notification for research completion
        const researchMessage = message as ResearchUpdateMessage;
        if (researchMessage.data.status === 'completed') {
          addNotification({
            type: 'success',
            title: 'Research Completed',
            message: `Repository research has been completed successfully`,
          });
        }
        break;

      case 'notification':
        // Handle system notifications
        const notificationMessage = message as NotificationMessage;
        addNotification({
          type: notificationMessage.data.type,
          title: notificationMessage.data.title,
          message: notificationMessage.data.message,
        });
        break;

      default:
        console.log('Unknown WebSocket message type:', message.type);
    }
  };

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [enabled, url]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
  };
};

// Hook for GitHub Bot specific WebSocket connection
export const useGitHubBotWebSocket = (enabled: boolean = true) => {
  const WS_URL = 'wss://gh-bot.hacolby.workers.dev/ws';
  
  return useWebSocket({
    url: WS_URL,
    enabled,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  });
};
