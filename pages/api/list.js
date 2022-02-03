import { getList } from "../../lib/redis";

export default async function handler(req, res) {
    const list = await getList();
    res.status(200).json(list);
}