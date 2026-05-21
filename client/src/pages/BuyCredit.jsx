import { useContext } from 'react'
import { motion } from 'motion/react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const BuyCredit = () => {

  const {user} = useContext(AppContext)
  return (
    <motion.div
      className='min-h-[80vh] text-center pt-14 mb-10'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.button
        className='border border-gray-400 px-10 py-2 rounded-full mb-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Our Plans
      </motion.button>

      <motion.h1
        className='text-center text-3xl font-medium mb-6 sm:mb-10'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6, ease: 'easeOut' }}
      >
        Choose the plan
      </motion.h1>

      <motion.div
        className='flex flex-wrap justify-center gap-6 text-left'
        initial='hidden'
        animate='visible'
        transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
      >
        {plans.map((item, index) => (
          <motion.div
            key={index}
            className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600'
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.img
              width={40}
              src={assets.logo_icon}
              alt='logo'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>

            <p className='mt-6'>
              <span className='text-3xl font-medium'>
             ₹{item.price} </span> / {item.credits} credits
            </p>
            <motion.button
              className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {user ? 'Purchase' : 'Get Started'}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default BuyCredit