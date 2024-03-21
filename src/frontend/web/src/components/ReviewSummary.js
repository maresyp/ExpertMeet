import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Rating, Typography } from '@mui/material'

function ReviewSummary({ profile_id }) {
    useQueryClient()

    const { isLoading, data, error } = useQuery({
        queryKey: ['ReviewSummary', profile_id],
        queryFn: ({ signal }) =>
            fetch(`http://127.0.0.1:8080/api/profile/get_review_summary/${profile_id}`, { signal }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
    })

    if (isLoading) {
        return (
            <div>
                <Typography component="legend">Ładowanie...</Typography>
                <Rating name="disabled" value={0} disabled />
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <Typography component="legend">Nie udało się pobrać oceny</Typography>
                <Rating name="disabled" value={0} disabled />
            </div>
        )
    }

    return (
        <div>
            <Rating name="read-only" value={data.ratings_mean} precision={0.5} readOnly />
            <Typography>Opinie: {0 + data.ratings_count}</Typography>
        </div>
    )
}

export default ReviewSummary