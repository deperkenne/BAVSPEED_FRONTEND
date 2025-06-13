import { useState, useEffect } from 'react'
import api from '../api'

export default function useEmployeeData() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const refresh = async () => {
        try {
            setLoading(true)
            const [profile, contributions] = await Promise.all([
                api.get('/employee/dashboard/'),
                api.get('/employee/contributions/')
            ])
            setData({
                profile: profile.data,
                contributions: contributions.data
            })
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [])

    return { data, loading, error, refresh }
}