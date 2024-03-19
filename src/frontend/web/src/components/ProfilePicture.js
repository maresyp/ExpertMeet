import * as React from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Rating, Typography, Skeleton, Avatar } from '@mui/material'

function ProfilePicture({ profile_id }) {
    useQueryClient()

    const { isLoading, data, error } = useQuery({
        queryKey: ['ProfilePicture', profile_id],
        queryFn: ({ signal }) =>
            fetch(`http://127.0.0.1:8080/api/profile/get_avatar/${profile_id}`, { signal }).then((res) => {
                if (!res.ok) {
                    throw new Error('Failed to fetch')
                }
                return res.json()
            }),
    })

    if (isLoading) {
        return (
            <div>
                <Skeleton variant="circular" width={40} height={40} />
            </div>
        )
    }

    if (error) {
        return (
            <div>
                <Avatar>U</Avatar>
            </div>
        )
    }

    return (
        <div>
            <Rating name="read-only" value={data.ratings_mean} precision={0.5} readOnly />
        </div>
    )
}

export default ProfilePicture