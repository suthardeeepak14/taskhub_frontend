import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { api } from "../api";
import { useAuth } from "../contexts/AuthContext";
import { useTaskPermissions } from "../hooks/useTaskPermissions";

export default function TaskDetailPage() {
  const { id, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const permissions = useTaskPermissions({ task, project });

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        // ✅ Fetch task
        const taskRes = await api.get(`/projects/${id}/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        });
        setTask(taskRes.data);

        // ✅ Fetch project (for role access)
        const projectRes = await api.get(`/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        });
        setProject(projectRes.data);

        // ✅ Fetch comments
        const commentsRes = await api.get(
          `/projects/${id}/tasks/${taskId}/comments`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
            },
          }
        );
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Error fetching task:", err);
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
        { ...task, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        }
      );
      setTask((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleDeleteTask = async () => {
    const confirm = window.confirm("Delete this task?");
    if (!confirm) return;

    try {
      await api.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
        },
      });
      navigate(`/projects/${id}/tasks`);
    } catch (err) {
      console.error("Error deleting task:", err);
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
          author: user?.username || "Anonymous",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        }
      );
      const updated = await api.get(
        `/projects/${id}/tasks/${taskId}/comments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
          },
        }
      );
      setComments(updated.data);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
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

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <div className="p-8">Loading...</div>;
  if (!task) return <div className="p-8 text-red-500">Task not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link
          to={`/projects/${id}/tasks`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {project?.name || "Project"} Tasks
        </Link>

        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
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
                Assigned to {task.assignee}
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
            {permissions.canEditTask && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/projects/${id}/tasks/${taskId}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {permissions.canDeleteTask && (
              <Button variant="outline" size="sm" onClick={handleDeleteTask}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>{task.description}</CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle>Comments ({comments.length})</CardTitle>
                <CardDescription>Task discussion</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {comments.map((c) => (
                  <div key={c.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {c.author?.[0]}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-sm">
                            {c.author}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(c.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{c.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <Separator />
                <form onSubmit={handleAddComment} className="space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <Button type="submit" disabled={!newComment.trim()}>
                    Add Comment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Task Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="block text-sm text-gray-600 mb-2">
                  Change Status
                </label>
                <Select value={task.status} onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={task.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle>Task Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="font-medium">Task</span>
                  <span>{task?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created By</span>
                  <span>{task.created_by || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Assignee</span>
                  <span>{task.assignee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Priority</span>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Due Date</span>
                  <span>{task.due_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Created At</span>
                  <span>{task.created_at}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Updated At</span>
                  <span>{task.updated_at}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
