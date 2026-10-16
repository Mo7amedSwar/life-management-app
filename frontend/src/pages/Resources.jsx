import React, { useState } from 'react'
import { ExternalLink, BookOpen, Monitor, Youtube, Globe, Star, Filter, Search } from 'lucide-react'

// ── All learning resources organized by category ─────────────────────────────
const RESOURCES = [
  // ── Phase 0 ────────────────────────────────────────────────────────────────
  {
    phase: 0, category: 'Tools', type: 'tool',
    title: 'Notion',
    description: 'Second Brain وتنظيم الخطة والملاحظات',
    url: 'https://notion.so', free: true, priority: 1,
  },
  {
    phase: 0, category: 'Tools', type: 'tool',
    title: 'Anki — Spaced Repetition',
    description: 'بطاقات اختيارية للمراجعة المتباعدة للمصطلحات والأوامر المهمة',
    url: 'https://apps.ankiweb.net', free: true, priority: 1,
  },
  {
    phase: 0, category: 'Books', type: 'book',
    title: 'Show Your Work — Austin Kleon',
    description: 'كيف تبني Personal Brand وانت بتتعلم',
    url: 'https://www.amazon.com/Show-Your-Work-Austin-Kleon/dp/076117897X', free: false, priority: 1,
  },
  {
    phase: 0, category: 'Books', type: 'book',
    title: 'The Personal MBA — Josh Kaufman',
    description: 'أساسيات Business وريادة الأعمال',
    url: 'https://personalmba.com', free: false, priority: 1,
  },
  {
    phase: 0, category: 'Books', type: 'book',
    title: 'Building a Second Brain — Tiago Forte',
    description: 'نظام إدارة المعرفة الشخصية',
    url: 'https://www.buildingasecondbrain.com', free: false, priority: 2,
  },

  // ── Phase 1: Linux ──────────────────────────────────────────────────────────
  {
    phase: 1, category: 'Linux', type: 'website',
    title: 'Linux Journey',
    description: 'أفضل موقع مجاني لتعلم Linux من الصفر',
    url: 'https://linuxjourney.com', free: true, priority: 1,
  },
  {
    phase: 1, category: 'Linux', type: 'book',
    title: 'The Linux Command Line — William Shotts',
    description: 'الكتاب المرجعي الأقوى للـ Linux (مجاني أونلاين)',
    url: 'https://linuxcommand.org/tlcl.php', free: true, priority: 1,
  },
  {
    phase: 1, category: 'Linux', type: 'youtube',
    title: 'NetworkChuck — Linux Playlist',
    description: 'شرح Linux بأسلوب ممتع ومبسّط',
    url: 'https://www.youtube.com/@NetworkChuck', free: true, priority: 2,
  },
  {
    phase: 1, category: 'Linux', type: 'youtube',
    title: 'محمد مجدي — DevOps Roadmap',
    description: 'شرح عربي للـ DevOps Roadmap خطوة بخطوة',
    url: 'https://www.youtube.com/@momagdyy', free: true, priority: 1,
  },

  // ── Phase 1: Python ─────────────────────────────────────────────────────────
  {
    phase: 1, category: 'Python', type: 'book',
    title: 'Automate the Boring Stuff — Al Sweigart',
    description: 'Python للـ Automation — مجاني أونلاين كامل',
    url: 'https://automatetheboringstuff.com', free: true, priority: 1,
  },
  {
    phase: 1, category: 'Python', type: 'website',
    title: 'Real Python',
    description: 'مقالات وتيوتوريالز Python احترافية',
    url: 'https://realpython.com', free: true, priority: 1,
  },
  {
    phase: 1, category: 'Python', type: 'website',
    title: 'Codewars',
    description: 'تمارين يومية بـ Python لتحسين المهارة',
    url: 'https://www.codewars.com', free: true, priority: 1,
  },

  // ── Phase 1: Git ────────────────────────────────────────────────────────────
  {
    phase: 1, category: 'Git', type: 'book',
    title: 'Pro Git Book (English)',
    description: 'الكتاب الرسمي لـ Git — مجاني أونلاين بالإنجليزية',
    url: 'https://git-scm.com/book/en/v2', free: true, priority: 1,
  },
  {
    phase: 1, category: 'Git', type: 'website',
    title: 'Learn Git Branching',
    description: 'تعلم Git بشكل تفاعلي وبصري رائع',
    url: 'https://learngitbranching.js.org', free: true, priority: 1,
  },

  // ── Phase 2: Docker ─────────────────────────────────────────────────────────
  {
    phase: 2, category: 'Docker', type: 'youtube',
    title: 'TechWorld with Nana — Docker',
    description: 'أفضل شرح لـ Docker على YouTube',
    url: 'https://www.youtube.com/@TechWorldwithNana', free: true, priority: 1,
  },
  {
    phase: 2, category: 'Docker', type: 'website',
    title: 'KodeKloud',
    description: 'منصة تدريب تفاعلية لـ DevOps (Docker, K8s, Ansible)',
    url: 'https://kodekloud.com', free: false, priority: 1,
  },
  {
    phase: 2, category: 'Docker', type: 'website',
    title: 'Play with Docker',
    description: 'بيئة Docker مجانية في المتصفح للتجربة',
    url: 'https://labs.play-with-docker.com', free: true, priority: 2,
  },

  // ── Phase 2: Cloud / AWS ────────────────────────────────────────────────────
  {
    phase: 2, category: 'Cloud', type: 'course',
    title: 'AWS Free Tier',
    description: 'حساب AWS مجاني للتجربة والمشاريع',
    url: 'https://aws.amazon.com/free', free: true, priority: 1,
  },
  {
    phase: 2, category: 'Cloud', type: 'course',
    title: 'Adrian Cantrill — AWS SAA',
    description: 'أقوى كورس لشهادة AWS Solutions Architect',
    url: 'https://learn.cantrill.io', free: false, priority: 1,
  },
  {
    phase: 2, category: 'Cloud', type: 'website',
    title: 'Tutorials Dojo',
    description: 'Practice Exams لشهادات AWS',
    url: 'https://tutorialsdojo.com', free: false, priority: 2,
  },
  {
    phase: 2, category: 'Cloud', type: 'youtube',
    title: 'CloudWithRaj',
    description: 'شرح Cloud وAWS بأسلوب عملي',
    url: 'https://www.youtube.com/@CloudWithRaj', free: true, priority: 2,
  },

  // ── Phase 2: Kubernetes ─────────────────────────────────────────────────────
  {
    phase: 2, category: 'Kubernetes', type: 'website',
    title: 'Kubernetes Official Docs',
    description: 'التوثيق الرسمي لـ Kubernetes',
    url: 'https://kubernetes.io/docs/home', free: true, priority: 1,
  },
  {
    phase: 2, category: 'Kubernetes', type: 'website',
    title: 'Play with Kubernetes',
    description: 'بيئة K8s مجانية في المتصفح',
    url: 'https://labs.play-with-k8s.com', free: true, priority: 2,
  },

  // ── Phase 3: AI / ML ────────────────────────────────────────────────────────
  {
    phase: 3, category: 'AI/ML', type: 'course',
    title: 'fast.ai — Practical Deep Learning',
    description: 'أفضل كورس AI مجاني على الإطلاق',
    url: 'https://course.fast.ai', free: true, priority: 1,
  },
  {
    phase: 3, category: 'AI/ML', type: 'course',
    title: 'DeepLearning.AI — Andrew Ng',
    description: 'Machine Learning Specialization المرجع الأساسي',
    url: 'https://www.deeplearning.ai', free: false, priority: 1,
  },
  {
    phase: 3, category: 'AI/ML', type: 'youtube',
    title: 'Andrej Karpathy',
    description: 'أعمق شرح لـ Neural Networks وLLMs على YouTube',
    url: 'https://www.youtube.com/@AndrejKarpathy', free: true, priority: 1,
  },
  {
    phase: 3, category: 'AI/ML', type: 'book',
    title: 'Hands-On ML — Aurélien Géron',
    description: 'الكتاب المرجعي العملي للـ Machine Learning',
    url: 'https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632', free: false, priority: 1,
  },
  {
    phase: 3, category: 'AI/ML', type: 'website',
    title: 'Kaggle',
    description: 'مسابقات ML + Datasets + Notebooks مجانية',
    url: 'https://www.kaggle.com', free: true, priority: 1,
  },
  {
    phase: 3, category: 'AI/ML', type: 'website',
    title: 'Hugging Face',
    description: 'مركز نماذج AI مفتوحة المصدر + كورسات مجانية',
    url: 'https://huggingface.co', free: true, priority: 1,
  },
  {
    phase: 3, category: 'AI/ML', type: 'course',
    title: 'DeepLearning.AI Short Courses',
    description: 'كورسات قصيرة مجانية (LangChain, RAG, Agents)',
    url: 'https://www.deeplearning.ai/short-courses', free: true, priority: 1,
  },
  {
    phase: 3, category: 'AI/ML', type: 'website',
    title: 'Gemini API Docs',
    description: 'التوثيق الرسمي لربط تطبيقاتك بنماذج Gemini',
    url: 'https://ai.google.dev/gemini-api/docs', free: true, priority: 1,
  },
  {
    phase: 3, category: 'AI/ML', type: 'website',
    title: 'n8n Documentation',
    description: 'التوثيق الرسمي لبناء workflows وwebhooks وربط الخدمات',
    url: 'https://docs.n8n.io/', free: true, priority: 1,
  },

  // ── Phase 3: MLOps ──────────────────────────────────────────────────────────
  {
    phase: 3, category: 'MLOps', type: 'website',
    title: 'Made With ML',
    description: 'أفضل مصدر لتعلم MLOps من الصفر',
    url: 'https://madewithml.com', free: true, priority: 1,
  },
  {
    phase: 3, category: 'MLOps', type: 'website',
    title: 'Full Stack Deep Learning',
    description: 'تعلم نشر نماذج AI في Production',
    url: 'https://fullstackdeeplearning.com', free: true, priority: 1,
  },
  {
    phase: 3, category: 'MLOps', type: 'website',
    title: 'MLflow Documentation',
    description: 'التوثيق الرسمي لـ MLflow',
    url: 'https://mlflow.org/docs/latest/index.html', free: true, priority: 2,
  },

  // ── Phase 4: CI/CD + IaC ────────────────────────────────────────────────────
  {
    phase: 4, category: 'CI/CD', type: 'website',
    title: 'GitHub Actions Docs',
    description: 'التوثيق الرسمي لـ GitHub Actions',
    url: 'https://docs.github.com/en/actions', free: true, priority: 1,
  },
  {
    phase: 4, category: 'IaC', type: 'website',
    title: 'HashiCorp Learn — Terraform',
    description: 'الطريق الرسمي لتعلم Terraform',
    url: 'https://developer.hashicorp.com/terraform/tutorials', free: true, priority: 1,
  },
  {
    phase: 4, category: 'IaC', type: 'website',
    title: 'Ansible Documentation',
    description: 'التوثيق الرسمي لـ Ansible',
    url: 'https://docs.ansible.com', free: true, priority: 1,
  },
  {
    phase: 4, category: 'Observability', type: 'website',
    title: 'Prometheus Docs',
    description: 'تعلم Monitoring مع Prometheus',
    url: 'https://prometheus.io/docs/introduction/overview', free: true, priority: 2,
  },

  // ── Business & Branding ─────────────────────────────────────────────────────
  {
    phase: -1, category: 'Business', type: 'youtube',
    title: 'Alex Hormozi',
    description: 'Business, Offers, Marketing — عملي جداً',
    url: 'https://www.youtube.com/@AlexHormozi', free: true, priority: 1,
  },
  {
    phase: -1, category: 'Business', type: 'youtube',
    title: 'Naval Ravikant (Podcast)',
    description: 'فلسفة Wealth وريادة الأعمال',
    url: 'https://nav.al', free: true, priority: 1,
  },
  {
    phase: -1, category: 'Business', type: 'website',
    title: "Lenny's Newsletter",
    description: 'Product, Growth, Marketing — الأفضل في مجاله',
    url: 'https://www.lennysnewsletter.com', free: true, priority: 2,
  },
  {
    phase: -1, category: 'Business', type: 'book',
    title: '$100M Offers — Alex Hormozi',
    description: 'كيف تبني Offer لا يمكن رفضها',
    url: 'https://www.acquisition.com/books', free: false, priority: 1,
  },
  {
    phase: -1, category: 'Business', type: 'book',
    title: 'Deep Work — Cal Newport',
    description: 'قواعد العمل العميق المركّز',
    url: 'https://calnewport.com/books/deep-work', free: false, priority: 1,
  },
  {
    phase: -1, category: 'Business', type: 'book',
    title: 'Zero to One — Peter Thiel',
    description: 'تفكير الـ Startup والابتكار الحقيقي',
    url: 'https://www.amazon.com/Zero-One-Notes-Startups-Future/dp/0804139296', free: false, priority: 1,
  },
  {
    phase: -1, category: 'Business', type: 'book',
    title: 'The Lean Startup — Eric Ries',
    description: 'بناء وتطوير Startup بطريقة علمية',
    url: 'https://theleanstartup.com', free: false, priority: 1,
  },
  {
    phase: 5, category: 'Content Writing', type: 'course',
    title: 'Google Technical Writing',
    description: 'دروس مجانية لكتابة توثيق ومحتوى تقني واضح',
    url: 'https://developers.google.com/tech-writing/one', free: true, priority: 1,
  },
  {
    phase: 5, category: 'Sales', type: 'course',
    title: 'HubSpot Academy — Inbound Sales',
    description: 'تدريب على فهم العميل ومحادثات البيع الاستشارية',
    url: 'https://academy.hubspot.com/courses/inbound-sales', free: true, priority: 1,
  },
  {
    phase: 5, category: 'Digital Marketing', type: 'course',
    title: 'Google Skillshop',
    description: 'تدريب على أدوات الإعلان والقياس الرقمي',
    url: 'https://skillshop.withgoogle.com/', free: true, priority: 1,
  },

  // ── General Dev Resources ───────────────────────────────────────────────────
  {
    phase: -1, category: 'General', type: 'website',
    title: 'roadmap.sh',
    description: 'خرائط تعلم لكل المجالات التقنية',
    url: 'https://roadmap.sh', free: true, priority: 1,
  },
  {
    phase: -1, category: 'General', type: 'website',
    title: 'Hashnode',
    description: 'ابدأ Blog تقني مجاناً وابنِ Personal Brand',
    url: 'https://hashnode.com', free: true, priority: 1,
  },
  {
    phase: -1, category: 'General', type: 'website',
    title: 'Medium',
    description: 'نشر مقالات تقنية وبناء جمهور',
    url: 'https://medium.com', free: true, priority: 2,
  },
  {
    phase: -1, category: 'General', type: 'tool',
    title: 'Google Colab',
    description: 'Jupyter Notebooks مجانية على Cloud لتجربة AI',
    url: 'https://colab.research.google.com', free: true, priority: 1,
  },
]

const TYPE_META = {
  youtube: { icon: '▶️', label: 'YouTube',  color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  book:    { icon: '📖', label: 'كتاب',     color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  course:  { icon: '🎓', label: 'كورس',     color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' },
  website: { icon: '🌐', label: 'موقع',     color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  tool:    { icon: '🛠️', label: 'أداة',     color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
}

const PHASE_NAMES = {
  0: 'Phase 0 — الأساس',
  1: 'Phase 1 — Linux + Python + Git',
  2: 'Phase 2 — Cloud + Docker + K8s',
  3: 'Phase 3 — AI/ML + MLOps',
  4: 'Phase 4 — CI/CD + IaC',
  5: 'Phase 5 — Integration + Brand + Leadership',
  [-1]: 'Business & عام',
}

const ALL_CATEGORIES = [...new Set(RESOURCES.map(r => r.category))]
const ALL_TYPES = [...new Set(RESOURCES.map(r => r.type))]

const ResourceCard = ({ resource }) => {
  const meta = TYPE_META[resource.type] || TYPE_META.website
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer"
      className="group card p-4 flex flex-col gap-2 hover:border-indigo-500/50 hover:bg-slate-800 transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${meta.color} text-xs`}>{meta.icon} {meta.label}</span>
          {resource.free
            ? <span className="badge bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">مجاني</span>
            : <span className="badge bg-slate-500/15 text-slate-400 border-slate-600/30 text-xs">مدفوع</span>}
          {resource.priority === 1 && <span className="badge bg-yellow-500/15 text-yellow-400 border-yellow-500/30 text-xs">⭐ أولوية</span>}
        </div>
        <ExternalLink size={14} className="text-slate-500 group-hover:text-indigo-400 flex-shrink-0 mt-0.5 transition-colors" />
      </div>
      <h3 className="text-white font-semibold text-sm leading-snug group-hover:text-indigo-300 transition-colors">
        {resource.title}
      </h3>
      <p className="text-slate-400 text-xs leading-relaxed">{resource.description}</p>
    </a>
  )
}

const Resources = () => {
  const [search, setSearch] = useState('')
  const [selectedPhase, setSelectedPhase] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [freeOnly, setFreeOnly] = useState(false)

  const filtered = RESOURCES.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.includes(search)
    const matchPhase  = selectedPhase === 'all' || String(r.phase) === selectedPhase
    const matchType   = selectedType  === 'all' || r.type === selectedType
    const matchFree   = !freeOnly || r.free
    return matchSearch && matchPhase && matchType && matchFree
  })

  const grouped = filtered.reduce((acc, r) => {
    const key = String(r.phase)
    if (!acc[key]) acc[key] = []
    acc[key].push(r)
    return acc
  }, {})

  const totalFree = RESOURCES.filter(r => r.free).length

  return (
    <div className="space-y-6 pb-mobile">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">📚 المصادر والمراجع</h1>
          <p className="text-slate-400 text-sm mt-1">{RESOURCES.length} مصدر — {totalFree} مجاني</p>
          <p className="text-slate-500 text-xs mt-2">المصادر اقتراحات حسب المرحلة، مش كورسات إلزامية لكل مهمة. اختار مصدرًا أساسيًا واحدًا وطبّق بإيدك.</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="card p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="ابحث في المصادر..."
            className="input pr-9" />
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2">
          {/* Phase filter */}
          <select value={selectedPhase} onChange={e => setSelectedPhase(e.target.value)}
            className="bg-slate-700 border border-slate-600 text-slate-200 text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500">
            <option value="all">كل المراحل</option>
            {Object.entries(PHASE_NAMES).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          {/* Type filter */}
          <div className="flex gap-1 flex-wrap">
            {[['all', 'الكل'], ...Object.entries(TYPE_META).map(([k, v]) => [k, v.label])].map(([key, label]) => (
              <button key={key} onClick={() => setSelectedType(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === key ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {key !== 'all' && TYPE_META[key]?.icon} {label}
              </button>
            ))}
          </div>

          {/* Free only toggle */}
          <button onClick={() => setFreeOnly(f => !f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${freeOnly ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-700 border-slate-600 text-slate-400'}`}>
            مجاني فقط
          </button>
        </div>

        <p className="text-slate-500 text-xs">{filtered.length} نتيجة</p>
      </div>

      {/* Results grouped by phase */}
      {Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).map(phaseKey => (
        <div key={phaseKey}>
          <h2 className="text-white font-bold mb-3 flex items-center gap-2">
            <span className="text-indigo-400 text-sm">
              {PHASE_NAMES[phaseKey] || `Phase ${phaseKey}`}
            </span>
            <span className="text-slate-600 text-xs font-normal">({grouped[phaseKey].length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {grouped[phaseKey].map((r, i) => <ResourceCard key={i} resource={r} />)}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 text-lg">لا توجد نتائج</p>
          <button onClick={() => { setSearch(''); setSelectedPhase('all'); setSelectedType('all'); setFreeOnly(false) }}
            className="text-indigo-400 text-sm mt-2 hover:underline">إلغاء الفلترة</button>
        </div>
      )}
    </div>
  )
}

export default Resources
