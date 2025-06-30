import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Plus,
  Search,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { api } from "../api";

export default function ProjectTasksPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await api.get(`/projects/${id}`);
        setProject(projectRes.data);

        const tasksRes = await api.get(`/projects/${id}/tasks`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        });
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching project/tasks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const groupedTasks = {
    todo: filteredTasks.filter((task) => task.status === "todo"),
    in_progress: filteredTasks.filter((task) => task.status === "in_progress"),
    completed: filteredTasks.filter((task) => task.status === "completed"),
    blocked: filteredTasks.filter((task) => task.status === "blocked"),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to={`/projects/${id}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {project?.name}
          </Link>

          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project?.name}'s Project Tasks
              </h1>
              <p className="text-gray-600">
                Manage and track all tasks for {project?.name}
              </p>
            </div>
            <Button onClick={() => navigate(`/projects/${id}/tasks/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem
                value="v
              g[[\ltyytg,,rr ;e\]d
              f2]\\
              blocked"
              >
                Blocked
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
          </TabsList>

          {/* List View */}
          <TabsContent value="list">
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {task.title}
                          </h3>
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace("_", " ")}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{task.description}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {task.assignee || "Unassigned"}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Due {task.due_date || "-"}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {task.comment_count || 0} comments
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/projects/${id}/tasks/${task.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Kanban View */}
          <TabsContent value="kanban">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                <Card key={status}>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                      <span>{status.replace("_", " ").toUpperCase()}</span>
                      <Badge variant="secondary">{statusTasks.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {statusTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="p-3 hover:shadow-sm transition-shadow cursor-pointer"
                      >
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <div className="flex items-center justify-between">
                            <Badge
                              className={getPriorityColor(task.priority)}
                              variant="outline"
                            >
                              {task.priority}
                            </Badge>
                            <div className="flex items-center text-xs text-gray-500">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {task.comment_count || 0}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {task.assignee || "Unassigned"}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No tasks found matching your criteria.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate(`/projects/${id}/tasks/new`)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
