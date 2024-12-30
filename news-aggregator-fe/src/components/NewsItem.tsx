'use client' // Needed for Framer Motion in App Directory

import { NewsArticle } from '@/interfaces/news-data-interface'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import moment from "moment"

const NewsEntry = ({ article: { title, headline, image_url, pub_date, id, author }, promoted, index }: { article: NewsArticle, promoted: boolean, index: number }) => {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 })
  const convertTime = function () {
    const diffInHours = moment().diff(moment(pub_date), 'hours')
    if (diffInHours < 24) {
      if (diffInHours === 1) return 'an hour'
      return diffInHours + 'hours'
    }

    const diffInDays = moment().diff(moment(pub_date), 'days')
    if (diffInDays < 14) {
      if (diffInDays === 1) return 'a day'
      return diffInDays + ' days'
    }

    const diffInWeeks = moment().diff(moment(pub_date), 'weeks')
    if (diffInWeeks < 4) {
      if (diffInWeeks === 1) return 'a week'
      return diffInWeeks + ' weeks'
    }


    const diffInMonths = diffInWeeks / 4
    if (diffInMonths < 12) {
      if (diffInMonths === 1) return 'a month'
      return diffInMonths + ' months'
    }

    const diffInYears = moment().diff(moment(pub_date), 'years')
    if (diffInYears > 1) {
      return diffInYears + 'years'
    }

    return 'a year'
  }
  return (
    <motion.div
      ref={ref}
      id={id.toString()}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1, }}
      className={`rounded-md shadow-sm ${promoted && 'col-span-1 md:col-span-2'}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img src={image_url} className='w-full h-full object-cover rounded-t-md' alt="" />
      </div>
      <div className=''>
        <h2 className="text-base font-semibold">{title}</h2>
        <p className='text-xs'><span dangerouslySetInnerHTML={{ __html: headline }}></span> <span className='text-gray-400'>{convertTime()} ago</span></p>
      </div>
      <div className='text-base font-semibold'>By: {author}</div>
    </motion.div>
  )
}

export default NewsEntry
