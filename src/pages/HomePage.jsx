import { Button } from "../ui/Button"
import { FolderKanban, CheckCircle, MessageSquare } from "lucide-react"
import { Link } from "react-router-dom"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <FolderKanban className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ProjectHub</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your project management with our modern, intuitive platform. Organize projects, track tasks, and
            collaborate seamlessly.
          </p>
          <div className="space-x-4">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <FolderKanban className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Project Management</h3>
            <p className="text-gray-600">
              Create and organize projects with detailed descriptions, deadlines, and team assignments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Task Tracking</h3>
            <p className="text-gray-600">
              Break down projects into manageable tasks with priorities, assignees, and status tracking.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">Communicate effectively with task comments and real-time project updates.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
