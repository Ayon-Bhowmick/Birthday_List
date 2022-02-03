import { Client, Entity, Schema, Repository } from "redis-om";

const client = new Client();

async function connect() {
    if (!client.isOpen()) {
        try {
            await client.open(process.env.REDIS_URL);
        } catch (err) {
            console.error("Could not connect to Redis", err);
        }
    }
}

class Person extends Entity {}
let schema = new Schema(
    Person, {
        name: {type: 'string'},
        birthday: {type: 'string'},
    },
    {
        dataStructure: 'JSON',
    }
);

export async function createIndex() {
    await connect();
    const repository = new Repository(schema, client);
    await repository.createIndex();
}

export async function createPerson(data) {
    await connect();
    const repository = new Repository(schema, client);
    const person = repository.createEntity(data);
    const id = await repository.save(person);
    return id;
}

export async function getList() {
    await connect();
    const keys = await client.execute(["KEYS", "*"]);
    const list = [];
    for (let i = 0; i < keys.length; i++) {
        let data = await client.execute(["JSON.GET", keys[i]]);
        let obj = JSON.parse(data);
        list.push(obj);
    }
    return list;
}

export async function deletePerson(name) {
    await connect();
    const keys = await client.execute(["KEYS", "*"]);
    for (let i = 0; i < keys.length; i++) {
        let data = await client.execute(["JSON.GET", keys[i]]);
        let obj = JSON.parse(data);
        if (obj.name === name) {
            await client.execute(["DEL", keys[i]]);
            return keys[i];
        }
    }
    return "not found";
}