import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Code2, ExternalLink, Github, Linkedin, Mail, Menu, X, Moon, Sun, Download, Briefcase, Award, Award as Certificate, Play, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import ContactForm from "@/components/ContactForm";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663767453977/2Y85oEFguc7wWQDfL5NSrd/bibek-logo-AqLB6ohaDHHNm97xhu7LtT.webp";

/**
 * Dynamic Portfolio Website - Bibek Kumar Mahato
 * Design: Modern Minimalist with Dark/Light Mode
 * Features: Responsive, Animations, Dark/Light Toggle, Contact Integration
 * Data: Fetched from database via tRPC
 */

export default function Home() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fetch portfolio data
  const aboutQuery = trpc.portfolio.getAbout.useQuery();
  const projectsQuery = trpc.portfolio.getProjects.useQuery();
  const skillsQuery = trpc.portfolio.getSkills.useQuery();
  const experienceQuery = trpc.portfolio.getExperience.useQuery();
  const certificationsQuery = trpc.portfolio.getCertifications.useQuery();
  const socialQuery = trpc.portfolio.getSocial.useQuery();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const about = aboutQuery.data;
  const projects = projectsQuery.data || [];
  const skills = skillsQuery.data || [];
  const experience = experienceQuery.data || [];
  const certifications = certificationsQuery.data || [];
  const socialLinks = socialQuery.data || [];

  const youtubeLink = socialLinks.find(s => s.platform === 'YouTube');

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="BK Logo" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline">Bibek</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 items-center">
              <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors">About</button>
              <button onClick={() => scrollToSection('skills')} className="hover:text-primary transition-colors">Skills</button>
              <button onClick={() => scrollToSection('projects')} className="hover:text-primary transition-colors">Projects</button>
              <button onClick={() => scrollToSection('certifications')} className="hover:text-primary transition-colors">Certifications</button>
              <button onClick={() => scrollToSection('resume')} className="hover:text-primary transition-colors">Resume</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-primary transition-colors">Contact</button>
              {user?.role === 'admin' && (
                <Button variant="outline" size="sm" onClick={() => setLocation('/admin')}>
                  Admin
                </Button>
              )}
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-3 animate-in fade-in slide-in-from-top-2">
              <button onClick={() => scrollToSection('about')} className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg transition-colors">About</button>
              <button onClick={() => scrollToSection('skills')} className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg transition-colors">Skills</button>
              <button onClick={() => scrollToSection('projects')} className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg transition-colors">Projects</button>
              <button onClick={() => scrollToSection('certifications')} className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg transition-colors">Certifications</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-4 py-2 hover:bg-secondary rounded-lg transition-colors">Contact</button>
              {user?.role === 'admin' && (
                <Button variant="outline" className="w-full" onClick={() => setLocation('/admin')}>
                  Admin Panel
                </Button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
                <div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-4">
                    Hi, I'm <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Bibek</span>
                  </h1>
                  <p className="text-2xl text-muted-foreground font-medium">Data Analyst</p>
                </div>
                
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  I am a Data Analyst and Full Stack Developer passionate about transforming raw data into actionable insights. I specialize in statistical analysis, data visualization, and creating data-driven solutions that drive business decisions.
                </p>

                <div className="flex gap-4 flex-wrap">
                  <Button onClick={() => scrollToSection('contact')} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg transition-all hover:shadow-lg">
                    Get In Touch
                  </Button>
                  <Button variant="outline" className="px-8 py-6 text-lg rounded-lg border-2 hover:bg-secondary transition-all">
                    <Download size={20} className="mr-2" />
                    Resume
                  </Button>
                </div>

                <div className="flex gap-4 pt-4">
                  {about?.github && (
                    <a href={about.github} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                      <Github size={24} />
                    </a>
                  )}
                  {about?.linkedin && (
                    <a href={about.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                      <Linkedin size={24} />
                    </a>
                  )}
                  {about?.email && (
                    <a href={`mailto:${about.email}`} className="p-3 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                      <Mail size={24} />
                    </a>
                  )}
                  {youtubeLink && (
                    <a href={youtubeLink.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-all">
                      <Play size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Image */}
            <div className="order-1 md:order-2 flex justify-center animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
                {about?.profileImageUrl && (
                  <img
                    src={about.profileImageUrl}
                    alt="Bibek Kumar Mahato"
                    className="relative w-full h-full rounded-full object-cover shadow-2xl border-4 border-primary/20 hover:border-primary/50 transition-all duration-300"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {about?.bio && <p className="text-lg text-muted-foreground leading-relaxed">{about.bio}</p>}
              {about?.education && <p className="text-lg text-muted-foreground leading-relaxed">{about.education}</p>}
              <p className="text-lg text-muted-foreground leading-relaxed">
                I'm always eager to learn, collaborate, and take on new challenges as I work toward becoming a skilled data scientist who develops innovative and impactful solutions.
              </p>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="text-primary" size={24} />
                  Education
                </h3>
                <p className="text-muted-foreground">Computer Science & Engineering Student</p>
                <p className="text-sm text-muted-foreground mt-2">Specialized in Data Science and Machine Learning</p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="text-accent" size={24} />
                  Interests
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  {about?.interests?.map((interest) => (
                    <li key={interest}>• {interest}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Technical Skills</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {skills.map((skillGroup, idx) => (
              <div key={skillGroup.id} className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:border-primary transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                <h3 className="text-xl font-bold mb-4 text-primary">{skillGroup.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <div key={project.id} className="group p-6 rounded-lg bg-card border border-border hover:shadow-xl hover:border-primary transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium">
                    View on GitHub <ExternalLink size={18} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Certifications</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {certifications.length > 0 ? (
              certifications.map((cert, idx) => (
                <div key={cert.id} className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:border-primary transition-all duration-300 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex items-start gap-4">
                    <Certificate className="text-primary flex-shrink-0 mt-1" size={24} />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">{cert.name}</h3>
                      <p className="text-muted-foreground mb-2">{cert.issuer}</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </p>
                      {cert.credentialUrl && (
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium text-sm">
                          View Credential <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No certifications yet</p>
            )}
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">My Resume</h2>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            Download my professional resume to learn more about my experience, skills, and achievements.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/manus-storage/Professional_Resume_BibekMahato(1)_3d41e87e.pdf" download className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium text-lg">
              <Download size={24} />
              Download Resume (PDF)
            </a>
            <a href="/manus-storage/Professional_Resume_BibekMahato(1)_3d41e87e.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-all font-medium text-lg border border-border">
              <ExternalLink size={24} />
              View Resume
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            I'm always interested in hearing about new projects and opportunities. Whether you have a question or just want to say hello, feel free to reach out!
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {about?.email && (
              <a href={`mailto:${about.email}`} className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:border-primary transition-all group">
                <Mail className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground break-all">{about.email}</p>
              </a>
            )}
            {about?.github && (
              <a href={about.github} target="_blank" rel="noopener noreferrer" className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:border-primary transition-all group">
                <Github className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">GitHub</h3>
                <p className="text-sm text-muted-foreground">@bibeksingh9827644272</p>
              </a>
            )}
            {about?.linkedin && (
              <a href={about.linkedin} target="_blank" rel="noopener noreferrer" className="p-6 rounded-lg bg-card border border-border hover:shadow-lg hover:border-primary transition-all group">
                <Linkedin className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="font-bold mb-2">LinkedIn</h3>
                <p className="text-sm text-muted-foreground">Bibek Kumar Mahato</p>
              </a>
            )}
          </div>

          {youtubeLink && (
            <div className="mb-8">
              <a href={youtubeLink.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium">
                <Play size={20} />
                Subscribe on YouTube
              </a>
            </div>
          )}

          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border bg-secondary/30">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>© 2024 Bibek Kumar Mahato. All rights reserved.</p>
          <p className="text-sm mt-2">Crafted with passion and data-driven insights ✨</p>
        </div>
      </footer>
    </div>
  );
}
