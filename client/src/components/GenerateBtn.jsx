import { useContext } from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const GenerateBtn = () => {

    const { user, setShowLogin } = useContext(AppContext)
    const navigate = useNavigate()

    const onClickHandler = () => {
        if (user) {
            navigate('/result')
        } else {
            setShowLogin(true)
        }
    }
    return (
        <motion.div
            className='pb-16 text-center'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
        >
            <motion.h1
                className='text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                See the magic. Try now
            </motion.h1>

            <motion.button
                onClick={onClickHandler}
                className='inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
            >
                Generate Images
                <motion.img
                    src={assets.star_group}
                    alt='stars'
                    className='h-6'
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
                />
            </motion.button>
        </motion.div>
    )
}

export default GenerateBtn
