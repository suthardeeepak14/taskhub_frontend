import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute"
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
import ProgressBar from "../ui/Progressbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { ArrowLeft, Calendar, Users, Edit, Trash2, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Link } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { SearchableMultiSelect } from "../ui/SearchableMultiSelect";
export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMembers, setNewMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchProject = useCallback(async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      const data = res.data;

      // Force members to be an array
      data.members = Array.isArray(data.members) ? data.members : [];

      setProject(data);
    } catch (err) {
      console.error("Failed to load project:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    console.log("✅ project.members:", project?.members);
  }, [project]);

  useEffect(() => {
    api
      .get("/users")
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  const handleAddMembers = async () => {
    // Combine existing and new members, remove duplicates
    const updatedMembers = Array.from(
      new Set([...project.members, ...newMembers])
    );

    try {
      await api.put(`/projects/${id}/members`, { members: updatedMembers });

      setNewMembers([]);
      fetchProject(); // Refresh with updated members
    } catch (err) {
      console.error("Failed to update members:", err);
      alert("Error updating members");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project. Please try again.");
    }
  };

  if (loading) {
    return (
      // <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      // </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      // <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Project Not Found
            </h1>
            <Link to="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </div>
      </div>
      // </ProtectedRoute>
    );
  }

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

  const completedTasks = project?.tasks
    ? project.tasks.filter((task) => task.status === "completed").length
    : 0;

  const totalTasks = project?.tasks ? project.tasks.length : 0;

  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const displayOwner = project.owners;
  const displayCreatedAt = project.created_at;
  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/projects"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {project.name}
                </h1>
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace("_", " ") || "N/A"}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due {project.due_date}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {project.members?.length || 0} members
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {(user?.role === "admin" ||
                project.owners.includes(user.username)) && (
                <Link to={`/projects/${id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
              )}
              {(user?.role === "admin" ||
                project.owners.includes(user.username)) && (
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">
                  {/* <Link to={`/projects/${project.id}/tasks`} className="flex-1"> */}
                  {/* </Link> */}
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Progress</CardTitle>
                    <CardDescription>
                      Track the overall completion of your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Overall Progress</span>
                          <span>{progressPercentage}%</span>
                        </div>
                        <ProgressBar value={progressPercentage} />
                        <div className="text-xs text-gray-500 mt-1">
                          {completedTasks} of {totalTasks} tasks completed
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {totalTasks}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Tasks
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {completedTasks}
                          </div>
                          <div className="text-sm text-gray-600">Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {totalTasks - completedTasks}
                          </div>
                          <div className="text-sm text-gray-600">Remaining</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tasks">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Project Tasks</CardTitle>
                      <CardDescription>
                        Manage and track all project tasks
                      </CardDescription>
                    </div>

                    {/* Always show "New Task" button */}
                    <Link to={`/projects/${project.id}/tasks/new`}>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Task
                      </Button>
                    </Link>
                  </CardHeader>

                  <CardContent>
                    {project?.tasks?.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                          No tasks found for this project.
                        </p>
                        <Link to={`/projects/${project.id}/tasks/new`}>
                          <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Create your first task
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {project?.tasks?.map((task) => (
                          <Link
                            key={task.id}
                            to={`/projects/${project.id}/tasks/${task.id}`}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-100 transition"
                          >
                            <div className="flex-1">
                              <h3 className="font-medium">{task.title}</h3>
                              <p className="text-sm text-gray-600">
                                Assigned to {task.assignee}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                              <Badge variant="outline">
                                {task.status.replace("_", " ")}
                              </Badge>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates and changes to this project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm">
                            <strong>Jane Smith</strong> completed task "Create
                            wireframes"
                          </p>
                          <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm">
                            <strong>Mike Johnson</strong> started working on
                            "Implement responsive navigation"
                          </p>
                          <p className="text-xs text-gray-500">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <p className="text-sm">
                            <strong>Sarah Wilson</strong> added a comment to
                            "Database schema design"
                          </p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Owner
                  </label>
                  <p className="text-sm">{displayOwner}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Created
                  </label>
                  <p className="text-sm">{displayCreatedAt}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Due Date
                  </label>
                  <p className="text-sm">{project.due_date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Status
                  </label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(user?.role === "admin" ||
              project.owners.includes(user.username)) && (
              <>
                {/* Project Actions - Change Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Project Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <label className="text-sm font-medium text-gray-600 mb-2 block">
                        Change Project Status
                      </label>
                      <Select
                        value={project.status}
                        onValueChange={async (newStatus) => {
                          try {
                            await api.put(
                              `/projects/${id}`,
                              {
                                name: project.name,
                                description: project.description,
                                due_date: project.due_date,
                                status: newStatus, // ← only send expected fields
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                  )}`,
                                },
                              }
                            );

                            setProject((prev) => ({
                              ...prev,
                              status: newStatus,
                            }));
                          } catch (error) {
                            console.error(
                              "Failed to update project status:",
                              error
                            );
                            alert("Failed to update status");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select status"
                            value={project.status}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                {/* ✅ Always show current members */}
                {project.members.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium mb-1 text-gray-700">
                      Current Team Members
                    </h4>
                    {project.members.map((username, idx) => {
                      const member = allUsers.find(
                        (u) => u.username === username
                      );

                      return (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                            <span className="font-medium">
                              {(member?.username || username)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">
                              {member?.full_name || username}
                            </span>
                            <span className="text-xs text-gray-500">
                              {member?.email || ""}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {(user?.role === "admin" ||
                  project.owners.includes(user.username)) && (
                  <>
                    {/* Chips for selected members */}
                    {newMembers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {newMembers.map((username) => (
                          <span
                            key={username}
                            className="bg-primary/10 text-sm px-2 py-1 rounded flex items-center space-x-1"
                          >
                            <span>{username}</span>
                            <button
                              onClick={() =>
                                setNewMembers(
                                  newMembers.filter((u) => u !== username)
                                )
                              }
                              className="ml-1 text-xs text-gray-500 hover:text-red-500"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Multi-select input */}
                    <SearchableMultiSelect
                      options={allUsers}
                      selected={newMembers}
                      onChange={setNewMembers}
                    />

                    <Button
                      variant="outline"
                      className="w-full mt-3"
                      onClick={handleAddMembers}
                      disabled={newMembers.length === 0}
                    >
                      <Plus className="mr-1" /> Save Members
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
