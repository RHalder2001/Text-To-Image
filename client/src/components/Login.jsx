import { useContext, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const [state, setState] = useState('Login')
    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === 'Login') {
                const { data } = await axios.post(
                    backendUrl + 'api/user/login',
                    { email, password }
                );

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(
                    backendUrl + 'api/user/register',
                    { name, email, password }
                );

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                } else {
                    toast.error(data.message);
                }
            }

        } catch (error) {
            toast.error(error.message);
        }
    };

    // you can't scroll the pge until login or singin up
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);


    return (
        <motion.div
            className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <motion.form onSubmit={onSubmitHandler}
                className='relative bg-white p-10 rounded-xl text-slate-500'
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
            >
                <motion.h1
                    className='text-center text-2xl text-neutral-700 font-medium'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    {state}
                </motion.h1>

                <motion.p
                    className='text-sm'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                >
                    Welcome back! Please sign in to continue
                </motion.p>

                {state !== 'Login' && <motion.div
                    className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <img src='' alt="" />
                    <input onChange={e => setName(e.target.value)}
                        value={name}
                        type="text"
                        className='outline-none text-sm'
                        placeholder='Full Name'
                        required
                    />
                </motion.div>
                }

                <motion.div
                    className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: state !== 'Login' ? 0.25 : 0.2, duration: 0.4 }}
                >
                    <img src={assets.email_icon} alt="" />
                    <input onChange={e => setEmail(e.target.value)}
                        value={email}
                        type="email"
                        className='outline-none text-sm'
                        placeholder='Email id'
                        required
                    />
                </motion.div>

                <motion.div
                    className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: state !== 'Login' ? 0.3 : 0.25, duration: 0.4 }}
                >
                    <img src={assets.lock_icon} alt="" />
                    <input onChange={e => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        className='outline-none text-sm'
                        placeholder='password'
                        required
                    />
                </motion.div>

                <motion.p
                    className='text-sm text-blue-600 my-4 cursor-pointer'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                >
                    Forgot password?
                </motion.p>

                <motion.button
                    className='bg-blue-600 w-full text-white py-2 rounded-full'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                >
                    {state === 'Login' ? 'login' : 'create account'}
                </motion.button>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                >
                    {state === 'Login' ?
                        <p className='mt-5 text-center'>
                            Don't have an account?
                            <span className='text-blue-600 cursor-pointer' onClick={() => setState('Sign up')}> Sign up</span>
                        </p>
                        :
                        <p className='mt-5 text-center'>
                            Already have an account?
                            <span className='text-blue-600 cursor-pointer' onClick={() => setState('Login')}> Login</span>
                        </p>

                    }
                </motion.div>

                <motion.img
                    onClick={() => setShowLogin(false)}
                    src={assets.cross_icon}
                    alt=""
                    className='absolute top-5 right-5 cursor-pointer'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                />


            </motion.form>
        </motion.div>
    )
}

export default Login
