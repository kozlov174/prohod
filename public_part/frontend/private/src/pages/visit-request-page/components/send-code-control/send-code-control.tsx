import { api } from '@/provider/api'
import { Button, FormControl, Stack, TextField } from '@/ui'
import { isValidEmail } from '@/utils/string'
import { useMutation } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useTimer } from 'react-timer-hook'

import * as S from './send-code-control.styled'

const CODE_EXPIRATION_TIME = 60

type SendCodeControlProps = {
    email: string;
    onEmailChange: (email: string) => void;
    onCodeSubmit: (code: string) => void;
};

type State = 'initial' | 'code_sent' | 'editing_email' | 'verified';

export function SendCodeControl(props: SendCodeControlProps) {
    const { email, onCodeSubmit: onCodeChange, onEmailChange } = props
    const { enqueueSnackbar } = useSnackbar()

    const [state, setState] = useState<State>('initial')
    const [code, setCode] = useState('')
    const [sentEmail, setSentEmail] = useState('')



    const { seconds, isRunning, restart } = useTimer({
        expiryTimestamp: new Date(),
        autoStart: false
    })

    const { mutateAsync: sendCode, isPending } = useMutation({
        mutationFn: (email: string) => {
            return api.sendVerifyCode({ email })
        },
        onSuccess: () => {
            console.log('onSuccess')
            const time = new Date()
            time.setSeconds(time.getSeconds() + CODE_EXPIRATION_TIME)
            restart(time)
            setState('code_sent')
            setSentEmail(email)
            enqueueSnackbar(`Код отправлен на ${email}`, { variant: 'success' })
        },
        onError: () => {
            enqueueSnackbar('Ошибка при отправке кода', { variant: 'error' })
        }
    })

    const { mutateAsync: verifyCode, isPending: isVerifying } = useMutation({
        mutationFn: (data: { email: string, code: string }) => {
            return api.verifyCode(data)
        },
        onSuccess: () => {
            setState('verified')
            enqueueSnackbar('Email подтвержден', { variant: 'success' })
        },
        onError: () => {
            enqueueSnackbar('Код неверный', { variant: 'error' })
        }
    })

    const handleEmailChange = (value: string) => {
        onEmailChange(value)
    }

    const handleSendCode = () => {
        if (!isValidEmail(email)) {
            return
        }
        sendCode(email)
    }

    const handleSubmitCode = () => {
        if (code.length < 4) {
            enqueueSnackbar('Код должен содержать 4 цифры', { variant: 'error' })
            return
        }

        verifyCode({ email, code }).then(() => {
            onCodeChange(code)
        })
    }

    const handleEditEmail = () => {
        const time = new Date()
        time.setSeconds(time.getSeconds() + CODE_EXPIRATION_TIME)
        restart(time)
        sendCode(email)
    }

    const renderEmailControl = () => {
        const isEmailValid = isValidEmail(email) && email.length > 0
        return (
            <Stack direction="row" gap={16}>
                <FormControl
                    attention={!isEmailValid}
                    style={{ flex: 1 }}
                    label='Куда придет код для посещения'
                >
                    <Stack direction="row" gap={16}>
                        <TextField
                            required
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            disabled={state === 'code_sent' && isRunning || state === 'verified'}
                            style={{ margin: 'unset', width: '100%' }}
                        />

                        {state === 'initial' && (
                            <Button
                                style={{ flex: '0 0 auto' }}
                                onClick={handleSendCode}
                                disabled={!isEmailValid || isPending}
                                type="button"
                            >
                                Отправить код
                            </Button>
                        )}
                    </Stack>
                </FormControl>
            </Stack>
        )
    }

    const renderCodeControl = () => {
        if (state === 'verified') return null

        return (
            <Stack direction="row" gap={16}>
                <FormControl
                    label='Введите код'
                    attention={code.length > 0 && code.length < 4}
                    style={{ flex: 1 }}
                >
                    <Stack direction="row" gap={16}>
                        <TextField
                            required
                            placeholder="Код"
                            type="text"
                            value={code}
                            maxLength={4}
                            pattern="[0-9]{4}"
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '')
                                setCode(value)
                            }}
                            style={{ margin: 'unset', width: '100%' }}
                        />
                        <Button
                            style={{ flex: '0 0 auto' }}
                            onClick={handleSubmitCode}
                            disabled={code.length < 4 || isVerifying}
                            type="button"
                        >
                            Подтвердить код
                        </Button>
                    </Stack>
                </FormControl>
            </Stack>
        )
    }

    const renderMessage = () => {
        if (state === 'verified') {
            return (
                <S.StatusContainer>
                    <span>Email {sentEmail} подтвержден</span>
                </S.StatusContainer>
            )
        }

        if (state === 'code_sent') {
            return (
                <S.StatusContainer>
                    <span>Код отправлен на {sentEmail}</span>
                    {isRunning ? (
                        <span>({seconds}с)</span>
                    ) : (
                        <S.ResendButton
                            $isActive={!isPending && !isVerifying}
                            onClick={handleEditEmail}
                            disabled={isPending || isVerifying}
                        >
                            отправить повторно
                        </S.ResendButton>
                    )}
                </S.StatusContainer>
            )
        }

        return null
    }

    return (
        <Stack direction="column" gap={8}>
            {renderEmailControl()}
            {state !== 'initial' && renderCodeControl()}
            {renderMessage()}
        </Stack>
    )
} 