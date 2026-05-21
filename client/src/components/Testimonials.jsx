import React from 'react'
import { motion } from 'motion/react'
import { assets, testimonialsData } from '../assets/assets'

const Testimonials = () => {
    return (
        <motion.div
            className='flex flex-col items-center justify-center my-24 p-12 '
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <motion.h1
                className='text-3xl sm:text-4xl font-semibold mb-2'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            >
                Customar testimonials
            </motion.h1>
            <motion.p
                className='text-gray-500 mb-12'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
            >
                What Our Users Are Saying
            </motion.p>

            <motion.div
                className='flex flex-wrap gap-6'
                initial='hidden'
                animate='visible'
                transition={{ staggerChildren: 0.12, delayChildren: 0.2 }}
            >
                {testimonialsData.map((testimonial, index) => (
                    <motion.div
                        key={index}
                        className='bg-white/20 p-12 rounded-lg shadow-md order w-80 m-auto cursor-pointer'
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.08 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className='flex flex-col items-center'>
                            <motion.img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className='rounded-full w-14'
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                            <h2 className='text-xl font-semibold mt-3'>{testimonial.name}</h2>
                            <p className='text-gray-500 mb-4'>{testimonial.role}</p>

                            <div className='flex mb-4'>
                                {Array(testimonial.stars).fill().map((item, index) => (
                                    <motion.img
                                        key={index}
                                        src={assets.rating_star}
                                        alt='Rating star'
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                                    />
                                ))}
                            </div>
                            <motion.p
                                className='text-center text-sm text-gray-600'
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                            >
                                {testimonial.text}
                            </motion.p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    )
}

export default Testimonials
