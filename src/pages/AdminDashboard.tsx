
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFeedback, Feedback } from "@/context/FeedbackContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import AdminFeedbackItem from "@/components/admin/AdminFeedbackItem";
import { BadgeAlert, BadgeCheck, BadgeInfo, Search, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDashboard = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const { feedbacks, getCompanyFeedbacks, getAllFeedbacks } = useFeedback();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  
  // Redirect if not authenticated or not an admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  // If user is a company admin, show only that company's feedbacks
  // If user is a super admin (no company), show all feedbacks or filtered by selected company
  const isSuperAdmin = !user?.company;
  
  // Get feedbacks based on admin type and selected filter
  const adminFeedbacks = isSuperAdmin 
    ? (selectedCompany ? getCompanyFeedbacks(selectedCompany) : getAllFeedbacks())
    : (user?.company ? getCompanyFeedbacks(user.company) : []);
  
  // Get unique companies for filtering (for super admin)
  const companies = Array.from(new Set(feedbacks.map(f => f.company))).sort();
  
  // Filter feedbacks based on active tab and search term
  const filteredFeedbacks = adminFeedbacks
    .filter((feedback) => {
      if (activeTab === "all") return true;
      if (activeTab === "pending") return feedback.status === "pending";
      if (activeTab === "reviewed") return feedback.status === "reviewed";
      if (activeTab === "resolved") return feedback.status === "resolved";
      if (activeTab === "complaints") return feedback.category === "complaint";
      if (activeTab === "suggestions") return feedback.category === "suggestion";
      if (activeTab === "compliments") return feedback.category === "compliment";
      return true;
    })
    .filter((feedback) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        feedback.entity.toLowerCase().includes(searchLower) ||
        feedback.description.toLowerCase().includes(searchLower) ||
        feedback.contactEmail.toLowerCase().includes(searchLower) ||
        feedback.username.toLowerCase().includes(searchLower) ||
        feedback.company.toLowerCase().includes(searchLower)
      );
    });
  
  const getStatusCount = (status: string) => {
    return adminFeedbacks.filter((feedback) => feedback.status === status).length;
  };
  
  const getCategoryCount = (category: string) => {
    return adminFeedbacks.filter((feedback) => feedback.category === category).length;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center mt-2 text-gray-600">
              {user?.company ? (
                <>
                  <Building className="h-4 w-4 mr-1" />
                  <span>{user.company} Admin</span>
                </>
              ) : (
                <span className="text-blue-600 font-medium">Super Admin - All Organizations</span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {isSuperAdmin && (
              <div className="w-full sm:w-64">
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Companies</SelectItem>
                    {companies.map(company => (
                      <SelectItem key={company} value={company}>{company}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Feedbacks</p>
                  <h3 className="text-3xl font-bold">{adminFeedbacks.length}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <BadgeInfo className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <h3 className="text-3xl font-bold">{getStatusCount("pending")}</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <BadgeAlert className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <h3 className="text-3xl font-bold">{getStatusCount("resolved")}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BadgeCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="complaints">
              <BadgeAlert className="h-4 w-4 mr-1 text-feedback-complaint" />
              Complaints ({getCategoryCount("complaint")})
            </TabsTrigger>
            <TabsTrigger value="suggestions">
              <BadgeInfo className="h-4 w-4 mr-1 text-feedback-suggestion" />
              Suggestions ({getCategoryCount("suggestion")})
            </TabsTrigger>
            <TabsTrigger value="compliments">
              <BadgeCheck className="h-4 w-4 mr-1 text-feedback-compliment" />
              Compliments ({getCategoryCount("compliment")})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Feedbacks
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({filteredFeedbacks.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((feedback: Feedback) => (
                      <AdminFeedbackItem key={feedback.id} feedback={feedback} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No feedbacks found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
