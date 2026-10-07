import React, { useState } from 'react'
import { Github, ExternalLink, Plus, CheckCircle2, Clock, Layers, Trash2, Tag } from 'lucide-react'

// The 13 projects from the roadmap — pre-loaded
const DEFAULT_PROJECTS = [
  {
    id: 1, phase: 0,
    title: 'My Learning OS',
    description: 'نظام إدارة المعرفة الشخصية في Notion — خريطة الخطتين + Daily Review + Skills Tracker',
    category: 'Business', status: 'not_started',
    skills: ['Notion', 'Productivity', 'Second Brain'],
    github: '', demo: '', notes: '',
  },
  {
    id: 2, phase: 1,
    title: 'Linux SysAdmin Toolkit',
    description: 'سكريبت Bash شامل: Backup Automation + System Health Monitor + Log Analyzer + User Management',
    category: 'DevOps', status: 'not_started',
    skills: ['Bash', 'Linux', 'Shell Scripting', 'Cron'],
    github: '', demo: '', notes: '',
  },
  {
    id: 3, phase: 1,
    title: 'DevOps Python CLI Tool',
    description: 'Python CLI: Server Status Checker + Auto Deploy Script + GitHub API Integration + Config Manager',
    category: 'DevOps', status: 'not_started',
    skills: ['Python', 'CLI', 'APIs', 'argparse'],
    github: '', demo: '', notes: '',
  },
  {
    id: 4, phase: 1,
    title: 'Open Source Contribution',
    description: 'PR حقيقي في Open Source project: Bug Fix أو Documentation أو Test Addition',
    category: 'DevOps', status: 'not_started',
    skills: ['Git', 'GitHub', 'Open Source'],
    github: '', demo: '', notes: '',
  },
  {
    id: 5, phase: 2,
    title: 'Containerized Microservices App',
    description: 'تطبيق Docker Compose: FastAPI backend + PostgreSQL + Nginx + Redis — منشور على DockerHub',
    category: 'DevOps', status: 'not_started',
    skills: ['Docker', 'Docker Compose', 'FastAPI', 'PostgreSQL', 'Nginx', 'Redis'],
    github: '', demo: '', notes: '',
  },
  {
    id: 6, phase: 2,
    title: 'AWS Cloud Infrastructure',
    description: 'بنية AWS كاملة: VPC + EC2 + Auto Scaling + RDS + S3 + Load Balancer مع Architecture Diagram',
    category: 'DevOps', status: 'not_started',
    skills: ['AWS', 'VPC', 'EC2', 'RDS', 'S3', 'CloudFormation'],
    github: '', demo: '', notes: '',
  },
  {
    id: 7, phase: 2,
    title: 'Kubernetes Deployment',
    description: 'Deploy مشروع ٥ على Kubernetes: Helm Chart + HPA + ConfigMaps + Secrets على EKS',
    category: 'DevOps', status: 'not_started',
    skills: ['Kubernetes', 'Helm', 'EKS', 'kubectl'],
    github: '', demo: '', notes: '',
  },
  {
    id: 8, phase: 3,
    title: 'End-to-End ML Project',
    description: 'ML Project كامل: EDA + Feature Engineering + XGBoost/NN + MLflow + FastAPI Deployment + Docker',
    category: 'AI/ML', status: 'not_started',
    skills: ['Python', 'Pandas', 'Scikit-learn', 'XGBoost', 'MLflow', 'FastAPI'],
    github: '', demo: '', notes: '',
  },
  {
    id: 9, phase: 3,
    title: 'RAG-powered AI Assistant',
    description: 'Chatbot بـ LangChain + ChromaDB + OpenAI/Ollama — deployed على AWS مع FastAPI backend',
    category: 'AI/ML', status: 'not_started',
    skills: ['LangChain', 'RAG', 'ChromaDB', 'LLMs', 'FastAPI', 'AWS'],
    github: '', demo: '', notes: '',
  },
  {
    id: 10, phase: 3,
    title: 'MLOps Pipeline',
    description: 'Pipeline كامل: Data Ingestion → Training → Evaluation → Deployment مع CI/CD + Monitoring',
    category: 'AI/ML', status: 'not_started',
    skills: ['MLflow', 'Airflow', 'GitHub Actions', 'Prometheus', 'Grafana'],
    github: '', demo: '', notes: '',
  },
  {
    id: 11, phase: 4,
    title: 'Full DevOps Pipeline',
    description: 'Pipeline احترافي: Terraform Infrastructure + Ansible Config + Jenkins/GH Actions + K8s + ELK',
    category: 'DevOps', status: 'not_started',
    skills: ['Terraform', 'Ansible', 'Jenkins', 'Kubernetes', 'Prometheus', 'ELK'],
    github: '', demo: '', notes: '',
  },
  {
    id: 12, phase: 4,
    title: 'Production MLOps Platform',
    description: 'Platform كامل للـ ML في Production: Terraform + Kubeflow + MLflow + Auto Retraining + Observability',
    category: 'AI/ML', status: 'not_started',
    skills: ['Kubeflow', 'Terraform', 'Kubernetes', 'MLflow', 'OpenTelemetry'],
    github: '', demo: '', notes: '',
  },
  {
    id: 13, phase: 5,
    title: 'SaaS AI MVP',
    description: 'SaaS حقيقي في مجال AI: Full Infrastructure + DevOps Pipeline + Business Model + Landing Page',
    category: 'Business', status: 'not_started',
    skills: ['Full Stack', 'AI', 'DevOps', 'Marketing', 'Business'],
    github: '', demo: '', notes: '',
  },
]

const STATUS = {
  not_started: { label: 'لم يبدأ',     color: 'text-slate-400',   bg: 'bg-slate-700',         dot: 'bg-slate-500' },
  in_progress: { label: 'قيد التنفيذ', color: 'text-amber-400',   bg: 'bg-amber-500/20',      dot: 'bg-amber-400 animate-pulse' },
  completed:   { label: 'مكتمل',       color: 'text-emerald-400', bg: 'bg-emerald-500/20',    dot: 'bg-emerald-400' },
  paused:      { label: 'متوقف',       color: 'text-orange-400',  bg: 'bg-orange-500/20',     dot: 'bg-orange-400' },
}

const PHASE_COLORS = ['purple', 'blue', 'cyan', 'emerald', 'orange', 'rose']
const PHASE_NAMES  = ['Phase 0','Phase 1','Phase 2','Phase 3','Phase 4','Phase 5']

const Projects = () => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects')
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS
  })
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [editNotes, setEditNotes] = useState({})

  const save = (updated) => {
    setProjects(updated)
    localStorage.setItem('projects', JSON.stringify(updated))
  }

  const updateProject = (id, patch) => {
    save(projects.map(p => p.id === id ? { ...p, ...patch } : p))
    if (selected?.id === id) setSelected(prev => ({ ...prev, ...patch }))
  }

  const filtered = projects.filter(p =>
    filter === 'all' ? true :
    filter === 'in_progress' ? p.status === 'in_progress' :
    filter === 'completed' ? p.status === 'completed' :
    String(p.phase) === filter
  )

  const stats = {
    total:       projects.length,
    done:        projects.filter(p => p.status === 'completed').length,
    in_progress: projects.filter(p => p.status === 'in_progress').length,
    not_started: projects.filter(p => p.status === 'not_started').length,
  }

  return (
    <div className="space-y-6 pb-mobile">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">🔨 المشاريع العملية</h1>
          <p className="text-slate-400 text-sm mt-1">١٣ مشروع يثبتون إنك تقيل في مجالك</p>
        </div>
        <div className="flex gap-3">
          {[
            { label: 'مكتمل',      value: stats.done,        color: 'text-emerald-400' },
            { label: 'قيد التنفيذ', value: stats.in_progress, color: 'text-amber-400' },
            { label: 'لم يبدأ',    value: stats.not_started, color: 'text-slate-400' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overall progress */}
      <div className="card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">التقدم الإجمالي</span>
          <span className="text-white font-bold">{stats.done}/{stats.total}</span>
        </div>
        <div className="bg-slate-700 rounded-full h-2.5">
          <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2.5 rounded-full transition-all duration-700"
            style={{ width: `${(stats.done / stats.total) * 100}%` }} />
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          ['all', 'الكل'], ['in_progress', '⏳ جاري'], ['completed', '✅ منجز'],
          ...PHASE_NAMES.map((n, i) => [String(i), n])
        ].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === key ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(p => {
          const st = STATUS[p.status]
          const phColor = PHASE_COLORS[p.phase]
          return (
            <div key={p.id}
              className={`card p-4 cursor-pointer hover:border-indigo-500/50 transition-all ${selected?.id === p.id ? 'border-indigo-500 ring-1 ring-indigo-500/30' : ''}`}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}>

              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 text-xs font-medium">{PHASE_NAMES[p.phase]}</span>
                  <span className={`badge ${st.bg} ${st.color} border-transparent text-xs flex items-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>
                <span className={`text-xs font-black text-${phColor}-400`}>#{p.id}</span>
              </div>

              <h3 className="text-white font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">{p.description}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mb-3">
                {p.skills.slice(0, 4).map(s => (
                  <span key={s} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>
                ))}
                {p.skills.length > 4 && <span className="text-xs text-slate-500">+{p.skills.length - 4}</span>}
              </div>

              {/* Status selector */}
              <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                {Object.entries(STATUS).map(([key, s]) => (
                  <button key={key} onClick={() => updateProject(p.id, { status: key })}
                    className={`flex-1 py-1 rounded-lg text-xs transition-all ${p.status === key ? `${s.bg} ${s.color} font-medium` : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Links */}
              {(p.github || p.demo) && (
                <div className="flex gap-2 mt-2" onClick={e => e.stopPropagation()}>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                      <Github size={12} /> GitHub
                    </a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors">
                      <ExternalLink size={12} /> Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Detail Panel */}
      {selected && (
        <div className="card p-5 border-indigo-500/40 animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-white font-bold text-lg">{selected.title}</h2>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-4">{selected.description}</p>

          {/* All Skills */}
          <div className="mb-4">
            <div className="text-slate-400 text-xs font-medium mb-2 flex items-center gap-1"><Tag size={12}/> المهارات</div>
            <div className="flex flex-wrap gap-1.5">
              {selected.skills.map(s => (
                <span key={s} className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          </div>

          {/* Links inputs */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-slate-400 text-xs mb-1 block flex items-center gap-1"><Github size={12}/> GitHub URL</label>
              <input value={selected.github} onChange={e => updateProject(selected.id, { github: e.target.value })}
                placeholder="https://github.com/..."
                className="input text-xs" />
            </div>
            <div>
              <label className="text-slate-400 text-xs mb-1 block flex items-center gap-1"><ExternalLink size={12}/> Demo URL</label>
              <input value={selected.demo} onChange={e => updateProject(selected.id, { demo: e.target.value })}
                placeholder="https://..."
                className="input text-xs" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-slate-400 text-xs mb-1 block">ملاحظات وتقدم المشروع</label>
            <textarea value={selected.notes}
              onChange={e => updateProject(selected.id, { notes: e.target.value })}
              placeholder="اكتب تقدمك في المشروع، الأفكار، المشاكل اللي واجهتها..."
              rows={4}
              className="input text-xs resize-none" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
