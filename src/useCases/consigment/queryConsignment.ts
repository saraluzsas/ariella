import { useDatabase } from "../../database"

export async function queryConsignment(constraints: any) {
    try {
        const query = `
            FOR c IN consignments
                COLLECT date = DATE_FORMAT(c.createdAt, "%yyyy-%mm-%dd") INTO list = c
                SORT DATE_TIMESTAMP(date) DESC
                
                LET content = (
                    FOR i IN list
                        LET user = DOCUMENT("users", i.author)
                        
                        FILTER IS_NULL(@constraints.from) OR i.createdAt >= @constraints.from
                        FILTER IS_NULL(@constraints.to) OR i.createdAt <= @constraints.to
                        
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