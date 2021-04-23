import { useDatabase } from "../../services/database"

import * as csv from "fast-csv"

export async function exportConsignment(filters: any) {
    const query = `
        LET details = (
            FOR c IN consignments
                LET date = DATE_FORMAT(c.createdAt, "%yyyy-%mm-%dd")
                
                LET from = IS_DATESTRING(@filters.from) ? @filters.from : date
                LET to = IS_DATESTRING(@filters.to) ? @filters.to : date
            
                FILTER DATE_DIFF(from, date, "d") >= 0
                FILTER DATE_DIFF(to, date, "d") <= 0
            
                LET user = DOCUMENT("users", c.author)
                LET search = LOWER(@filters.search)
            
                FILTER NOT LENGTH(search)
                    OR CONTAINS(user.nickname, search)
                    OR CONTAINS(c.note, search)
                    OR CONTAINS(c.total, search)
            
                SORT DATE_TIMESTAMP(date) DESC
                
                RETURN (
                    FOR d IN c.details
                        RETURN {
                            id: c._key,
                            author: user.nickname,
                            amount: d.amount,
                            date: d.date,
                            note: c.note
                        }
                )
        )
        
        FOR d IN details[**]
            RETURN d
    `

    const database = useDatabase()
    const result = await database.query(query, { filters })

    const headers = ["id", "author", "note", "total", "createdAt"]

    const stream = csv.format({ delimiter: ";", headers })

    while (result.hasNext) {
        stream.write(await result.next())
    }

    stream.end()

    return stream
}

export async function queryConsignment(filters: any) {
    const query = `
        LET consignments = (
            FOR c IN consignments
                COLLECT date = DATE_FORMAT(c.createdAt, "%yyyy-%mm-%dd") INTO list = UNSET(c, "photo")

                LET from = IS_DATESTRING(@filters.from) ? @filters.from : date
                LET to = IS_DATESTRING(@filters.to) ? @filters.to : date
            
                FILTER DATE_DIFF(from, date, "d") >= 0
                FILTER DATE_DIFF(to, date, "d") <= 0
            
                SORT DATE_TIMESTAMP(date) DESC
                
                LET content = (
                    FOR i IN list
                        LET user = DOCUMENT("users", i.author)
                        LET search = LOWER(@filters.search)

                        FILTER NOT LENGTH(search)
                            OR CONTAINS(i.note, search)
                            OR CONTAINS(i.total, search)
                            OR CONTAINS(user.nickname, search)

                        RETURN MERGE(i, { author: user.nickname })
                )

                FILTER LENGTH(content)
                
                RETURN {
                    title: date,
                    content: content
                }
        )
        
        RETURN {
            pages: CEIL(LENGTH(consignments) / 3),
            sections: (
                FOR c IN consignments
                    LIMIT TO_NUMBER(@filters.page) * 3, 3
                    RETURN c
            )
        }
    `

    const database = useDatabase()
    const result = await database.query(query, { filters })

    return await result.next()
}