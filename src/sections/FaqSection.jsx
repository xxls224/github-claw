import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqItems = [
  {
    question: '孩子没有基础可以学习吗？',
    answer: '当然可以。所有课程都从零基础开始，根据孩子的接受能力调整进度。',
  },
  {
    question: '一节课多长时间？',
    answer: '小学低年级45分钟，小学高年级和初中60分钟。',
  },
  {
    question: '可以同时学习多个课程吗？',
    answer: '可以。很多孩子同时学习英语和象棋，或者书法和魔方，效果很好。',
  },
  {
    question: '可以请假吗？',
    answer: '可以。提前24小时通知，课时可以顺延。',
  },
  {
    question: '不满意可以退费吗？',
    answer: '可以。未使用的课时全额退费，无任何手续费。',
  },
]

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text-dark">家长常见问题</h2>
        <p className="text-base leading-relaxed text-text-medium">
          如果还有其他疑问，欢迎通过微信咨询。
        </p>
      </div>
      <div className="space-y-3">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div
              key={item.question}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-soft"
            >
              <button
                type="button"
                className="flex min-h-[48px] w-full items-center justify-between text-left text-base font-semibold text-text-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transition ${isOpen ? 'rotate-180 text-primary' : ''}`}
                />
              </button>
              {isOpen && (
                <p className="mt-3 text-base leading-relaxed text-text-medium">
                  {item.answer}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FaqSection
