import { z } from "zod";
import { IUser } from "./userType";

export type typeOfLeave = {
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
}

export type LeaveFormType = {
  _id?: string;
  officeDepartment: string;
  user: IUser; 
  dateOfFiling: string;
  position: string;
  salary: number;

  detailsOfApplication: {
    typeOfLeave?: typeOfLeave;
    leaveDetails?: {
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
        masterDegree?: boolean | null;
        boardExam?: boolean | null;
      };
      otherPurpose: {
        monitization?: boolean | null;
        terminalLeave?: boolean | null;
      };
      womenSpecialLeaveDetails?: string | null;
    };
    leaveDuration: {
      inclusiveDates: string;
      numberOfDays: string;
      commutationRequested: boolean;
      commutationNotRequested: boolean;
    };
  };

  certifiedLeaveCredit?: {
    asOf: boolean;
    totalEarnedVacationLeave?: number;
    totalEarnedSickLeave?: number;
    lessThisApplicationVacationLeave?: number;
    lessThisApplicationSickLeave?: number;
  };

  reccomendation: {
    approval: boolean;
    disapproval: boolean;
    disapprovalDetail?: string;
  };

  commutation: {
    forApproval: boolean;
    forDisApproval: boolean;
  };

  disapproveFor?: string;
  specialOrderNo?: string;
  date?: string;
  period?: string;
  approverName?: string;
  approverDesignation?: string;

  leaveCreditApprover: string;
  leaveCreditApproverPosition: string;
  specialOrderApprover: string;
  specialOrderApproverPosition: string;
  status : 'PENDING' | 'APPROVED' | 'REJECTED'
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
    }).optional(),
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
        masterDegree: z.boolean().optional().nullable(),
        boardExam: z.boolean().optional().nullable(),
      }),
      otherPurpose: z.object({
        monitization: z.boolean().optional().nullable(),
        terminalLeave: z.boolean().optional().nullable(),
      }),
      womenSpecialLeaveDetails: z.string().optional().nullable(),
    }).optional(),
    
    leaveDuration: z.object({
      inclusiveDates: z.string(),
      numberOfDays: z.string(),
      commutationRequested: z.boolean(),
      commutationNotRequested: z.boolean(),
    }),
  }),

  certifiedLeaveCredit: z.object({
    asOf: z.boolean(),
    totalEarnedVacationLeave: z.string().optional(),
    totalEarnedSickLeave: z.string().optional(),
    lessThisApplicationVacationLeave: z.string().optional(),
    lessThisApplicationSickLeave: z.string().optional(),
  }).optional(),

  reccomendation: z.object({
    approval: z.boolean(),
    disapproval: z.boolean(),
    disapprovalDetail: z.string().optional() 
  }),

  commutation: z.object({
    forApproval: z.boolean(),
    forDisApproval: z.boolean(),
  }),

  disapproveFor: z.string().optional(),
  specialOrderNo: z.string().optional(),
  date: z.string(),
  period: z.string().optional(),
  approverName: z.string().optional(),
  approverDesignation: z.string().optional(),

  leaveCreditApprover: z.string(),
  leaveCreditApproverPosition: z.string(),
  specialOrderApprover: z.string(),
  specialOrderApproverPosition: z.string()
});

export type LeaveReportType = {
  id?: string,
  detailsOfApplication: {
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
