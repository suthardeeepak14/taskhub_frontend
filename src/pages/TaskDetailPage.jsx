import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import ProtectedRoute from "../components/ProtectedRoute";
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
import { Textarea } from "../ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Separator } from "../ui/Separator";
import {
  ArrowLeft,
  Calendar,
  User,
  MessageSquare,
  Edit,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../api";
export default function TaskDetailPage() {
  const { id, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        // Fetch task details
        const taskRes = await api.get(`/projects/${id}/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        });
        setTask(taskRes.data);

        // Fetch comments for this task
        const commentsRes = await api.get(
          `/projects/${id}/tasks/${taskId}/comments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
            },
          }
        );
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Failed to fetch task data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [id, taskId]);

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(
        `/projects/${id}/tasks/${taskId}`,
        {
          ...task,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        }
      );
      setTask((prev) => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };
  const handleDeleteTask = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(`/projects/${id}/tasks`);
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      await api.post(
        `/projects/${id}/tasks/${taskId}/comments`,
        {
          content: newComment,
          author: localStorage.getItem("username") || "Anonymous",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        }
      );
      const updatedComments = await api.get(
        `/projects/${id}/tasks/${taskId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        }
      );

      setComments(updatedComments.data);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
              <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      // </ProtectedRoute>
    );
  }

  if (!task) {
    return (
      // <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Task Not Found
            </h1>
            <Link to={`/projects/${id}/tasks`}>
              <Button>Back to Tasks</Button>
            </Link>
          </div>
        </div>
      </div>
      // </ProtectedRoute>
    );
  }

  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to={`/projects/${id}/tasks`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {task?.project?.name} Tasks
          </Link>

          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {task.title}
                </h1>
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace("_", " ")}
                </Badge>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority} priority
                </Badge>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Assigned by {task.assignee}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Due {task.due_date}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {comments.length} comments
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${id}/tasks/${taskId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={handleDeleteTask}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Task Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {task.description}
                </p>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle>Comments ({comments.length})</CardTitle>
                <CardDescription>
                  Discuss this task with your team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Existing Comments */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium">
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">
                                {comment.author}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(comment.created_at)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Add New Comment */}
                  <form onSubmit={handleAddComment} className="space-y-3">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <Button type="submit" disabled={!newComment.trim()}>
                      Add Comment
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Task Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 mb-2 block">
                    Change Status
                  </label>
                  <Select
                    value={task.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={task.status
                          .replace("_", " ")
                          .toUpperCase()}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Task Details */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Project
                  </label>
                  <p className="text-sm">{task.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Assignee
                  </label>
                  <p className="text-sm">{task.assignee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Priority
                  </label>
                  <div className="mt-1">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Due Date
                  </label>
                  <p className="text-sm">{task.due_date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Created
                  </label>
                  <p className="text-sm">{task.created_at}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Last Updated
                  </label>
                  <p className="text-sm">{task.updated_at}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
