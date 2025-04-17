// pages/admin/Messages.tsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as apiClient from '../../api-client';
import { useToast } from '../../contexts/AppContext';
import { 
  HiInbox, HiOutlineTrash, HiMail, HiMailOpen, 
  HiExclamationCircle, HiCheck, HiX, HiFilter, 
  HiCalendar, HiUser, HiSearch
} from 'react-icons/hi';

// Define message type
type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  bookingId?: string;
  isRead: boolean;
  isCancellationRequest: boolean;
  status?: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
  updatedAt: string;
};

const Messages = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'cancellations'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch messages
  const { data: messages, isLoading, error } = useQuery<ContactMessage[]>({
    queryKey: ['adminMessages'],
    queryFn: apiClient.getAdminMessages,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (messageId: string) => apiClient.markMessageAsRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  // Process cancellation mutation
  const processCancellationMutation = useMutation({
    mutationFn: ({ messageId, status }: { messageId: string, status: string }) => 
      apiClient.processCancellationRequest(messageId, status),
    onSuccess: (data) => {
      showToast({ 
        message: `Cancellation request ${data.status}${data.emailSent ? ' and notification email sent' : ''}`, 
        type: "SUCCESS" 
      });
      setSelectedMessage(null);
      queryClient.invalidateQueries({ queryKey: ['adminMessages'] });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  // Filter and search messages
  const filteredMessages = messages?.filter(message => {
    // Apply filter
    if (filter === 'unread' && message.isRead) return false;
    if (filter === 'cancellations' && !message.isCancellationRequest) return false;
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        message.name.toLowerCase().includes(searchLower) ||
        message.email.toLowerCase().includes(searchLower) ||
        message.subject.toLowerCase().includes(searchLower) ||
        message.message.toLowerCase().includes(searchLower) ||
        (message.bookingId && message.bookingId.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Handle message click
  const handleMessageClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // If message is unread, mark it as read
    if (!message.isRead) {
      markAsReadMutation.mutate(message._id);
    }
  };

  // Handle cancellation approval
  const handleCancellationApproval = (status: 'approved' | 'rejected') => {
    if (selectedMessage) {
      processCancellationMutation.mutate({ 
        messageId: selectedMessage._id, 
        status 
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="mt-4 text-lg text-gray-700">Loading messages...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <h3 className="text-lg font-bold mb-2">Error Loading Messages</h3>
        <p>There was a problem loading the messages. Please try again later.</p>
      </div>
    );
  }

  const unreadCount = messages?.filter(m => !m.isRead).length || 0;
  const cancellationsCount = messages?.filter(m => m.isCancellationRequest).length || 0;

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Messages & Cancellation Requests</h1>
      
      {/* Filters and search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search messages..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread ({unreadCount})</option>
              <option value="cancellations">Cancellations ({cancellationsCount})</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Messages display */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredMessages && filteredMessages.length > 0 ? (
          <div className="flex flex-col md:flex-row h-[calc(100vh-240px)]">
            {/* Message list */}
            <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredMessages.map((message) => (
                  <li 
                    key={message._id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedMessage?._id === message._id ? 'bg-orange-50' : ''
                    } ${!message.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {message.isRead ? 
                            <HiMailOpen className="h-5 w-5 text-gray-400 mr-2" /> : 
                            <HiMail className="h-5 w-5 text-blue-500 mr-2" />
                          }
                          <p className={`text-sm font-medium ${!message.isRead ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                            {message.name}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {message.isCancellationRequest && (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 mr-2">
                              Cancellation
                            </span>
                          )}
                          <time dateTime={message.createdAt} className="text-xs text-gray-500">
                            {formatDate(message.createdAt).split(',')[0]}
                          </time>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className={`text-sm ${!message.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'} truncate`}>
                          {message.subject}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Message detail */}
            <div className="w-full md:w-2/3 overflow-y-auto">
              {selectedMessage ? (
                <div className="p-6">
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-gray-800">{selectedMessage.subject}</h2>
                      <div className="flex items-center">
                        {selectedMessage.isCancellationRequest && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full mr-2 ${
                            selectedMessage.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            selectedMessage.status === 'approved' ? 'bg-green-100 text-green-800' :
                            selectedMessage.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedMessage.status === 'pending' ? 'Pending' :
                             selectedMessage.status === 'approved' ? 'Approved' :
                             selectedMessage.status === 'rejected' ? 'Rejected' :
                             selectedMessage.status === 'completed' ? 'Completed' : 'Status Unknown'}
                          </span>
                        )}
                        <time dateTime={selectedMessage.createdAt} className="text-sm text-gray-500">
                          {formatDate(selectedMessage.createdAt)}
                        </time>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm">
                      <div className="flex items-center mr-4">
                        <HiUser className="h-4 w-4 text-gray-500 mr-1" />
                        <span>{selectedMessage.name}</span>
                      </div>
                      <div>
                        <a href={`mailto:${selectedMessage.email}`} className="text-orange-600 hover:underline">
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    
                    {selectedMessage.bookingId && (
                      <div className="mt-2 text-sm">
                        <span className="font-medium text-gray-500">Booking ID: </span>
                        <span className="text-gray-900">{selectedMessage.bookingId}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Message content */}
                  <div className="prose prose-sm max-w-none">
                    <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-800">
                      {selectedMessage.message}
                    </div>
                  </div>
                  
                  {/* Cancellation actions */}
                  {selectedMessage.isCancellationRequest && selectedMessage.status === 'pending' && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Process Cancellation Request</h3>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleCancellationApproval('approved')}
                          disabled={processCancellationMutation.isPending}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                          <HiCheck className="mr-2 h-5 w-5" />
                          Approve Cancellation
                        </button>
                        <button
                          onClick={() => handleCancellationApproval('rejected')}
                          disabled={processCancellationMutation.isPending}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                        >
                          <HiX className="mr-2 h-5 w-5" />
                          Reject Cancellation
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-500">
                  <HiInbox className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Select a message</h3>
                  <p className="text-gray-500">Choose a message from the list to view its contents</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <HiInbox className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No messages found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm || filter !== 'all'
                ? 'Try adjusting your search or filter settings'
                : 'There are no messages in your inbox yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;