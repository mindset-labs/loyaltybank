import React, { useMemo, useRef, useState } from 'react'
import { Select, Spin } from 'antd'
import type { SelectProps } from 'antd'
import { debounce } from 'lodash'

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>
    debounceTimeout?: number
}

export default function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false)
    const [options, setOptions] = useState<ValueType[]>([])
    const fetchRef = useRef(0)

    const loadOptions = (value: string) => {
        fetchRef.current += 1
        const fetchId = fetchRef.current
        setOptions([])
        setFetching(true)

        fetchOptions(value)
            .then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    return
                }

                setOptions(newOptions)
                setFetching(false)
            })
            .catch((err) => {
                setFetching(false)
                console.error(err)
            })
    }

    const debounceFetcher = useMemo(() => {
        return debounce(loadOptions, debounceTimeout)
    }, [debounceTimeout])

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            onFocus={() => loadOptions('')}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
        />
    )
}
