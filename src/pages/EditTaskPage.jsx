import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { Input } from "../ui/input";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import Navbar from "../components/Navbar";

export default function EditTaskPage() {
  const { id, taskId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignee: "",
    due_date: "",
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await api.get(`/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data;
        setFormData({
          title: data.title ?? "",
          description: data.description ?? "",
          status: data.status ?? "",
          priority: data.priority ?? "",
          assignee: data.assignee ?? "",
          due_date: data.due_date ?? "",
        });
      } catch (error) {
        console.error("Failed to fetch task:", error);
      }
    };

    fetchTask();
  }, [id, taskId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value) => {
    setFormData({ ...formData, status: value });
  };

  const handlePriorityChange = (value) => {
    setFormData({ ...formData, priority: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/tasks/${taskId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("taskhub_token")}`,
        },
      });
      navigate(`/projects/${id}/tasks`);
    } catch (error) {
      console.error(
        "Failed to update task:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue
                  value={
                    formData.status === "pending"
                      ? "Pending"
                      : formData.status === "in_progress"
                      ? "In Progress"
                      : formData.status === "completed"
                      ? "Completed"
                      : formData.status === "blocked"
                  }
                  placeholder="Select status"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <Select
              value={formData.priority}
              onValueChange={handlePriorityChange}
            >
              <SelectTrigger>
                <SelectValue
                  value={
                    formData.priority === "high"
                      ? "High"
                      : formData.priority === "medium"
                      ? "Medium"
                      : formData.priority === "low"
                      ? "Low"
                      : ""
                  }
                  placeholder="Select priority"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <Input
              type="text"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              placeholder="Enter assignee name"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <Input
              type="date"
              name="due_date"
              value={formData.due_date || ""}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
}
