import './addExpenses.css'
import ExpenseRow from './ExpenseRow'

export default function AddExpenses() {

    return (
        <div className='addExpenses-main'>
            <h1>Add Expenses</h1>
            <ExpenseRow />
        </div>
    )
}