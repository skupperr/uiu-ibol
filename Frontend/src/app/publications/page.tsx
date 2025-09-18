import Footer from '@/components/footer'
import NavBar from '@/components/navbar'
import React from 'react'
import RecentPosts from '../../components/recent-post'
import Publications from '@/components/publications'

const News = () => {
  return (
    <>
        <NavBar/>
        <Publications/>
        <Footer/>
    </>
  )
}

export default News