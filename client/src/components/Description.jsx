import { motion } from 'motion/react'
import { assets } from '../assets/assets'

const Description = () => {
    return (
        <motion.div
            className='flex flex-col items-center justify-center my-24 p-6 md:px-28'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
        >
            <motion.h1
                className='text-3xl sm:text-4xl font-semibold mb-2'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
            >
                Create AI Images
            </motion.h1>
            <motion.p
                className='text-gray-500 mb-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
            >
                Turn your imagination into visuals
            </motion.p>

            <div className='flex flex-col gap-5 md:gap-14 md:flex-row items-center'>

                <motion.img
                    src={assets.sample_img_1}
                    alt='AI sample'
                    className='w-80 xl:w-96 rounded-lg'
                    initial={{ opacity: 0, x: -40, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.75, ease: 'easeOut' }}
                    whileHover={{ scale: 1.02 }}
                />

                <motion.div
                    initial='hidden'
                    animate='visible'
                    transition={{ delay: 0.25, staggerChildren: 0.15 }}
                >
                    <motion.h2 className='text-3xl font-medium max-w-lg mb-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        Introducing the AI-Powered Text to Image Generator
                    </motion.h2>
                    <motion.p className='text-gray-600 mb-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or unique imagery, our tool transforms your text into eye-catching images with just a few clicks. Imagine it, describe it, and watch it come to life instantly.
                    </motion.p>
                    <motion.p className='text-gray-600 mb-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        Simply type in a text prompt, and our cutting-edge AI will generate high-quality images in seconds. From product visuals to character designs and portraits, even concepts that don’t yet exist can be visualized effortlessly. Powered by advanced AI technology, the creative possibilities are limitless!
                    </motion.p>

                </motion.div>
            </div>

        </motion.div>
    )
}

export default Description