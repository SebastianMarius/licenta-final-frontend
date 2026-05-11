import styles from './LoginModal.module.css'
import { Fragment, useEffect, useState } from 'react'
import { useAppContext } from '../components/context/AppContext'

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:9000'

export const LoginModal = ({ onClose, initialFlow = 'login' }) => {
    const { setAuthUser, authUser } = useAppContext()

    const [activeFlow, setActiveFlow] = useState(initialFlow)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const inputsToDisplay = {
        login: [
            { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', autoComplete: 'email' },
            { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••', autoComplete: 'current-password' }
        ],

        signup: [
            { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', autoComplete: 'email' },
            { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••', autoComplete: 'new-password' },
            { name: 'confirmPassword', type: 'password', label: 'Confirm password', placeholder: '••••••••', autoComplete: 'new-password' }
        ],

        resetPassword: [
            { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', autoComplete: 'email' }
        ]
    }

    const topMessage = {
        login: 'Welcome back',
        signup: 'Create account',
        resetPassword: 'Reset your password'
    }

    const secondText = {
        login: 'Log in to save listings, use AI assistant and post listings',
        signup: 'Join to save listings and use the AI assistant.',
        resetPassword: 'Enter your email and we will send reset instructions.'
    }

    const buttonTextToDisplay = {
        login: 'Log in',
        signup: 'Create account',
        resetPassword: 'Send reset link'
    }

    const footerLead = {
        login: 'No account?',
        signup: 'Already have an account?',
        resetPassword: 'Remember your password?'
    }

    const footerAction = {
        login: 'Sign up for free',
        signup: 'Back to login',
        resetPassword: 'Back to login'
    }

    useEffect(() => {
        setActiveFlow(initialFlow)
    }, [initialFlow])

    useEffect(() => {
        if (initialFlow === 'resetPassword' && authUser?.email) {
            setEmail(authUser.email)
        }
    }, [initialFlow, authUser?.email])

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape') onClose?.()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [onClose])

    const resetFeedback = () => {
        setError('')
        setSuccess('')
    }

    const handleBackdropClick = () => {
        onClose?.()
    }

    const stopBubble = (e) => {
        e.stopPropagation()
    }

    const handleInputs = (e) => {
        const { name, value } = e.target
        resetFeedback()
        if (name === 'email') setEmail(value)
        else if (name === 'confirmPassword') setConfirmPassword(value)
        else setPassword(value)
    }

    const setFlow = (flow) => {
        resetFeedback()
        setActiveFlow(flow)
    }

    const handleFooterAction = () => {
        if (activeFlow === 'login') setFlow('signup')
        else setFlow('login')
    }

    const persistSession = (data, fallbackEmail) => {
        const token = data?.token ?? data?.accessToken ?? data?.access_token
        if (token) localStorage.setItem('token', token)

        const email =
            (typeof data?.user === 'object' && data?.user?.email) ||
            data?.email ||
            (fallbackEmail && String(fallbackEmail).trim()) ||
            ''
        if (email) {
            const base =
                typeof data?.user === 'object' && data.user
                    ? { ...data.user, email }
                    : { email }
            localStorage.setItem('user', JSON.stringify(base))
            setAuthUser({ email })
        }
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        resetFeedback()
        setLoading(true)

        try {
            if (activeFlow === 'login') {
                if (!email.trim() || !password) {
                    setError('Please enter email and password.')
                    setLoading(false)
                    return
                }
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.trim(), password })
                })
                const data = await res.json().catch(() => ({}))
                if (!res.ok) {
                    setError(data.message || data.error || 'Login failed.')
                    setLoading(false)
                    return
                }
                persistSession(data, email)
                onClose?.()
            } else if (activeFlow === 'signup') {
                if (!email.trim() || !password || !confirmPassword) {
                    setError('Please fill in all fields.')
                    setLoading(false)
                    return
                }
                if (password !== confirmPassword) {
                    setError('Passwords do not match.')
                    setLoading(false)
                    return
                }
                const res = await fetch(`${API_BASE}/auth/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.trim(), password })
                })
                const data = await res.json().catch(() => ({}))
                if (!res.ok) {
                    setError(data.message || data.error || 'Could not create account.')
                    setLoading(false)
                    return
                }
                persistSession(data, email)
                onClose?.()
            } else if (activeFlow === 'resetPassword') {
                if (!email.trim()) {
                    setError('Please enter your email.')
                    setLoading(false)
                    return
                }
                const res = await fetch(`${API_BASE}/auth/forgot-password`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.trim() })
                })
                const data = await res.json().catch(() => ({}))
                if (!res.ok) {
                    setError(data.message || data.error || 'Could not start reset.')
                    setLoading(false)
                    return
                }
                setSuccess(data.message || 'If an account exists, you will receive an email shortly.')
            }
        } catch {
            setError('Network error. Is the API running?')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className={styles.loginWrapper}
            onClick={handleBackdropClick}
            role="presentation"
        >
            <form
                className={styles.form}
                onSubmit={handleFormSubmit}
                onClick={stopBubble}
            >
                <div className={styles.content}>
                    <button
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => onClose?.()}
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    <h3 className={styles.heading}>{topMessage[activeFlow]}</h3>
                    <p className={styles.secondHeading}>{secondText[activeFlow]}</p>

                    {(error || success) && (
                        <div
                            className={error ? styles.feedbackError : styles.feedbackOk}
                            role="alert"
                        >
                            {error || success}
                        </div>
                    )}

                    <div className={styles.inputsWrapper}>
                        {inputsToDisplay[activeFlow].map((input) => (
                            <Fragment key={input.name}>
                                <label htmlFor={`login-${input.name}`}>{input.label}</label>
                                <input
                                    id={`login-${input.name}`}
                                    name={input.name}
                                    type={input.type}
                                    autoComplete={input.autoComplete}
                                    placeholder={input.placeholder}
                                    value={
                                        input.name === 'email'
                                            ? email
                                            : input.name === 'confirmPassword'
                                                ? confirmPassword
                                                : password
                                    }
                                    onChange={handleInputs}
                                    required
                                    disabled={loading}
                                />
                            </Fragment>
                        ))}
                    </div>

                    {activeFlow === 'login' && (
                        <button
                            type="button"
                            className={styles.linkBtn}
                            onClick={() => setFlow('resetPassword')}
                            disabled={loading}
                        >
                            Forgot password?
                        </button>
                    )}

                    <button className={styles.loginBtn} type="submit" disabled={loading}>
                        {loading ? 'Please wait…' : buttonTextToDisplay[activeFlow]}
                    </button>

                    <div className={styles.footer}>
                        <span className={styles.footerMuted}>{footerLead[activeFlow]}</span>
                        <button
                            type="button"
                            className={styles.footerLink}
                            onClick={handleFooterAction}
                            disabled={loading}
                        >
                            {footerAction[activeFlow]}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
