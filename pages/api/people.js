import { createPerson } from "../../lib/redis";

export default async function handler(req, res) {
    const id = await createPerson(req.body);
    res.status(200).json({ id });
}