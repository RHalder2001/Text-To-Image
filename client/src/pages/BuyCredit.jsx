import { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'motion/react'
import { toast } from 'react-toastify'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const BuyCredit = () => {

  const { user, setShowLogin, token, backendUrl, credit, setCredit } = useContext(AppContext)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isPaying, setIsPaying] = useState(false)
  const [razorpayReady, setRazorpayReady] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true

    script.onload = () => setRazorpayReady(true)
    script.onerror = () => {
      setRazorpayReady(false)
      toast.error('Razorpay checkout failed to load. Please check your internet connection and try again.')
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePaymentFlow = (plan) => {
    if (!user) {
      setShowLogin(true)
      return
    }

    setSelectedPlan(plan)
  }

  const handleConfirmPayment = async () => {
    if (!selectedPlan || !user || !token) {
      setShowLogin(true)
      return
    }

    if (!window.Razorpay || !razorpayReady) {
      toast.error('Razorpay checkout is still loading. Please wait a moment and try again.')
      return
    }

    try {
      setIsPaying(true)
      const { data } = await axios.post(
        backendUrl + 'api/user/create-razorpay-order',
        { amount: selectedPlan.price, credits: selectedPlan.credits },
        { headers: { token } }
      )

      if (!data.success) {
        throw new Error(data.message || 'Unable to create Razorpay order')
      }

      const publicKey = import.meta.env.VITE_RAZORPAY_KEY_ID
      if (!publicKey) {
        throw new Error('Razorpay key is missing. Add VITE_RAZORPAY_KEY_ID to your frontend .env file.')
      }

      const options = {
        key: publicKey,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'TextToImage',
        description: `${selectedPlan.credits} Credits`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              backendUrl + 'api/user/verify-razorpay-payment',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                credits: selectedPlan.credits,
              },
              { headers: { token } }
            )

            if (!verifyRes.data.success) {
              throw new Error(verifyRes.data.message || 'Payment verification failed')
            }

            setCredit(verifyRes.data.creditBalance)
            toast.success('Payment successful! Credits added to your account.')
            setSelectedPlan(null)
          } catch (error) {
            toast.error(error.message || 'Payment verification failed')
          }
        },
        prefill: {
          name: user?.name || '',
        },
        theme: {
          color: '#111827',
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        toast.error(response.error?.description || 'Payment failed')
      })
      rzp.open()
    } catch (error) {
      toast.error(error.message || 'Something went wrong while starting payment')
    } finally {
      setIsPaying(false)
      setSelectedPlan(null)
    }
  }

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

      {user && (
        <p className='mb-6 text-sm text-gray-600'>Your current credit balance: {credit}</p>
      )}

      {selectedPlan && (
        <div className='mx-auto mb-8 max-w-md rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm'>
          <p className='text-sm text-gray-500'>Checkout</p>
          <h3 className='mt-2 text-2xl font-semibold'>{selectedPlan.id}</h3>
          <p className='mt-2 text-gray-600'>{selectedPlan.credits} credits</p>
          <div className='mt-4 flex items-center justify-between'>
            <span className='text-gray-500'>Total</span>
            <span className='text-xl font-semibold'>₹{selectedPlan.price}</span>
          </div>
          <button
            onClick={handleConfirmPayment}
            disabled={isPaying}
            className='mt-6 w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70'
          >
            {isPaying ? 'Processing...' : `Pay ₹${selectedPlan.price} & Add Credits`}
          </button>
          <button
            onClick={() => setSelectedPlan(null)}
            className='mt-3 w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700'
          >
            Cancel
          </button>
        </div>
      )}

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
              onClick={() => handlePaymentFlow(item)}
              className='w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {user ? 'Buy Now' : 'Get Started'}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default BuyCredit