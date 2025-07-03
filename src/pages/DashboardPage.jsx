import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import {
  FolderKanban,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ListTodo,
  List,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api";
import { useTaskPermissions } from "../hooks/useTaskPermissions";

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get("/projects"),
          api.get("/tasks"),
        ]);

        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "on_hold":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const totalCompletedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const totalOverdueTasks = tasks.filter(
    (task) =>
      new Date(task.due_date) < new Date() && task.status !== "completed"
  ).length;

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Projects
              </CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Tasks
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              {/* You can filter and count active tasks */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Tasks
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompletedTasks}</div>
              {/* Same for completed tasks */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overdue Tasks
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {totalOverdueTasks}
              </div>
              {/* Same for overdue */}
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Your latest project activity</CardDescription>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Link to="/projects/new">
                {["admin", "user"].includes(user?.role) && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                )}
              </Link>

              <Link to="/projects">
                <Button size="sm" variant="outline">
                  <List className="h-4 w-4 mr-2" />
                  View All Projects
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects
                  .slice(-3)
                  .reverse()
                  .map((project) => (
                    <Link key={project.id} to={`/projects/${project.id}`}>
                      <div className="flex items-center justify-between p-4 border rounded-lg mb-2">
                        <div>
                          <h3 className="font-medium">{project.name}</h3>
                          <p className="text-sm text-gray-600">
                            {project.tasks?.length || 0} tasks • Due{" "}
                            {project.due_date}
                          </p>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="text-gray-500">No recent projects found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your latest task updates</CardDescription>
            </div>
            <Link to="/tasks">
              <Button size="sm" variant="outline">
                <ListTodo className="h-4 w-4 mr-2" />
                View All Tasks
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.length > 0 ? (
                tasks
                  .slice(-3)
                  .reverse()
                  .map((task) => (
                    <Link
                      key={task.id}
                      to={`/projects/${task.project_id}/tasks/${task.id}`}
                    >
                      <div className="flex items-center justify-between p-4 border rounded-lg mb-2">
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-600">
                            Priority: {task.priority}
                          </p>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="text-gray-500">No recent tasks found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
