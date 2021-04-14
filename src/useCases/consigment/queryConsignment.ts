import { useDatabase } from "../../database"

export async function queryConsignment(constraints: any) {
    try {
        const query = `
            FOR c IN consignments
                COLLECT date = DATE_FORMAT(c.createdAt, "%yyyy-%mm-%dd") INTO list = c
                
                LET from = IS_DATESTRING(@constraints.from) ? @constraints.from : date
                LET to = IS_DATESTRING(@constraints.to) ? @constraints.to : date

                FILTER DATE_DIFF(from, date, "d") >= 0
                FILTER DATE_DIFF(to, date, "d") <= 0

                SORT DATE_TIMESTAMP(date) DESC
                LIMIT (TO_NUMBER(@constraints.page) * 2), 2
                
                LET content = (
                    FOR i IN list
                        LET user = DOCUMENT("users", i.author)
                        RETURN MERGE(i, { author: user.nickname })
                )
                
                RETURN {
                    date: date,
                    content: content
                }
        `

        const database = useDatabase()
        const result = await database.query(query, { constraints })

        return await result.all()
    }

    catch (err) {
        console.error(err)
        return []
    }
} 