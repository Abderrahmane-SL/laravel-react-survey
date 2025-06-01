import { useEffect, useState } from "react";
import axiosClient from "../axios.js";
import PageComponent from "../components/PageComponent";
import { EyeIcon, PencilIcon, ChartBarIcon, DocumentTextIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import styled from "styled-components";

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled(Card)`
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeIn 0.5s ease forwards;
  opacity: 0;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }
`;

const DetailCard = styled(Card)`
  height: 100%;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: ${props => props.$delay || '0s'};
  opacity: 0;
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  
  img {
    max-width: 200px;
    height: auto;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
`;

const StatusBadge = styled(Badge)`
  font-size: 0.75rem;
  font-weight: 500;
`;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    setLoading(true);
    axiosClient
      .get(`/dashboard`)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setData(res.data);
        return res;
      })
      .catch((error) => {
        setLoading(false);
        return error;
      });
  }, []);

  return (
    <PageComponent title="Dashboard" subtitle="Overview of your survey activities">
      {loading ? (
        <StatsGrid>
          <StatCard>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </CardContent>
          </StatCard>
          <StatCard>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </CardContent>
          </StatCard>
          <StatCard>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto mt-4" />
            </CardContent>
          </StatCard>
        </StatsGrid>
      ) : (
        <>
          <StatsGrid>
            <StatCard style={{ animationDelay: '0.1s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Surveys</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex items-center justify-center">
                  <DocumentTextIcon className="h-8 w-8 text-primary mr-2" />
                  <span className="text-4xl font-bold">{data.totalSurveys || 0}</span>
                </div>
                <Progress value={(data.totalSurveys / 100) * 100} className="mt-4" />
              </CardContent>
            </StatCard>
            
            <StatCard style={{ animationDelay: '0.2s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Answers</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex items-center justify-center">
                  <ChartBarIcon className="h-8 w-8 text-primary mr-2" />
                  <span className="text-4xl font-bold">{data.totalAnswers || 0}</span>
                </div>
                <Progress value={(data.totalAnswers / 500) * 100} className="mt-4" />
              </CardContent>
            </StatCard>
            
            <StatCard style={{ animationDelay: '0.3s' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Response Rate</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex items-center justify-center">
                  <UserGroupIcon className="h-8 w-8 text-primary mr-2" />
                  <span className="text-4xl font-bold">
                    {data.totalSurveys && data.totalAnswers 
                      ? Math.round((data.totalAnswers / (data.totalSurveys * 10)) * 100) 
                      : 0}%
                  </span>
                </div>
                <Progress 
                  value={data.totalSurveys && data.totalAnswers 
                    ? (data.totalAnswers / (data.totalSurveys * 10)) * 100 
                    : 0} 
                  className="mt-4" 
                />
              </CardContent>
            </StatCard>
          </StatsGrid>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailCard $delay="0.4s">
              <CardHeader>
                <CardTitle>Latest Survey</CardTitle>
                <CardDescription>Your most recently created survey</CardDescription>
              </CardHeader>
              <CardContent>
                {data.latestSurvey ? (
                  <>
                    <ImageContainer>
                      <img src={data.latestSurvey.image_url || "/placeholder.svg"} alt={data.latestSurvey.title} />
                    </ImageContainer>
                    <h3 className="text-xl font-semibold mb-4">{data.latestSurvey.title}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium">
                          {new Date(data.latestSurvey.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="font-medium">
                          {new Date(data.latestSurvey.expire_date).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <StatusBadge variant={data.latestSurvey.status ? "default" : "outline"}>
                          {data.latestSurvey.status ? "Active" : "Draft"}
                        </StatusBadge>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Questions:</span>
                        <span className="font-medium">{data.latestSurvey.questions}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Responses:</span>
                        <span className="font-medium">{data.latestSurvey.answers}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <DocumentTextIcon className="h-12 w-12 mb-2" />
                    <p>No surveys created yet</p>
                  </div>
                )}
              </CardContent>
              {data.latestSurvey && (
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/surveys/${data.latestSurvey.id}`}>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </a>
                  </Button>
                  <Button size="sm" asChild>
                    <a href={`/survey/results/${data.latestSurvey.id}`}>
                      <EyeIcon className="h-4 w-4 mr-2" />
                      View Results
                    </a>
                  </Button>
                </CardFooter>
              )}
            </DetailCard>

            <DetailCard $delay="0.5s">
              <CardHeader>
                <CardTitle>Recent Responses</CardTitle>
                <CardDescription>Latest answers to your surveys</CardDescription>
              </CardHeader>
              <CardContent>
                {data.latestAnswers && data.latestAnswers.length > 0 ? (
                  <div className="space-y-4">
                    {data.latestAnswers.map((answer) => (
                      <Card key={answer.id} className="overflow-hidden">
                        <div className="p-4 flex items-start gap-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <UserGroupIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="font-medium">{answer.survey.title}</p>
                            <p className="text-sm text-muted-foreground">
                              Completed: {new Date(answer.end_date).toLocaleString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="icon" asChild>
                            <a href={`/survey/answer/${answer.id}`}>
                              <EyeIcon className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <ChartBarIcon className="h-12 w-12 mb-2" />
                    <p>No responses yet</p>
                  </div>
                )}
              </CardContent>
            </DetailCard>
          </div>
        </>
      )}
    </PageComponent>
  );
}