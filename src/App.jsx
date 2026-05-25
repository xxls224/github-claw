import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  Brain,
  CalendarCheck,
  Crown,
  Cuboid,
  Menu,
  MessageCircle,
  MapPin,
  PenTool,
  Search,
  Sparkles,
  X,
} from 'lucide-react'

const FaqSection = lazy(() => import('./sections/FaqSection'))
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'))

const WECHAT_LINK = 'https://weixin.qq.com/r/your-wechat-link'
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/yourFormId'

const navLinks = [
  { id: 'courses', label: '课程' },
  { id: 'results', label: '成果' },
  { id: 'booking', label: '预约' },
]

const heroHighlights = [
  { icon: Brain, text: '专注5-15岁孩子思维能力培养' },
  { icon: Sparkles, text: '独创“三维一体”教学体系' },
  { icon: MapPin, text: '广州天河区上门/工作室教学' },
]

const heroCards = [
  { label: '本月名额', value: '每周仅接 8 位学生', note: '先到先安排' },
  { label: '服务时间', value: '工作日 17:30-21:30', note: '周末 8:30-18:30' },
  { label: '授课形式', value: '上门/工作室一对一', note: '天河区覆盖，可协商' },
]

const courses = [
  {
    icon: BookOpen,
    title: '英语思维课程',
    age: '适合5-15岁',
    description: '打破传统死记硬背，培养英语思维，提升听说读写综合能力。',
    tags: ['全英文环境', '互动式教学', '原版教材'],
  },
  {
    icon: PenTool,
    title: '书法思维课程',
    age: '适合5-15岁',
    description: '修身养性，锻炼专注力和耐心，写出一手好字。',
    tags: ['硬笔+软笔', '手把手指导', '作品创作'],
  },
  {
    icon: Crown,
    title: '象棋思维课程',
    age: '适合6-15岁',
    description: '智慧的体操，培养逻辑思维、大局观和抗挫折能力。',
    tags: ['从入门到精通', '大量实战', '复盘分析'],
  },
  {
    icon: Cuboid,
    title: '魔方思维课程',
    age: '适合5-15岁',
    description: '提升空间想象力、记忆力和手眼协调能力。',
    tags: ['简单易懂', '快速入门', '竞速训练'],
  },
]

const pricingRows = [
  { type: '英语课程', studio: '120元/小时', home: '150元/小时' },
  { type: '书法/象棋/魔方', studio: '110元/小时', home: '140元/小时' },
]

const discountList = ['10课时：95折', '20课时：9折', '30课时：85折']

const stats = [
  { value: '3000+', label: '累计教学时长' },
  { value: '200+', label: '帮助过的学生' },
  { value: '98%', label: '家长满意度' },
  { value: '95%', label: '学生进步率' },
]

const steps = [
  {
    icon: MessageCircle,
    title: '微信咨询',
    description: '添加微信，沟通孩子基本情况。',
  },
  {
    icon: Search,
    title: '免费诊断',
    description: '15分钟线上学情诊断，评估现有水平。',
  },
  {
    icon: CalendarCheck,
    title: '预约试课',
    description: '免费30分钟体验课，感受教学风格。',
  },
  {
    icon: Brain,
    title: '正式上课',
    description: '定制学习方案，开始一对一教学。',
  },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!statsRef.current) return undefined
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStatsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-text-dark">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:shadow-soft"
      >
        跳到主要内容
      </a>
      <header
        className={`fixed top-0 z-50 w-full transition-all ${
          scrolled
            ? 'bg-white/95 shadow-soft'
            : 'bg-white/85 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-base font-semibold text-primary">
              思
            </span>
            <div className="leading-tight">
              <p className="text-base font-semibold text-text-dark">思维与英语教育</p>
              <p className="text-xs text-text-medium">广州天河 · 一对一成长</p>
            </div>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <nav className="flex items-center gap-6" aria-label="主导航">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="flex min-h-[48px] items-center text-base text-text-medium transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <a
                href="#booking"
                className="flex min-h-[44px] items-center justify-center rounded-full border border-primary/30 px-4 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                预约试听
              </a>
              <a
                href={WECHAT_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] items-center justify-center rounded-full bg-mint px-4 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/40"
              >
                微信咨询
              </a>
            </div>
          </div>
          <button
            type="button"
            className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-gray-200 text-text-dark transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 md:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="打开导航菜单"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          role="presentation"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-72 space-y-6 bg-white p-6 shadow-xl"
            role="dialog"
            aria-label="移动端导航"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-text-dark">导航</span>
              <button
                type="button"
                className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border border-gray-200 text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                onClick={() => setMenuOpen(false)}
                aria-label="关闭导航菜单"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-2" aria-label="移动端导航链接">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[48px] items-center rounded-xl bg-gray-50 px-4 text-base text-text-dark"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="space-y-3">
              <a
                href="#booking"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[48px] items-center justify-center rounded-full border border-primary/30 text-base font-semibold text-primary"
              >
                预约试听
              </a>
              <a
                href={WECHAT_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[48px] items-center justify-center rounded-full bg-mint text-base font-semibold text-white shadow-soft transition hover:opacity-90"
              >
                微信咨询
              </a>
            </div>
          </div>
        </div>
      )}

      <main id="main-content" className="pt-20">
        <section
          id="hero"
          className="bg-[length:cover] bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.svg')" }}
        >
          <div className="mx-auto max-w-[1200px] px-4 py-16">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <p className="text-sm font-semibold tracking-[0.2em] text-primary">
                  思维能力培养 · 个人家教
                </p>
                <h1 className="text-3xl font-semibold leading-snug text-text-dark sm:text-4xl">
                  用思维点亮成长，用英语连接世界
                </h1>
                <p className="text-base leading-relaxed text-text-medium sm:text-lg">
                  广州本地 | 书法・象棋・魔方・英语 | 一对一精品教学
                </p>
                <div className="space-y-3">
                  {heroHighlights.map((item) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={item.text}
                        className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/90 p-4 text-text-dark shadow-soft"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className="text-base leading-relaxed text-text-dark">{item.text}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                  <a
                    href={WECHAT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-mint px-6 text-base font-semibold text-white shadow-soft transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/40 sm:w-auto"
                  >
                    立即微信咨询
                  </a>
                  <a
                    href="#booking"
                    className="flex min-h-[48px] w-full items-center justify-center rounded-full border border-white/80 bg-white/70 px-6 text-base font-semibold text-primary transition hover:border-primary hover:text-primary active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:w-auto"
                  >
                    预约免费试听课
                  </a>
                </div>
              </div>
              <div className="space-y-4 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-soft">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary">专属学习方案</p>
                  <h2 className="text-2xl font-semibold text-text-dark">
                    让孩子从兴趣出发，建立思维习惯
                  </h2>
                  <p className="text-sm leading-relaxed text-text-medium">
                    每位孩子都将获得个性化评估与学习计划，课程强度和节奏可灵活调整。
                  </p>
                </div>
                <div className="grid gap-3">
                  {heroCards.map((card) => (
                    <div key={card.label} className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-semibold text-text-medium">{card.label}</p>
                      <p className="mt-2 text-base font-semibold text-text-dark">{card.value}</p>
                      <p className="mt-1 text-xs text-text-medium">{card.note}</p>
                    </div>
                  ))}
                </div>
                <a
                  href="#booking"
                  className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-white shadow-soft transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  立即预约评估
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="philosophy" className="mx-auto max-w-[1200px] px-4 py-14">
          <div className="space-y-4 rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-text-dark">
              为什么选择思维教育？
            </h2>
            <p className="text-base leading-relaxed text-text-medium">
              传统教育只关注知识灌输，而我相信思维能力才是孩子一生的核心竞争力。
              通过书法培养专注力和耐心，通过象棋锻炼逻辑思维和战略眼光，通过魔方提升空间想象力和手眼协调能力，
              同时将思维训练融入英语学习中，让孩子在思考中学习，在学习中思考。
              我不追求短期的分数提升，而是致力于培养孩子自主学习的能力和解决问题的思维。
            </p>
          </div>
        </section>

        <section id="courses" className="bg-gray-50">
          <div className="mx-auto max-w-[1200px] px-4 py-14">
            <div className="space-y-10">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-text-dark">四大核心课程</h2>
                <p className="text-base leading-relaxed text-text-medium">
                  每一门课程都围绕思维能力培养，帮助孩子建立长期可持续的学习优势。
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {courses.map((course) => {
                  const Icon = course.icon
                  return (
                    <div
                      key={course.title}
                      className="rounded-2xl bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Icon className="h-6 w-6" />
                        </span>
                        <div>
                          <h3 className="text-lg font-semibold text-text-dark">
                            {course.title}
                          </h3>
                          <p className="text-sm text-text-medium">{course.age}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-base leading-relaxed text-text-medium">
                        {course.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href="#booking"
                        className="mt-4 flex min-h-[48px] w-full items-center justify-center rounded-full border border-primary text-base font-semibold text-primary transition hover:bg-primary hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        了解更多
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-[1200px] px-4 py-14">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-text-dark">清晰透明，无隐形消费</h2>
              <p className="text-base leading-relaxed text-text-medium">
                所有课程均为一对一教学，一次一结，不满意随时退费。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                {pricingRows.map((row) => (
                  <div key={row.type} className="rounded-2xl border border-gray-100 bg-white p-4">
                    <p className="text-base font-semibold text-text-dark">{row.type}</p>
                    <div className="mt-3 space-y-2 text-sm text-text-medium">
                      <div className="flex items-center justify-between">
                        <span>工作室教学</span>
                        <span className="font-semibold text-text-dark">{row.studio}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>上门教学</span>
                        <span className="font-semibold text-text-dark">{row.home}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-soft">
                <p className="text-base font-semibold text-text-dark">课时包优惠</p>
                <ul className="mt-3 space-y-2 text-sm text-text-medium">
                  {discountList.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-text-medium">
                  备注：天河区全境上门，其他区域可协商。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="results" className="bg-gray-50">
          <div className="mx-auto max-w-[1200px] px-4 py-14">
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-text-dark">见证孩子的成长</h2>
                <p className="text-base leading-relaxed text-text-medium">
                  专注思维能力训练，让每一次学习都有可感知的进步。
                </p>
              </div>
              <div ref={statsRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`rounded-2xl bg-white p-5 shadow-soft transition duration-700 ${
                      statsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                    style={{ transitionDelay: `${index * 120}ms` }}
                  >
                    <p className="text-3xl font-semibold text-primary">{stat.value}</p>
                    <p className="mt-2 text-base text-text-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Suspense fallback={<div className="h-12" />}>
                <TestimonialsSection />
              </Suspense>
            </div>
          </div>
        </section>

        <section id="process" className="mx-auto max-w-[1200px] px-4 py-14">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-text-dark">简单4步，开启学习之旅</h2>
              <p className="text-base leading-relaxed text-text-medium">
                清晰流程，让家长和孩子轻松开启思维成长计划。
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.title}
                    className="rounded-2xl border border-gray-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                        {index + 1}
                      </span>
                      <div className="flex items-center gap-2 text-text-dark">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                      </div>
                    </div>
                    <p className="mt-3 text-base leading-relaxed text-text-medium">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-gray-50">
          <div className="mx-auto max-w-[1200px] px-4 py-14">
            <Suspense fallback={<div className="h-12" />}>
              <FaqSection />
            </Suspense>
          </div>
        </section>

        <section id="booking" className="mx-auto max-w-[1200px] px-4 py-14">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-text-dark">给孩子一个改变的机会</h2>
              <p className="text-base leading-relaxed text-text-medium">
                现在预约，即可获得免费15分钟学情诊断和一节30分钟体验课。
              </p>
            </div>
            <form
              action={FORMSPREE_ENDPOINT}
              method="POST"
              className="space-y-4 rounded-2xl bg-gray-50 p-5"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-text-medium">
                  孩子姓名
                  <input
                    name="childName"
                    type="text"
                    placeholder="请输入孩子姓名"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-text-dark focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-text-medium">
                  孩子年龄
                  <input
                    name="childAge"
                    type="text"
                    placeholder="请输入孩子年龄"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-text-dark focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-text-medium">
                  联系微信
                  <input
                    name="wechat"
                    type="text"
                    placeholder="请输入微信号"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-text-dark focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    required
                  />
                </label>
                <label className="space-y-2 text-sm text-text-medium">
                  想咨询的课程
                  <input
                    name="course"
                    type="text"
                    placeholder="如：英语思维课程"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base text-text-dark focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    required
                  />
                </label>
              </div>
              <button
                type="submit"
                className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-mint text-base font-semibold text-white shadow-soft transition hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/40"
              >
                立即预约免费试听课
              </button>
              <p className="text-xs leading-relaxed text-text-medium">
                表单仅用于发送预约信息，不会收集、存储或分享任何个人数据。
              </p>
            </form>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 text-sm text-text-medium">
              <p>服务时间：周一至周五 17:30-21:30，周六周日 8:30-18:30</p>
              <p className="mt-2">服务区域：广州天河区（其他区域可协商）</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-10">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-text-dark">思维与英语教育</p>
            <div className="flex flex-col items-start gap-3 rounded-2xl bg-gray-50 p-4">
              <img
                src="/wechat-qr-placeholder.svg"
                alt="微信二维码占位符"
                className="h-28 w-28 rounded-xl border border-gray-200 object-cover"
                loading="lazy"
                decoding="async"
              />
              <p className="text-sm text-text-medium">扫码添加微信咨询</p>
            </div>
            <p className="text-sm text-text-medium">
              隐私声明：本网站严格保护个人隐私，不收集、存储或分享任何用户信息。
            </p>
          </div>
          <p className="text-xs text-text-medium">
            © 2026 思维与英语教育 保留所有权利
          </p>
        </div>
      </footer>

      <a
        href={WECHAT_LINK}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-mint text-white shadow-soft transition hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint/40"
        aria-label="微信咨询"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  )
}

export default App
