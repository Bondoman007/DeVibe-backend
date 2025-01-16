authRouter 
- POST /signup
- POST / login
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/intrested/:userID
- POST /request/send/ignoreed/:userID
- POST /request/review/accepted/:requestID
- POST /request/review/rejected/:requestID

userRouter
- GET /user/connections
- GET /user/request/recieved
- GET /user/feed

Status : ignore intrested accept reject