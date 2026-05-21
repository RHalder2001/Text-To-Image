import { useContext, useState } from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Result = () => {

  const [image, setImage] = useState(assets.sample_img_1)
  const [isImageLoaded, setIsImageLoaded] = useState(true)
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState('')

  const { generateImage } = useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (input) {
      const image = await generateImage(input);
      if (image) {
        setIsImageLoaded(true);
        setImage(image);
      }
    }

    setLoading(false);
  };

  return (
    <motion.form
      onSubmit={onSubmitHandler}
      className='flex flex-col min-h-[90vh] justify-center items-center'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className='relative'>
          <img
            src={image}
            alt="Generated image"
            className='max-w-sm rounded'
          />
          <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`}></span>
        </div>
        {/* if loading is true then loading simbol is dhowing otherwise that is not show */}
        <motion.p
          className={!loading ? 'hidden' : ''}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Loading......
        </motion.p>
      </motion.div>


      {/* condition after generating image Generate button not show */}
      {!isImageLoaded &&
        <motion.div
          className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        >
          <input
            onChange={(e) => setInput(e.target.value)} value={input}
            type="text"
            placeholder='Describe what you want to generate'
            className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20'
          />
          <motion.button
            type='submit'
            className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate
          </motion.button>
        </motion.div>
      }

      {/* condition before generating image Generate button show */}

      {isImageLoaded &&
        <motion.div
          className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        >
          <motion.p
            onClick={() => setIsImageLoaded(false)}
            className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate Another
          </motion.p>
          {/* dowload use for dowloading the image  */}
          <motion.a
            href={image}
            download
            className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Download
          </motion.a>
        </motion.div>
      }
    </motion.form>
  )
}

export default Result
