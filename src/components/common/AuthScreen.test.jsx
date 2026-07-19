import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import AuthScreen from './AuthScreen.jsx'
vi.mock('../../context/AuthContext.jsx',()=>({useAuth:()=>({signIn:vi.fn(),signUp:vi.fn(),signInWithGoogle:vi.fn(),error:''})}))
describe('authentication screen',()=>{it('offers password and Google authentication',()=>{render(<AuthScreen/>);expect(screen.getByLabelText('Email')).toBeInTheDocument();expect(screen.getByRole('button',{name:'Continue with Google'})).toBeInTheDocument()})})
