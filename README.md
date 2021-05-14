# Expense Manager API (from Insight)

## API Documentation

### Authentication Routes

- GET: /api/auth            :   Retrieves the Profile of the Current User
- GET: /api/verify/:token   :   Verifies the Verification Token sent on registration

- POST: /api/auth/login     :   Login to the API
- POST: /api/auth/register  :   Register to use the API

- PUT: /api/auth/changePassword :   Change Password of the Current User
- PUT: /api/auth/changeIncome   :   Change monthly income of the Current User

- DELETE: /api/auth/deleteAccount   :   Permanantly Delete the Account of the current user


### Expense Manager Routes (All Routes are Protected)

- GET: /api/expense/                :   Retrieves all expenses of current user
- GET: /api/expense/:eID            :   Retrieves the expense with the specific Expense ID

- GET: /api/expense/download/excel  :   Generates an excel report of all expenses

- POST: /api/expense                :   Adds a new Expense

- PUT: /api/expense/cancelRecurrance:   Converts a Recurring Expense to a Regular one

- DELETE: /api/expense/:eID         : Deletes the Expense with the specified Expense ID