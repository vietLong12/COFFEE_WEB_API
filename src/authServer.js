require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/auth");
const cors = require('cors')
app.use(cors())

app.use(express.json());
var pathfinderUI = require("pathfinder-ui");

app.use(
    "/pathfinder",
    function (req, res, next) {
        pathfinderUI(app);
        next();
    },
    pathfinderUI.router
);
let users = [
    {
        id: 1,
        username: "longnv@monster.coffee.com",
        password: "longnv",
        refreshToken: null,
    },

];

const generateToken = (payload) => {
    const { username, id } = payload;
    //Create JWT
    const refreshToken = jwt.sign(
        { username, id },
        process.env.REFRESH_TOKEN_SERCET,
        {
            expiresIn: "1800s",
        }
    );

    const accessToken = jwt.sign(
        { username, id },
        process.env.ACCESS_TOKEN_SERCET,
        {
            expiresIn: "30s",
        }
    );

    return { refreshToken, accessToken };
};

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log('username, password: ', username, password);
    let user = users.find((user) => user.username === username && user.password === password);
    console.log('user: ', user);
    if (!user) return res.sendStatus(401);
    const tokens = generateToken(user);

    users = users.map((u) => {
        if (u.username === username) {
            user = {
                ...u,
                username: user.username,
                id: user.id,
                refreshToken: tokens.refreshToken,
                accessToken: tokens.accessToken,
            };
            return user
        } else {
            return {
                ...u,
            };
        }
    });

    res.json({ username: user.username, refreshToken: user.refreshToken, accessToken: user.accessToken });
});

app.post("/token", (req, res) => {
    const refreshTokenReq = req.body.refreshToken;
    if (!refreshTokenReq) return res.sendStatus(401);
    const user = users.find((user) => user.refreshToken === refreshTokenReq);
    console.log('user test: ', users);
    if (!user) return res.sendStatus(403);

    try {
        jwt.verify(refreshTokenReq, process.env.REFRESH_TOKEN_SERCET);
        const tokens = generateToken(user);
        users = users.map((userMap) => {
            if (userMap.username === user.username)
                return {
                    ...userMap,
                    refreshToken: tokens.refreshToken,
                };

            return userMap;
        });
        return res.json(tokens);
    } catch (error) {
        res.sendStatus(403);
    }
});

app.post("/logout", verifyToken, (req, res) => {
    const user = users.find((user) => user.username === req.body.username);
    console.log('user: ', user);
    const userLogout = {
        id: user.id,
        username: user.username,
        refreshToken: null,
    };
    console.log("userLogout: ", userLogout);
    users = users.map((userChild) => {
        if (userChild.username == user.username) {
            return userLogout;
        } else return { ...userChild };
    });
    res.json(users);
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
