import { motion } from 'motion/react'
import { stepsData } from '../assets/assets'

const Steps = () => {
    return (
        <motion.div
            className='flex flex-col items-center justify-center my-32'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <motion.h1
                className='text-3xl sm:text-4xl font-semibold mb-2'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
            >
                How it works
            </motion.h1>
                        
            <motion.p
                className='text-lg text-gray-600 mb-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                Transform Words Into Stunning Images
            </motion.p>

            <div className='space-y-4 w-full max-w-3xl text-sm'>
                {stepsData.map((item, index) => (
                    <motion.div
                        key={index}
                        className='flex items-center gap-4 p-5 px-8 bg-white/20 shadow-md border cursor-pointer rounded-lg'
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: 0.15 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                    >
                        <motion.img
                            width={40}
                            src={item.icon}
                            alt={item.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                        />
                        <div>
                            <h2 className='text-xl font-medium'>{item.title}</h2>
                            <p className='text-gray-500'>{item.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    )
}

export default Steps
