
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from './AuthContext';

export type FeedbackCategory = 'complaint' | 'suggestion' | 'compliment';

export type FeedbackStatus = 'pending' | 'reviewed' | 'resolved';

export type Feedback = {
  id: string;
  userId: string;
  username: string; // Add username for easier identification
  entity: string;
  company: string; // Add company association
  category: FeedbackCategory;
  description: string;
  contactEmail: string;
  status: FeedbackStatus;
  createdAt: Date;
  resolvedAt: Date | null;
  adminResponse: string | null;
};

type FeedbackContextType = {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'status' | 'resolvedAt' | 'adminResponse'>) => void;
  getUserFeedbacks: (userId: string) => Feedback[];
  getCompanyFeedbacks: (company: string) => Feedback[];
  getAllFeedbacks: () => Feedback[]; // New function to get all feedbacks
  updateFeedbackStatus: (feedbackId: string, status: FeedbackStatus, adminResponse?: string) => void;
};

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

type FeedbackProviderProps = {
  children: ReactNode;
};

export const FeedbackProvider = ({ children }: FeedbackProviderProps) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: '1',
      userId: 'user1',
      username: 'john_doe',
      entity: 'IT Department',
      company: 'ABC Organization',
      category: 'complaint',
      description: 'My computer has been very slow lately.',
      contactEmail: 'user1@example.com',
      status: 'pending',
      createdAt: new Date('2025-05-07T10:30:00'),
      resolvedAt: null,
      adminResponse: null
    },
    {
      id: '2',
      userId: 'user2',
      username: 'jane_smith',
      entity: 'HR Department',
      company: 'XYZ Company',
      category: 'compliment',
      description: 'The new benefits package is excellent!',
      contactEmail: 'user2@example.com',
      status: 'reviewed',
      createdAt: new Date('2025-05-06T14:45:00'),
      resolvedAt: null,
      adminResponse: 'Thank you for your positive feedback!'
    },
    {
      id: '3',
      userId: 'user1',
      username: 'john_doe',
      entity: 'Cafeteria',
      company: 'XXX Inc',
      category: 'suggestion',
      description: 'Could we have more vegan options?',
      contactEmail: 'user1@example.com',
      status: 'resolved',
      createdAt: new Date('2025-05-05T09:15:00'),
      resolvedAt: new Date('2025-05-08T11:20:00'),
      adminResponse: 'We have added more vegan options to the menu.'
    }
  ]);

  const addFeedback = (newFeedback: Omit<Feedback, 'id' | 'createdAt' | 'status' | 'resolvedAt' | 'adminResponse'>) => {
    const feedback: Feedback = {
      ...newFeedback,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: new Date(),
      status: 'pending',
      resolvedAt: null,
      adminResponse: null
    };
    setFeedbacks([...feedbacks, feedback]);
  };

  const getUserFeedbacks = (userId: string) => {
    return feedbacks.filter(feedback => feedback.userId === userId);
  };

  const getCompanyFeedbacks = (company: string) => {
    return feedbacks.filter(feedback => feedback.company === company);
  };
  
  const getAllFeedbacks = () => {
    return [...feedbacks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const updateFeedbackStatus = (feedbackId: string, status: FeedbackStatus, adminResponse?: string) => {
    setFeedbacks(feedbacks.map(feedback => {
      if (feedback.id === feedbackId) {
        return {
          ...feedback,
          status,
          resolvedAt: status === 'resolved' ? new Date() : feedback.resolvedAt,
          adminResponse: adminResponse || feedback.adminResponse
        };
      }
      return feedback;
    }));
  };

  return (
    <FeedbackContext.Provider value={{ feedbacks, addFeedback, getUserFeedbacks, getCompanyFeedbacks, getAllFeedbacks, updateFeedbackStatus }}>
      {children}
    </FeedbackContext.Provider>
  );
};
