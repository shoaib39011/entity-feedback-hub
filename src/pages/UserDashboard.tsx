
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFeedback } from "@/context/FeedbackContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BadgeAlert,
  BadgeCheck,
  BadgeInfo,
  Clock,
  MessageSquare,
  Plus,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackList from "@/components/feedback/FeedbackList";

const UserDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { getUserFeedbacks } = useFeedback();
  const [activeTab, setActiveTab] = useState("view");
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  const userFeedbacks = user ? getUserFeedbacks(user.id) : [];
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Feedback Dashboard</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="view">
              <MessageSquare className="mr-2 h-4 w-4" />
              View Feedbacks
            </TabsTrigger>
            <TabsTrigger value="create">
              <Plus className="mr-2 h-4 w-4" />
              Submit Feedback
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Submitted Feedbacks</CardTitle>
              </CardHeader>
              <CardContent>
                {userFeedbacks.length > 0 ? (
                  <FeedbackList feedbacks={userFeedbacks} />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">You haven't submitted any feedback yet</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setActiveTab("create")}
                    >
                      Submit Your First Feedback
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="create" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <FeedbackForm onSuccess={() => setActiveTab("view")} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <BadgeAlert size={24} className="text-feedback-complaint mb-2" />
              <h3 className="font-medium text-lg">Complaints</h3>
              <p className="text-2xl font-bold mt-2">
                {userFeedbacks.filter(f => f.category === 'complaint').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <BadgeInfo size={24} className="text-feedback-suggestion mb-2" />
              <h3 className="font-medium text-lg">Suggestions</h3>
              <p className="text-2xl font-bold mt-2">
                {userFeedbacks.filter(f => f.category === 'suggestion').length}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <BadgeCheck size={24} className="text-feedback-compliment mb-2" />
              <h3 className="font-medium text-lg">Compliments</h3>
              <p className="text-2xl font-bold mt-2">
                {userFeedbacks.filter(f => f.category === 'compliment').length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
