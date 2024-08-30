import { useAppDispatch, useAppSelector } from '../store'
import { decrement, increment } from '../store/counterState'
import PageLayout from '../components/PageLayout'

const Register = () => {
    const dispatch = useAppDispatch()
    const counter = useAppSelector((state) => state.counter.value)

    return (
        <PageLayout>
            <div>
                <h1>Register</h1>
                <button onClick={() => dispatch(increment())}>Increment</button>
                <button onClick={() => dispatch(decrement())}>Decrement</button>
                <p>Counter: {counter}</p>
            </div>
        </PageLayout>
    )
}

export default Register