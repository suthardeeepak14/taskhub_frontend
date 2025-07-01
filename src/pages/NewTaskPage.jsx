import { ArrowLeft } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Alert, AlertDescription } from "../ui/Alert";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { api } from "../api";

export default function NewTaskPage() {
  const { projectId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    status: "pending",
    assignee: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrors({ ...errors, title: "Title is required" });
      return;
    }

    setLoading(true);
    setErrors({});

    const payload = {
      title: formData.title,
      description: formData.description || null,
      priority: formData.priority,
      due_date: formData.due_date || null,
      status: formData.status,
      project_id: projectId ? projectId : null,
      assignee: formData.assignee || null,
    };

    console.log("Submitting payload:", payload);

    try {
      await api.post("/tasks", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
        },
      });

      if (projectId) {
        navigate(`/projects/${projectId}/tasks`);
      } else {
        navigate("/tasks");
      }
    } catch (error) {
      console.error("API error:", error);

      if (error.response && error.response.data && error.response.data.detail) {
        const errorData = error.response.data.detail;

        if (Array.isArray(errorData)) {
          const apiErrors = {};
          errorData.forEach((err) => {
            const field = err.loc[err.loc.length - 1];
            apiErrors[field] = err.msg;
          });
          setErrors(apiErrors);
        } else {
          setErrors({ form: errorData });
        }
      } else {
        setErrors({ form: "Network error occurred" });
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (projectId) {
      setFormData((prev) => ({ ...prev, project_id: projectId }));
    }
  }, [projectId]);
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to={projectId ? `/projects/${projectId}` : "/projects"}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {projectId ? "Back to Project" : "Back to Projects"}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create New Task
          </h1>
          <p className="text-gray-600">
            Set up a new task to start organizing your work
          </p>
        </div>

        <div className="max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
              <CardDescription>
                {projectId
                  ? "Add a new task to this project"
                  : "Create a new standalone task"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.form && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.form}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Task Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter task name"
                    className={errors.title ? "border-red-500" : ""}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Task Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    placeholder="Describe your task goals and objectives"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => handleChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          value={formData.priority}
                          placeholder="Select priority"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue
                          value={formData.status}
                          placeholder="Select status"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignee
                  </label>
                  <Input
                    type="text"
                    value={formData.assignee}
                    onChange={(e) => handleChange("assignee", e.target.value)}
                    placeholder="Enter assignee name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => handleChange("due_date", e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Task"}
                  </Button>
                  <Link to={projectId ? `/projects/${projectId}` : "/projects"}>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
