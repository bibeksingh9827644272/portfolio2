import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Save } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("about");

  // Queries
  const aboutQuery = trpc.portfolio.getAbout.useQuery();
  const projectsQuery = trpc.portfolio.getProjects.useQuery();
  const skillsQuery = trpc.portfolio.getSkills.useQuery();
  const experienceQuery = trpc.portfolio.getExperience.useQuery();

  // Mutations
  const updateAboutMutation = trpc.portfolio.updateAbout.useMutation();
  const createProjectMutation = trpc.portfolio.createProject.useMutation();
  const updateProjectMutation = trpc.portfolio.updateProject.useMutation();
  const deleteProjectMutation = trpc.portfolio.deleteProject.useMutation();
  const updateSkillsMutation = trpc.portfolio.updateSkills.useMutation();
  const createExperienceMutation = trpc.portfolio.createExperience.useMutation();
  const updateExperienceMutation = trpc.portfolio.updateExperience.useMutation();
  const deleteExperienceMutation = trpc.portfolio.deleteExperience.useMutation();

  // State for forms
  const [aboutForm, setAboutForm] = useState({
    bio: aboutQuery.data?.bio || "",
    education: aboutQuery.data?.education || "",
    interests: aboutQuery.data?.interests?.join(", ") || "",
    email: aboutQuery.data?.email || "",
    github: aboutQuery.data?.github || "",
    linkedin: aboutQuery.data?.linkedin || "",
  });

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    imageUrl: "",
    projectUrl: "",
    githubUrl: "",
  });

  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    description: "",
    startDate: "",
    endDate: "",
    current: false,
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleUpdateAbout = async () => {
    try {
      await updateAboutMutation.mutateAsync({
        bio: aboutForm.bio,
        education: aboutForm.education,
        interests: aboutForm.interests.split(",").map(i => i.trim()),
        email: aboutForm.email,
        github: aboutForm.github,
        linkedin: aboutForm.linkedin,
      });
      toast.success("About section updated!");
      aboutQuery.refetch();
    } catch (error) {
      toast.error("Failed to update about section");
    }
  };

  const handleCreateProject = async () => {
    try {
      await createProjectMutation.mutateAsync({
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies.split(",").map(t => t.trim()),
        imageUrl: newProject.imageUrl || undefined,
        projectUrl: newProject.projectUrl || undefined,
        githubUrl: newProject.githubUrl || undefined,
      });
      toast.success("Project created!");
      setNewProject({ title: "", description: "", technologies: "", imageUrl: "", projectUrl: "", githubUrl: "" });
      projectsQuery.refetch();
    } catch (error) {
      toast.error("Failed to create project");
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProjectMutation.mutateAsync({ id });
      toast.success("Project deleted!");
      projectsQuery.refetch();
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleCreateExperience = async () => {
    try {
      await createExperienceMutation.mutateAsync({
        title: newExperience.title,
        company: newExperience.company,
        description: newExperience.description,
        startDate: new Date(newExperience.startDate),
        endDate: newExperience.endDate ? new Date(newExperience.endDate) : undefined,
        current: newExperience.current ? 1 : 0,
      });
      toast.success("Experience added!");
      setNewExperience({ title: "", company: "", description: "", startDate: "", endDate: "", current: false });
      experienceQuery.refetch();
    } catch (error) {
      toast.error("Failed to add experience");
    }
  };

  const handleDeleteExperience = async (id: number) => {
    try {
      await deleteExperienceMutation.mutateAsync({ id });
      toast.success("Experience deleted!");
      experienceQuery.refetch();
    } catch (error) {
      toast.error("Failed to delete experience");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Portfolio Admin Panel</h1>
          <p className="text-muted-foreground">Manage your portfolio content dynamically</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Update your bio, education, and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bio</label>
                  <Textarea
                    value={aboutForm.bio}
                    onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                    placeholder="Your bio..."
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Education</label>
                  <Textarea
                    value={aboutForm.education}
                    onChange={(e) => setAboutForm({ ...aboutForm, education: e.target.value })}
                    placeholder="Your education..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Interests (comma-separated)</label>
                  <Input
                    value={aboutForm.interests}
                    onChange={(e) => setAboutForm({ ...aboutForm, interests: e.target.value })}
                    placeholder="Web Development, AI, Open Source"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      value={aboutForm.email}
                      onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })}
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GitHub</label>
                    <Input
                      value={aboutForm.github}
                      onChange={(e) => setAboutForm({ ...aboutForm, github: e.target.value })}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">LinkedIn</label>
                  <Input
                    value={aboutForm.linkedin}
                    onChange={(e) => setAboutForm({ ...aboutForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <Button onClick={handleUpdateAbout} disabled={updateAboutMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Project title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                />
                <Textarea
                  placeholder="Project description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  rows={3}
                />
                <Input
                  placeholder="Technologies (comma-separated)"
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                />
                <Input
                  placeholder="Image URL"
                  value={newProject.imageUrl}
                  onChange={(e) => setNewProject({ ...newProject, imageUrl: e.target.value })}
                />
                <Input
                  placeholder="Project URL"
                  value={newProject.projectUrl}
                  onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })}
                />
                <Input
                  placeholder="GitHub URL"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                />
                <Button onClick={handleCreateProject} disabled={createProjectMutation.isPending}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Your Projects</h3>
              {projectsQuery.data?.map((project) => (
                <Card key={project.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex gap-2 mt-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="px-2 py-1 bg-secondary text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
                <CardDescription>Your skills are displayed from the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skillsQuery.data?.map((skillGroup) => (
                    <div key={skillGroup.id} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{skillGroup.category}</h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Job title"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                />
                <Input
                  placeholder="Company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                />
                <Textarea
                  placeholder="Description"
                  value={newExperience.description}
                  onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={newExperience.startDate}
                      onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={newExperience.endDate}
                      onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                      disabled={newExperience.current}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newExperience.current}
                    onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                  />
                  <span className="text-sm">Currently working here</span>
                </label>
                <Button onClick={handleCreateExperience} disabled={createExperienceMutation.isPending}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Your Experience</h3>
              {experienceQuery.data?.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <p className="text-sm mt-2">{exp.description}</p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
