import { deletePerson } from "../../lib/redis";

export default async function handler(req, res) {
    const id = await deletePerson(req.body.name);
    res.status(200).json({ id });
}