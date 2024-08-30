import { GetProp, TablePaginationConfig, TableProps } from "antd"
import { SorterResult } from 'antd/es/table/interface'

export interface TableParams {
    pagination?: TablePaginationConfig
    sortField?: SorterResult<any>['field']
    sortOrder?: SorterResult<any>['order']
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}