import { ILeaveRecord, IUserLeave } from "./leaveType"
import { IUser } from "./userType"

export type report = [
    {
        user: IUser,
        leaves: [
            {
                leaveDetail: IUserLeave,
                leaveRecords: ILeaveRecord[]
            }
        ]
    }
]