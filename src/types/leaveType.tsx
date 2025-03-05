import { z } from "zod";
import { IUser } from "./userType";

export type LeaveFormType = {
  _id?: string,
  officeDepartment: string;
  user: IUser;
  dateOfFiling: string;
  position: string;
  salary: number;

  detailsOfApplication: {
    typeOfLeave: {
      vacation: boolean;
      mandatory: boolean;
      sick: boolean;
      maternity: boolean;
      paternity: boolean;
      specialPrivilege: boolean;
      soloParent: boolean;
      study: boolean;
      vawc: boolean;
      rehabilitation: boolean;
      women: boolean;
      emergency: boolean;
      adoption: boolean;
      other?: string | null;
    };
    leaveDetails: {
      vacationDetails?: {
        withinPH: boolean;
        abroad?: boolean | null;
        abroadDetail?: string | null;
      };
      sickLeaveDetails?: {
        inHospital?: boolean | null;
        outPatient?: boolean | null;
        inHospitalDetail?: string | null;
        outPatientDetail?: string | null;
      };
      studyLeaveDetails: {
        masterDegree?: string | null;
        boardExam?: string | null;
      };
      otherPurpose: {
        monitization?: string | null;
        terminalLeave?: string | null;
      };
      womenSpecialLeaveDetails?: string | null;
    };
    leaveDuration: {
      inclusiveDates: string;
      numberOfDays: number;
      commutationRequested: boolean;
      commutationNotRequested: boolean;
    };
  };

  certifiedLeaveCredit: {
    asOf: string;
    totalEarnedVacationLeave: number;
    totalEarnedSickLeave: number;
    lessThisApplicationVacationLeave: number;
    lessThisApplicationSickLeave: number;
  };

  reccomendation: {
    approval?: boolean;
    disapproval?: boolean;
    disapprovalDetail?: string;
  };

  commutation: {
    forApproval?: string | null;
    forDisApproval?: string | null;
  };

  approvedFor: {
    dasyWithPay: number;
    daysWithoutPay: number;
  };

  disapproveFor?: string | null;
  specialOrderNo?: string | null;
  date: string;
  period: string;
  approverName: string;
  approverDesignation: string;
};
export const leaveFormSchema = z.object({
  officeDepartment: z.string(),
  user: z.string(), 
  dateOfFiling: z.string(),
  position: z.string(),
  salary: z.number().nonnegative(),

  detailsOfApplication: z.object({
    typeOfLeave: z.object({
      vacation: z.boolean().default(false),
      mandatory: z.boolean().default(false),
      sick: z.boolean().default(false),
      maternity: z.boolean().default(false),
      paternity: z.boolean().default(false),
      specialPrivilege: z.boolean().default(false),
      soloParent: z.boolean().default(false),
      study: z.boolean().default(false),
      vawc: z.boolean().default(false),
      rehabilitation: z.boolean().default(false),
      women: z.boolean().default(false),
      emergency: z.boolean().default(false),
      adoption: z.boolean().default(false),
      other: z.string().optional().nullable(), // Optional custom leave type
    }),
    leaveDetails: z.object({
      vacationDetails: z
        .object({
          withinPH: z.boolean().default(false),
          abroad: z.boolean().optional().nullable(),
          abroadDetail: z.string().optional().nullable(),
        })
        .optional(),
      sickLeaveDetails: z
        .object({
          inHospital: z.boolean().optional().nullable(),
          outPatient: z.boolean().optional().nullable(),
          inHospitalDetail: z.string().optional().nullable(),
          outPatientDetail: z.string().optional().nullable(),
        })
        .optional(),
      studyLeaveDetails: z.object({
        masterDegree: z.string().optional().nullable(),
        boardExam: z.string().optional().nullable(),
      }),
      otherPurpose: z.object({
        monitization: z.string().optional().nullable(),
        terminalLeave: z.string().optional().nullable(),
      }),
      womenSpecialLeaveDetails: z.string().optional().nullable(),
    }),
    leaveDuration: z.object({
      inclusiveDates: z.array(z.string()),
      numberOfDays: z.number().min(1),
      commutationRequested: z.boolean().default(false),
      commutationNotRequested: z.boolean().default(false),
    }),
  }),

  certifiedLeaveCredit: z.object({
    asOf: z.string(),
    totalEarnedVacationLeave: z.number().nonnegative(),
    totalEarnedSickLeave: z.number().nonnegative(),
    lessThisApplicationVacationLeave: z.number().nonnegative(),
    lessThisApplicationSickLeave: z.number().nonnegative(),
  }),

  reccomendation: z.object({
    approval: z.boolean().optional(),
    disapproval: z.boolean().optional(),
    disapprovalDetail: z.string().optional() 
  }),

  commutation: z.object({
    forApproval: z.string().optional().nullable(),
    forDisApproval: z.string().optional().nullable(),
  }),

  approvedFor: z.object({
    dasyWithPay: z.number().nonnegative(),
    daysWithoutPay: z.number().nonnegative(),
  }),

  disapproveFor: z.string().optional().nullable(),
  specialOrderNo: z.string().optional().nullable(),
  date: z.string(),
  period: z.string(),
  approverName: z.string(),
  approverDesignation: z.string(),
});
export type LeaveReportType = {
  id?: string,
  detailsOfApplication: {
    leaveDuration: {
      inclusiveDates: string[];
      numberOfDays: number;
      commutationRequested: boolean;
      commutationNotRequested: boolean;
    };
  };

  certifiedLeaveCredit: {
    asOf: string;
    totalEarnedVacationLeave: number;
    totalEarnedSickLeave: number;
    lessThisApplicationVacationLeave: number;
    lessThisApplicationSickLeave: number;
  };

  reccomendation: {
    approval?: boolean;
    disapproval?: boolean;
    disapprovalDetail?: string;
  };

  commutation: {
    forApproval?: string | null;
    forDisApproval?: string | null;
  };

  approvedFor: {
    dasyWithPay: number;
    daysWithoutPay: number;
  };

  disapproveFor?: string | null;
  specialOrderNo?: string | null;
  date: string;
  period: string;
  approverName: string;
  approverDesignation: string;
};
