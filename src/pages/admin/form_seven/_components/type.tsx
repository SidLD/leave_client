// Types based on the Mongoose schema
export interface AbsenceDeduction {
    basic: string;
    pOrA: string;
  }
  
  export interface AbsenceOrUndertime {
    incluseiveDate: string;
    dayOrHr: string;
    cause: string;
    divisionAction: string;
    deduction: AbsenceDeduction;
    [key: string]: any; // Index signature to allow dynamic access
  }
  
  export interface Employee {
    id: string;
    user: {
      _id: string;
      employeeId: string;
      name: string;
      position: string;
    };
    s: string;
    peraOrAca: string;
    remark: string;
    abesencesOrUndertime: AbsenceOrUndertime;
  }
  
  export interface PayrollPeriod {
    month: string;
    year: number;
    station: string;
    approverOne: string;
    approverTwo: string;
    approverThree: string;
    employees: Employee[];
  }
  
  // Month options
  export const months = [
    "JANUARY",
    "FEBRUARY",
    "MARCH",
    "APRIL",
    "MAY",
    "JUNE",
    "JULY",
    "AUGUST",
    "SEPTEMBER",
    "OCTOBER",
    "NOVEMBER",
    "DECEMBER",
  ]
  
  export const getSampleData = (month: string): PayrollPeriod => {
    return {
      month,
      year: 2024,
      station: "035 SECONDARY",
      approverOne: "JOHN DOE",
      approverTwo: "JANE SMITH",
      approverThree: "ROBERT JOHNSON",
      employees: [
        {
          id: "1",
          user: {
            _id: "user1",
            employeeId: "4587601",
            name: "ALBERIA, MARICEL P.",
            position: "HEAD TEACHER I",
          },
          s: "P",
          peraOrAca: "2000",
          remark: "OK",
          abesencesOrUndertime: {
            incluseiveDate: "",
            dayOrHr: "",
            cause: "",
            divisionAction: "",
            deduction: {
              basic: "",
              pOrA: ""
            }
          }
        },
        {
          id: "2",
          user: {
            _id: "user2",
            employeeId: "0003544",
            name: "BALANAY, HERMINIA S.",
            position: "HEAD TEACHER II",
          },
          s: "P",
          peraOrAca: "2000",
          remark: "OK",
          abesencesOrUndertime: {
            incluseiveDate: "",
            dayOrHr: "",
            cause: "",
            divisionAction: "",
            deduction: {
              basic: "",
              pOrA: ""
            }
          }
        },
        {
          id: "3",
          user: {
            _id: "user3",
            employeeId: "4250458",
            name: "CABAGAT, NELCA L.",
            position: "SCHOOL PRINCIPAL",
          },
          s: "P",
          peraOrAca: "2000",
          remark: "",
          abesencesOrUndertime: {
            incluseiveDate: "",
            dayOrHr: "",
            cause: "",
            divisionAction: "",
            deduction: {
              basic: "",
              pOrA: ""
            }
          }
        },
        {
          id: "4",
          user: {
            _id: "user4",
            employeeId: "6298724",
            name: "CALONG, LORRAINE B.",
            position: "ADM OFFICER II",
          },
          s: "P",
          peraOrAca: "2000",
          remark: "",
          abesencesOrUndertime: {
            incluseiveDate: "March 15-16, 2024",
            dayOrHr: "2",
            cause: "Sick Leave",
            divisionAction: "Approved",
            deduction: {
              basic: "2500",
              pOrA: "200"
            }
          }
        },
        {
          id: "5",
          user: {
            _id: "user5",
            employeeId: "6302354",
            name: "CANO, MYLYN S.",
            position: "ADM OFFICER II",
          },
          s: "P",
          peraOrAca: "2000",
          remark: "OK",
          abesencesOrUndertime: {
            incluseiveDate: "",
            dayOrHr: "",
            cause: "",
            divisionAction: "",
            deduction: {
              basic: "",
              pOrA: ""
            }
          }
        },
      ],
    }
  }
  
  