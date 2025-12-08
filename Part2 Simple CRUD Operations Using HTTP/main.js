const http = require("node:http");
const fs = require("node:fs");
const path = require('node:path');

let port = 3000;
const usersFile = path.resolve("./users.json");

function readUsersFile() {
    if (!fs.existsSync(usersFile)) return [];

    const content = fs.readFileSync(usersFile, "utf-8").trim();

    if (content === "") return [];

    return JSON.parse(content);
}

function writeUsersFile(data) {
    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
    const { url, method } = req;
    console.log({ url, method });

    if (url === '/users' && method === 'POST') {
        let data = ''
        req.on("data", (chunk) => {
            data += chunk;
        })
        req.on("end", () => {
            const { email, password } = JSON.parse(data);
            let users = readUsersFile();
            const checkUserExist = users.find(user => {
                return user.email === email;
            })

            if (checkUserExist) {
                res.writeHead(409, { 'content-type': 'application/JSON' })
                res.write(JSON.stringify({ message: "Email already exists" }))
                res.end()
            }

            else {
                const newUser = {
                    id: Date.now(),
                    email,
                    password
                };
                users.push(newUser);
                writeUsersFile(users);

                res.writeHead(201, { 'content-type': 'application/JSON' })
                res.write(JSON.stringify({ message: "User Added Successfully", user: newUser }))
                res.end()
            }
        })
    }

    else if (url === '/users' && method === 'GET') {
        const users = readUsersFile();
        res.writeHead(200, { 'content-type': 'application/JSON' })
        res.end(JSON.stringify(users))
    }
    
    else if (url.startsWith('/users/') && method === 'GET') {
        const id = Number(url.split('/')[2]);

        const users = readUsersFile();

        const user = users.find(u => u.id === id);

        if (!user) {
            res.writeHead(404, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "User not found" }));
            return;
        }

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(user));
    }

    else if (url.startsWith('/users/') && method === "PATCH") {
        const id = url.split("/")[2];
        const users = readUsersFile();

        let body = "";
        req.on("data", chunk => body += chunk);

        req.on("end", () => {
            const updatedData = JSON.parse(body);

            const index = users.findIndex(u => u.id == id);
            if (index === -1) {
                res.writeHead(404, { "content-type": "application/json" });
                return res.end(JSON.stringify({ message: "User Not Found" }));
            }

            // Update fields
            users[index] = { ...users[index], ...updatedData };

            writeUsersFile(users);

            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "Updated", user: users[index] }));
        });
    }

    else if (url.startsWith("/users/") && method === "DELETE") {
        const id = url.split("/")[2];

        const users = readUsersFile();
        const filtered = users.filter(u => u.id != id);

        if (filtered.length === users.length) {
            res.writeHead(404, { "content-type": "application/json" });
            return res.end(JSON.stringify({ message: "User Not Found" }));
        }

        writeUsersFile(filtered);

        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ message: "Deleted Successfully" }));
    }
})

listen()
function listen() {
    return server.listen(port, 'localhost', () => {
        console.log(`Server is running on port ::: ${port} 🚀`);
    })
}

server.on("error", (error) => {
    console.log(error);
    if (error.code === 'EADDRINUSE') {
        ++port;
        listen()
    }
})