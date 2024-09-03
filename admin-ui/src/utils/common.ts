import { GetProp, TablePaginationConfig, TableProps } from "antd"
import { SorterResult } from 'antd/es/table/interface'

export interface TableParams {
    pagination?: TablePaginationConfig
    sortField?: SorterResult<any>['field']
    sortOrder?: SorterResult<any>['order']
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

export const urlParamsFromObject = (obj: Record<string, any>) => {
    const urlParams = new URLSearchParams()

    Object.entries(obj).forEach(([key, value]) => {
        urlParams.append(key.toString(), value.toString())
    })

    return urlParams
}