const testimonials = [
  {
    quote:
      '孩子学习象棋后，逻辑思维明显变强了，做数学题也更有条理了。',
    author: '三年级家长',
  },
  {
    quote:
      '老师很有耐心，孩子以前特别坐不住，现在练书法能安静坐40分钟了。',
    author: '二年级家长',
  },
  {
    quote:
      '英语教学方法很特别，孩子不再害怕说英语了，成绩也提高了不少。',
    author: '五年级家长',
  },
]

const TestimonialsSection = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-dark">精选匿名家长评价</h3>
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0">
        {testimonials.map((item) => (
          <article
            key={item.author}
            className="min-w-[80%] snap-start rounded-2xl border border-gray-100 bg-white p-5 shadow-soft md:min-w-0"
          >
            <p className="text-base leading-relaxed text-text-medium">“{item.quote}”</p>
            <p className="mt-4 text-sm font-semibold text-text-dark">—— {item.author}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default TestimonialsSection
