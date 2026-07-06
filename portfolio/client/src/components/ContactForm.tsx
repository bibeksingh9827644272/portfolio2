import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Mail, Phone, MessageSquare, User } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMutation = trpc.portfolio.submitContactMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message. Please try again.");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
              <User size={16} className="text-primary" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              minLength={2}
              className="w-full bg-background border-0 rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
              <Mail size={16} className="text-primary" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
              className="w-full bg-background border-0 rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Phone Field */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
              <Phone size={16} className="text-primary" />
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="w-full bg-background border-0 rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Subject Field */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
              <MessageSquare size={16} className="text-primary" />
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              required
              minLength={5}
              className="w-full bg-background border-0 rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Message Field */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all duration-300">
            <label className="flex items-center gap-2 text-sm font-medium mb-2 text-muted-foreground">
              <MessageSquare size={16} className="text-primary" />
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project or inquiry..."
              required
              minLength={10}
              rows={5}
              className="w-full bg-background border-0 rounded px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
          <Button
            type="submit"
            disabled={isSubmitting || submitMutation.isPending}
            className="relative w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || submitMutation.isPending ? "Sending..." : "Send Message"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          I'll get back to you within 24 hours. Thank you for reaching out!
        </p>
      </form>
    </div>
  );
}
