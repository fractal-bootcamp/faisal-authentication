import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AUTH_SECRET, authenticate } from "./middleware/middleware"


const app = express()
const PORT = 3003

app.use(express())
app.use(express.json())

interface UserTypes {
    username: string
    password: string
}

const userData: UserTypes[] = [
    {
        username: "Faisal",
        password: "11111"
    },
]

app.get("/", (_req, res) => {
    res.send("I am alive")
})

app.get("/users", (_req, res) => {
    res.json(userData)
})

app.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
        const user = { username, password: hashedPassword }
        userData.push(user)
        res.status(201).json({ message: `User created successfully: username: ${username} password: ${password}` })
    } catch (error) {
        res.status(500).json({ message: "Failed to create user." })
    }
})

app.post("/login", async (req, res) => {
    const { username, password } = req.body
    const user = userData.find((user) => user.username === username)

    if (!user) {
        res.status(400).json({ message: "Unauthorized access." })
    }

    try {
        const passwordCheck = await bcrypt.compare(password, user.password)
        console.log("Password:", passwordCheck);

        // do some comparison on the result to see if it's actually the same.
        if (passwordCheck) {
            console.log("AUTH_SECRET:", AUTH_SECRET)

            const token = jwt.sign({ id: user.username }, AUTH_SECRET)
            res.status(202).json({ message: "Authorized access.", token })
        } else {
            res.status(400).json({ message: "Unauthorized access." })
        }

    } catch (error) {
        res.status(500).json({ message: "Error." })
    }
})

app.get("/authenticated", authenticate, (req, res) => {
    const user = userData.find((user) => user.username === req.user?.id)
    if (user) {
        res.status(200).json(`${user.username} is authenticated`)
    } else {
        res.status(400).json({ message: "User not found." })
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port: http://localhost:${PORT}`)
})
