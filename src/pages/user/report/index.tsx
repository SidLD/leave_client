"use client"

import { useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import type { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import "./styles/form.css"
import { leaveFormSchema, LeaveFormType } from "@/types/leaveType"
import type { IUser } from "@/types/userType"
import { format } from "date-fns"
import { createLeaveRecord, getUserLeave, getUserSetting, updateLeaveRecord } from "@/lib/api"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

type LeaveFormValues = z.infer<typeof leaveFormSchema>

export default function LeaveApplicationForm() {
  const formRef = useRef<HTMLDivElement>(null)
  const [userDetail, setUserDetail] = useState<IUser | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { type, id } = useParams()
  const [showStaticView, setShowStaticView] = useState(false);
  const {toast} = useToast()

  const { data: userData, isLoading: userLoading } = useQuery<IUser | null>({
    queryKey: ["userSettings", id],
    queryFn:  () => getUserSetting(id as string).then(data => data.data),
    enabled: type == 'new'
  })
  const { data: leaveData } = useQuery<LeaveFormType | null>({
    queryKey: ["userLeave", id],
    queryFn: () => getUserLeave(id as string).then(data => data.data),
    enabled: type == 'application'
  })


  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  const leaveApplication = useMutation({
    mutationKey: ['createLeaveApplication'],
    mutationFn: (data:LeaveFormValues) => createLeaveRecord(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You have successfully Submitted leave",
      })
    },
    onError: (error: Error) => {
      console.error(error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message || "Something went wrong while applying leave",
      })
    },
  })

  const updateLeaveApplication = useMutation({
    mutationKey: ['updateLeaveApplication'],
    mutationFn: (data:LeaveFormValues) => updateLeaveRecord(data._id as string, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You have successfully Submitted leave",
      })
    },
    onError: (error: Error) => {
      console.error(error)
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.message || "Something went wrong while applying leave",
      })
    },
  })

  const onSubmit = async (data: LeaveFormValues) => {
    try {
      setSubmitError(null)
      if(type == 'new'){
        leaveApplication.mutateAsync(data)
      }
      if(type == 'application'){
        updateLeaveApplication.mutateAsync(data)
      }
      handleDownloadPDF()
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitError(error instanceof Error ? error.message : "An error occurred while submitting the form")
    }
  }

  const handleDownloadPDF = () => {
    setShowStaticView(true);
    setTimeout(() => {
      generatePDF();
    }, 200); 
  };

  const generatePDF = async () => {
    if (!formRef.current) {
      console.error("Form reference not found");
      setShowStaticView(false);
      return;
    }
    if (formRef.current) {
      try {
        const canvas = await html2canvas(formRef.current, {
          scale: 2,
          logging: true,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null
        })
        const imgData = canvas.toDataURL("image/jpeg", 1.0)
        const pdf = new jsPDF("p", "mm", "legal")
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 0
        pdf.addImage(imgData, "JPEG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
        pdf.save("leave-application.pdf")
      } catch (error) {
        console.error("Error generating PDF:", error)
        throw new Error("Failed to generate PDF. Please try again.")
      } finally {
        setShowStaticView(false)
      }
    } else {
      throw new Error("Form reference not found")
    }
  }

  const navigate = useNavigate()
  useEffect(() => {
    const init = async () => {
      if(type == 'application'){
        if(leaveData){
          
          form.reset({
            _id: leaveData._id,
            officeDepartment: leaveData.officeDepartment || "",
            user: leaveData.user._id as string,
            dateOfFiling: new Date().toString(),
            position: leaveData.position || "NONE",
            salary: leaveData.salary || 0,

            // Initialize detailsOfApplication
            detailsOfApplication: {
              typeOfLeave: {
                vacation: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.vacation),
                mandatory: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.mandatory),
                sick: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.sick),
                maternity: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.maternity),
                paternity: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.paternity),
                specialPrivilege: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.specialPrivilege),
                soloParent: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.soloParent),
                study: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.study),
                vawc: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.vawc),
                rehabilitation: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.rehabilitation),
                women: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.women),
                emergency: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.emergency),
                adoption: Boolean(leaveData.detailsOfApplication?.typeOfLeave?.adoption),
                other: leaveData.detailsOfApplication?.typeOfLeave?.other || null,
              },
              leaveDetails: {
                vacationDetails: {
                  withinPH: Boolean(leaveData.detailsOfApplication?.leaveDetails?.vacationDetails?.withinPH),
                  abroad: Boolean(leaveData.detailsOfApplication?.leaveDetails?.vacationDetails?.abroad),
                  abroadDetail: leaveData.detailsOfApplication?.leaveDetails?.vacationDetails?.abroadDetail || null,
                },
                sickLeaveDetails: {
                  inHospital: Boolean(leaveData.detailsOfApplication?.leaveDetails?.sickLeaveDetails?.inHospital),
                  outPatient: Boolean(leaveData.detailsOfApplication?.leaveDetails?.sickLeaveDetails?.outPatient),
                  inHospitalDetail:
                    leaveData.detailsOfApplication?.leaveDetails?.sickLeaveDetails?.inHospitalDetail || null,
                  outPatientDetail:
                    leaveData.detailsOfApplication?.leaveDetails?.sickLeaveDetails?.outPatientDetail || null,
                },
                studyLeaveDetails: {
                  masterDegree: Boolean(leaveData.detailsOfApplication?.leaveDetails?.studyLeaveDetails?.masterDegree),
                  boardExam: Boolean(leaveData.detailsOfApplication?.leaveDetails?.studyLeaveDetails?.boardExam),
                },
                otherPurpose: {
                  monitization: Boolean(leaveData.detailsOfApplication?.leaveDetails?.otherPurpose?.monitization),
                  terminalLeave: Boolean(leaveData.detailsOfApplication?.leaveDetails?.otherPurpose?.terminalLeave),
                },
                womenSpecialLeaveDetails:
                  leaveData.detailsOfApplication?.leaveDetails?.womenSpecialLeaveDetails || null,
              },
              leaveDuration: {
                inclusiveDates: leaveData.detailsOfApplication?.leaveDuration?.inclusiveDates || "",
                numberOfDays: leaveData.detailsOfApplication?.leaveDuration?.numberOfDays || "",
                commutationRequested: Boolean(leaveData.detailsOfApplication?.leaveDuration?.commutationRequested),
                commutationNotRequested: Boolean(
                  leaveData.detailsOfApplication?.leaveDuration?.commutationNotRequested,
                ),
              },
            },

            // Initialize recommendation
            reccomendation: {
              approval: Boolean(leaveData.reccomendation?.approval),
              disapproval: Boolean(leaveData.reccomendation?.disapproval),
              disapprovalDetail: leaveData.reccomendation?.disapprovalDetail || "",
            },

            // Initialize commutation
            commutation: {
              forApproval: Boolean(leaveData.commutation?.forApproval),
              forDisApproval: Boolean(leaveData.commutation?.forDisApproval),
            },

            // Initialize other fields
            disapproveFor: leaveData.disapproveFor || "",
            specialOrderNo: leaveData.specialOrderNo || "",
            date: leaveData.date || format(new Date(), "MMMM dd yyyy"),
            period: leaveData.period || "",
            approverName: leaveData.approverName || "",
            approverDesignation: leaveData.approverDesignation || "",

            // Set default approvers
            leaveCreditApprover: "GRACE S. PAGUNSAN",
            leaveCreditApproverPosition: "Administrative Officer V",
            specialOrderApprover: "JUN-NILLOU D. DULPO EdD",
            specialOrderApproverPosition: "Assistant Schools Division Superintendent",

            status: leaveData.status || undefined,
          })
          setUserDetail(leaveData.user);
          form.trigger()
        }
      }
      else if(userData){
        setUserDetail(userData);
        form.reset({
          detailsOfApplication: {
            typeOfLeave: {
              vacation: true,
              mandatory: false,
              sick: false,
              maternity:  false,
              paternity:  false,
              specialPrivilege: false,
              soloParent: false,
              study:  false,
              vawc: false,
              rehabilitation: false,
              women: false,
              emergency: false,
              adoption: false,
              other: null, // Allow nullable value
            }, 
            leaveDuration: {
              numberOfDays: '1 Days',
              inclusiveDates: '',
              commutationRequested: false,
              commutationNotRequested: false,
            },
          },
          commutation: {
            forApproval: true ,
            forDisApproval: false,
          },
          reccomendation:{
            approval: true,
            disapproval: false,
            disapprovalDetail: ''
          },
          date: format(new Date(), "MMMM dd yyyy"),
          period: '',
          
        }),
        form.setValue('dateOfFiling', new Date().toString())
        form.setValue('position', userData.position || 'NONE')
        form.setValue('salary', userData.salary || 0)
        form.setValue('user', id as string);
        form.setValue('officeDepartment', userData.officeDepartment)
        form.setValue('leaveCreditApprover', "GRACE S. PAGUNSAN")
        form.setValue('leaveCreditApproverPosition', "Administrative Officer V") 
        form.setValue('specialOrderApprover', "JUN-NILLOU D. DULPO EdD")
        form.setValue('specialOrderApproverPosition', "Assistant Schools Division Superintendent")
        form.trigger()
      }else if(!userLoading){
        navigate('/')
      }
    }
    init()
  }, [userData,leaveData])

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-[8.5in] mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {Object.keys(errors).length > 0 && (
            <div className="p-3 mb-4 border border-red-200 rounded bg-red-50">
              <h3 className="font-medium text-red-600">Please correct the following errors:</h3>
              <ul className="pl-5 mt-2 space-y-1 text-sm text-red-600 list-disc">
                {errors.user && <li>User information is required</li>}

                {/* Leave Duration */}
                {errors.detailsOfApplication?.leaveDuration?.numberOfDays && (
                  <li>Number of days is required and must be at least 1</li>
                )}
                {errors.detailsOfApplication?.leaveDuration?.inclusiveDates && <li>Inclusive dates are required</li>}
                {errors.detailsOfApplication?.leaveDuration?.commutationRequested &&
                  errors.detailsOfApplication?.leaveDuration?.commutationNotRequested && (
                    <li>Please select either "Commutation Requested" or "Not Requested"</li>
                  )}

                {/* Leave Credits */}
                {errors.certifiedLeaveCredit?.asOf && <li>Leave credit certification date is required</li>}
                {errors.certifiedLeaveCredit?.lessThisApplicationVacationLeave && (
                  <li>Vacation leave deduction must be a non-negative number</li>
                )}
                {errors.certifiedLeaveCredit?.lessThisApplicationSickLeave && (
                  <li>Sick leave deduction must be a non-negative number</li>
                )}

                {/* Approval Information */}
                {errors.date && <li>Date is required</li>}
                {errors.period && <li>Period is required</li>}
                {errors.approverName && <li>Approver name is required</li>}
                {errors.approverDesignation && <li>Approver designation is required</li>}

                {/* Recommendation */}
                {errors.reccomendation?.disapprovalDetail && <li>Disapproval reason is required when disapproved</li>}

                {/* Type of Leave */}
                {errors.detailsOfApplication?.typeOfLeave && <li>Please select at least one type of leave</li>}
              </ul>
            </div>
          )}
          <div className="mb-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-400"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </button>
            {submitError && (
              <div className="p-2 mt-2 text-red-600 border border-red-200 rounded bg-red-50">{submitError}</div>
            )}
            {Object.keys(errors).length > 0 && (
              <div className="p-2 mt-2 text-red-600 border border-red-200 rounded bg-red-50">
                Please fix the errors in the form before submitting.
              </div>
            )}
          </div>
          <div ref={formRef} className="p-0 bg-white rounded-lg shadow-lg form-container">
      {/* Logo at the top */}
      <div className="flex justify-center w-full py-4">
        <img
          src={"/placeholder.svg"}
          alt="Department of Education Logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>

      <div className="form-header">
        <div className="form-number">
          <p>Civil Service Form No. 6</p>
          <p>Revised 2020</p>
        </div>
        <div className="form-title">
          <p className="republic">Republic of the Philippines</p>
          <p className="department">Department of Education</p>
          <p className="region">REGION VIII</p>
          <p className="division">SCHOOLS DIVISION OF CALBAYOG CITY</p>
        </div>
        <h1 className="form-name">APPLICATION FOR LEAVE</h1>
        <div className="annex">ANNEX A</div>
      </div>

      <div className="form-body">
        <div className="form-section basic-info">
          <div className="grid-2">
            <div className="form-field">
              <label>1. OFFICE/DEPARTMENT</label>
              <p className="field-value">{userDetail?.officeDepartment}</p>
            </div>
            <div className="form-field">
              <label>2. NAME</label>
              <div className="name-fields">
                <div>
                  <p className="field-value">{userDetail?.firstName}</p>
                  <span className="field-label">(Last)</span>
                </div>
                <div>
                  <p className="field-value">{userDetail?.lastName}</p>
                  <span className="field-label">(First)</span>
                </div>
                <div>
                  <p className="field-value">{userDetail?.middleName}</p>
                  <span className="field-label">(Middle)</span>
                </div>
              </div>
            </div>
          </div>
          <div className="grid-3">
            <div className="form-field">
              <label>3. DATE OF FILING</label>
              <p className="text-center field-value">
                {format(
                  form.getValues("dateOfFiling") ? new Date(form.getValues("dateOfFiling")) : new Date(),
                  "MMMM dd yyyy",
                )}
              </p>
            </div>
            <div className="form-field">
              <label>4. POSITION</label>
              <p className="text-center field-value">{form.getValues("position")}</p>
            </div>
            <div className="form-field">
              <label>5. SALARY</label>
              <p className="text-center field-value">₱ {form.getValues("salary")}</p>
            </div>
          </div>
        </div>

        <div className="border-t-2 border-black form-section details-application">
          <h2 className="border-b-2 border-black section-title">6. DETAILS OF APPLICATION</h2>
          <div className="p-2 grid-2 ">
            <div className=" leave-types">
              <h3>6.A TYPE OF LEAVE TO BE AVAILED OF</h3>
              <div className="leave-options">
                {[
                  {
                    id: "vacation",
                    label: "Vacation Leave",
                    path: "detailsOfApplication.typeOfLeave.vacation",
                    citation: "(Sec. 51, Rule XVI, Omnibus Rules Implementing E.O. No. 292)",
                  },
                  {
                    id: "mandatory",
                    label: "Mandatory/Forced Leave",
                    path: "detailsOfApplication.typeOfLeave.mandatory",
                    citation: "(Sec. 25, Rule XVI, Omnibus Rules Implementing E.O. No. 292)",
                  },
                  {
                    id: "sick",
                    label: "Sick Leave",
                    path: "detailsOfApplication.typeOfLeave.sick",
                    citation: "(Sec. 43, Rule XVI, Omnibus Rules Implementing E.O. No. 292)",
                  },
                  {
                    id: "maternity",
                    label: "Maternity Leave",
                    path: "detailsOfApplication.typeOfLeave.maternity",
                    citation: "(R.A. No. 11210 / IRR issued by CSC, DOLE and SSS)",
                  },
                  {
                    id: "paternity",
                    label: "Paternity Leave",
                    path: "detailsOfApplication.typeOfLeave.paternity",
                    citation: "(R.A. No. 8187 / CSC MC No. 71, s. 1998, as amended)",
                  },
                  {
                    id: "special",
                    label: "Special Privilege Leave",
                    path: "detailsOfApplication.typeOfLeave.specialPrivilege",
                    citation: "(Sec. 21, Rule XVI, Omnibus Rules Implementing E.O. No. 292)",
                  },
                  {
                    id: "solo",
                    label: "Solo Parent Leave",
                    citation: "(RA No. 8972 / CSC MC No. 8, s. 2004)",
                    path: "detailsOfApplication.typeOfLeave.soloParent",
                  },
                  {
                    id: "study",
                    label: "Study Leave",
                    path: "detailsOfApplication.typeOfLeave.study",
                    citation: "(Sec. 68, Rule XVI, Omnibus Rules Implementing E.O. No. 292)",
                  },
                  {
                    id: "vawc",
                    label: "10-Day VAWC Leave",
                    path: "detailsOfApplication.typeOfLeave.vawc",
                    citation: "(RA No. 9262 / CSC MC No. 15, s. 2005)",
                  },
                  {
                    id: "rehab",
                    label: "Rehabilitation Privilege",
                    path: "detailsOfApplication.typeOfLeave.rehabilitation",
                    citation: "(Sec. 55, Rule XVI, Omnibus Rules Implementing E.O. No. 292)",
                  },
                  {
                    id: "women",
                    label: "Special Leave Benefits for Women",
                    path: "detailsOfApplication.typeOfLeave.women",
                    citation: "(RA No. 9710 / CSC MC No. 25, s. 2010)",
                  },
                  {
                    id: "emergency",
                    label: "Special Emergency (Calamity) Leave",
                    path: "detailsOfApplication.typeOfLeave.emergency",
                    citation: "(CSC MC No. 2, s. 2012, as amended)",
                  },
                  {
                    id: "adoption",
                    path: "detailsOfApplication.typeOfLeave.adoption",
                    label: "Adoption Leave",
                    citation: "(R.A. No. 8552)",
                  },
                ].map((leave) => (
                  <div key={leave.id} className="leave-option">
                    <input type="checkbox" id={leave.id} {...register(leave.path as any, { value: leave.id as any })} />
                    <label className="text-[10px]" htmlFor={leave.id}>
                      {leave.label}
                    </label>
                    <span className="citation">{leave.citation}</span>
                  </div>
                ))}
              </div>
              <div className="pt-20 other-leave">
                <label>Others:</label>
                <div className="pt-10 pb-2 underline-field">
                  {showStaticView ? (
                    <span className="w-full pb-5 text-center">
                      {form.getValues("detailsOfApplication.typeOfLeave.other")}
                    </span>
                  ) : (
                    <input type="text" {...register("detailsOfApplication.typeOfLeave.other")} />
                  )}
                </div>
              </div>
            </div>
            <div className="leave-details">
              <h3>6.B DETAILS OF LEAVE</h3>
              <div className="leave-specifics">
                <p className="detail-header">In case of Vacation/Special Privilege Leave:</p>
                <div className="indent-section">
                  <div className="checkbox-line">
                    <input
                      type="checkbox"
                      id="within-ph"
                      value="within-ph"
                      {...register("detailsOfApplication.leaveDetails.vacationDetails.withinPH")}
                    />
                    <label htmlFor="within-ph">Within the Philippines</label>
                  </div>
                  <div className="checkbox-line">
                    <input
                      type="checkbox"
                      id="abroad"
                      value="abroad"
                      {...register("detailsOfApplication.leaveDetails.vacationDetails.abroad")}
                    />

                    <label htmlFor="abroad">Abroad (Specify)</label>
                    <div className="pb-2 mb-0 underline-field">
                      {showStaticView ? (
                        <span className="w-full pb-5 text-center">
                          {form.getValues("detailsOfApplication.leaveDetails.vacationDetails.abroadDetail")}
                        </span>
                      ) : (
                        <input
                          type="text"
                          className="w-full text-center"
                          id="abroad-location"
                          {...register("detailsOfApplication.leaveDetails.vacationDetails.abroadDetail")}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <p className="detail-header">In case of Sick Leave:</p>
                <div className="indent-section">
                  <div className="checkbox-line">
                    <input
                      type="checkbox"
                      id="in-hospital"
                      value="in-hospital"
                      {...register("detailsOfApplication.leaveDetails.sickLeaveDetails.inHospital")}
                    />
                    <label htmlFor="in-hospital">In Hospital (Specify Illness)</label>
                    <div className="pb-2 underline-field">
                      {showStaticView ? (
                        <span className="w-full pb-5 text-center">
                          {form.getValues("detailsOfApplication.leaveDetails.sickLeaveDetails.inHospitalDetail")}
                        </span>
                      ) : (
                        <input
                          type="text"
                          className="w-full text-center"
                          {...register("detailsOfApplication.leaveDetails.sickLeaveDetails.inHospitalDetail")}
                        />
                      )}
                    </div>
                  </div>
                  <div className="checkbox-line">
                    <input
                      type="checkbox"
                      id="out-patient"
                      value="out-hospital"
                      {...register("detailsOfApplication.leaveDetails.sickLeaveDetails.outPatient")}
                    />
                    <label htmlFor="out-patient">Out Patient (Specify Illness)</label>
                    <div className="pb-2 mb-0 underline-field">
                      {showStaticView ? (
                        <span className="w-full pb-5 text-center">
                          {form.getValues("detailsOfApplication.leaveDetails.sickLeaveDetails.outPatientDetail")}
                        </span>
                      ) : (
                        <input
                          className="w-full text-center"
                          type="text"
                          {...register("detailsOfApplication.leaveDetails.sickLeaveDetails.outPatientDetail")}
                        />
                      )}
                    </div>
                  </div>
                  <div className="pb-2 mb-0 underline-field">
                    <input type="text" readOnly />
                  </div>
                </div>
                <p className="detail-header">In case of Special Leave Benefits for Women:</p>
                <div className="flex justify-center indent-section">
                  <p>(Specify Illness)</p>
                  <div className="pb-2 mb-0 underline-field">
                    {showStaticView ? (
                      <span className="w-full pb-5 text-center">
                        {form.getValues("detailsOfApplication.leaveDetails.womenSpecialLeaveDetails")}
                      </span>
                    ) : (
                      <input
                        className="w-full text-center"
                        type="text"
                        {...register("detailsOfApplication.leaveDetails.womenSpecialLeaveDetails")}
                      />
                    )}
                  </div>
                </div>
                <div className="pt-2 pb-2 mb-0 underline-field">
                  <input readOnly className="w-full text-center" type="text" />
                </div>
                <p className="pt-6 leading-5 detail-header-sub">In case of Study Leave:</p>
                <div className="leading-5 indent-section">
                  <div className="checkbox-line">
                    <input
                      type="checkbox"
                      id="masters"
                      value="masters"
                      {...register("detailsOfApplication.leaveDetails.studyLeaveDetails.masterDegree")}
                    />
                    <label htmlFor="masters">Completion of Master's Degree</label>
                  </div>
                  <div className="checkbox-line">
                    <input
                      type="checkbox"
                      id="bar-board"
                      value="bar-board"
                      {...register("detailsOfApplication.leaveDetails.studyLeaveDetails.boardExam")}
                    />
                    <label htmlFor="bar-board">BAR/Board Examination Review</label>
                  </div>
                </div>
                <p className="detail-header-sub">Other purpose:</p>
                <div className="leading-5 indent-section">
                  <div className="checkbox-line">
                    <input
                      type="checkbox"
                      id="monetization"
                      value="monetization"
                      {...register("detailsOfApplication.leaveDetails.otherPurpose.monitization")}
                    />
                    <label htmlFor="monetization">Monetization of Leave Credits</label>
                  </div>
                  <div className="checkbox-line">
                    <input
                      type="checkbox"
                      id="terminal-leave"
                      value="terminal-leave"
                      {...register("detailsOfApplication.leaveDetails.otherPurpose.monitization")}
                    />
                    <label htmlFor="terminal-leave">Terminal Leave</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 border-black border-y-[1px] grid-2 py-3">
            <div className={`working-days w-[75%] text-center`}>
              <h3 className="">6.C NUMBER OF WORKING DAYS APPLIED FOR</h3>
              <div className="pt-2 pb-2 mb-0 underline-field">
                {showStaticView ? (
                  <span className="w-full text-center">
                    {form.getValues("detailsOfApplication.leaveDuration.numberOfDays")}
                  </span>
                ) : (
                  <input
                    className="w-full text-center"
                    type="text"
                    {...register("detailsOfApplication.leaveDuration.numberOfDays")}
                  />
                )}
              </div>
              <div className="inclusive-dates">
                <p className="detail-header">INCLUSIVE DATES</p>
                <div className="pt-2 pb-2 mb-0 underline-field">
                  {showStaticView ? (
                    <span className="w-full pb-5 text-center">
                      {form.getValues("detailsOfApplication.leaveDuration.inclusiveDates")}
                    </span>
                  ) : (
                    <input
                      className="w-full text-center"
                      type="text"
                      {...register("detailsOfApplication.leaveDuration.inclusiveDates")}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="commutation">
              <h3>6.D COMMUTATION</h3>
              <div className="radio-options detail-header-sub">
                <div className="radio-line">
                  <input type="checkbox" {...register("detailsOfApplication.leaveDuration.commutationRequested")} />
                  <label htmlFor="not-requested">Not Requested</label>
                </div>
                <div className="radio-line">
                  <input type="checkbox" {...register("detailsOfApplication.leaveDuration.commutationNotRequested")} />
                  <label htmlFor="requested">Requested</label>
                </div>
              </div>
              <div className="signature-block">
                <div className="pt-2 pb-2 mb-0 underline-field">
                  <p className="w-full pb-2 text-center uppercase signature-name">{`${userData?.lastName} ${userData?.firstName}`}</p>
                </div>
                <p className="signature-label">(Signature of Applicant)</p>
              </div>
            </div>
          </div>
          <h2 className="border-black border-y-[1px] mt-1 py-2 section-title">7. DETAILS OF ACTION ON APPLICATION</h2>
          <div className="grid-2 border-black border-t-[1px]">
            <div className="px-2 mt-2 certification">
              <h3>7.A CERTIFICATION OF LEAVE CREDITS</h3>
              <div className="flex pt-2 pb-1">
                <p className="">As of </p>
                <div className="underline-field">
                  <p></p>
                </div>
              </div>
              <table className="credits-table">
                <thead>
                  <tr>
                    <th></th>
                    <th className="pb-2">Vacation Leave</th>
                    <th>Sick Leave</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="italic">Total Earned</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="italic">Less this application</td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td className="italic">Balance</td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
              <div className="officer-signature">
                <div className="signature-line"></div>
                <p className="officer-name">
                  {showStaticView ? (
                    <span className="w-full pb-5 text-center">{form.getValues("leaveCreditApprover")}</span>
                  ) : (
                    <input type="text" {...register("leaveCreditApprover")} />
                  )}
                </p>
                <p className="officer-title">
                  {showStaticView ? (
                    <span className="w-full pb-5 text-center">{form.getValues("leaveCreditApproverPosition")}</span>
                  ) : (
                    <input type="text" {...register("leaveCreditApproverPosition")} />
                  )}
                </p>
              </div>
            </div>
            <div className="mt-2 recommendation">
              <h3>7.B RECOMMENDATION</h3>
              <div className="px-5 leading-5 recommendation-options">
                <div className="mt-5 checkbox-line">
                  <input type="checkbox" id="for-approval" value="approval" {...register("reccomendation.approval")} />
                  <label htmlFor="for-approval">For approval</label>
                </div>
                <div className="checkbox-line">
                  <input
                    type="checkbox"
                    id="for-disapproval"
                    value="disapproval"
                    {...register("reccomendation.disapproval")}
                  />
                  <label htmlFor="for-disapproval">For disapproval due to</label>
                  <div className="pb-2 underline-field">
                    {showStaticView ? (
                      <span className="w-full pb-5 text-center">
                        {form.getValues("reccomendation.disapprovalDetail")}
                      </span>
                    ) : (
                      <input type="text" className="w-full" {...register("reccomendation.disapprovalDetail")} />
                    )}
                  </div>
                </div>
                <div className="pb-2 underline-field">
                  <input type="text" className="w-full" readOnly />
                </div>
                <div className="pb-2 underline-field">
                  <input type="text" className="w-full" readOnly />
                </div>
                <div className="pb-2 underline-field">
                  <input type="text" className="w-full" readOnly />
                </div>
              </div>
              <div className="officer-signature">
                <div className="signature-line"></div>
                <p className="signature-label">(Authorized Officer)</p>
              </div>
            </div>
          </div>
          <div className="mt-10 grid-2 border-y-[1px] border-black px-2 py-2">
            <div className="my-2 approval">
              <h3>7.C APPROVED FOR:</h3>
              <p className="approval-line">
                <p>______days with pay</p>
              </p>
              <p className="approval-line">
                <p>______days without pay</p>
              </p>
            </div>
            <div className="my-2 disapproval">
              <h3>7.D DISAPPROVED DUE TO:</h3>
              <div className="disapproval-lines">
                <div className="pt-2 pb-2 mb-0 underline-field">
                  {showStaticView ? (
                    <span className="w-full pb-5 text-center signature-name">{form.getValues("disapproveFor")}</span>
                  ) : (
                    <input className="w-full text-center signature-name" type="text" {...register("disapproveFor")} />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full p-2 text-center">
            <div className="superintendent-signature">
              <p className="officer-name">
                {showStaticView ? (
                  <span className="w-full pb-5 text-center">{form.getValues("specialOrderApprover")}</span>
                ) : (
                  <input type="text" className="w-full text-center" {...register("specialOrderApprover")} />
                )}
              </p>
              <p className="officer-title ">
                {showStaticView ? (
                  <span className="w-full pb-5 text-center">{form.getValues("specialOrderApproverPosition")}</span>
                ) : (
                  <input type="text" {...register("specialOrderApproverPosition")} />
                )}
              </p>
              <p className="officer-position">Officer In-Charge</p>
              <p className="office-title">Office of the Schools Division Superintendent</p>
            </div>
          </div>

          <div className="p-2 special-order-section">
            <div className="order-number">
              <span className="label">SPECIAL ORDER No.</span>
              <div className="w-[10px] pt-2 pb-2 mb-0 underline-field">
                {showStaticView ? (
                  <span className="w-full pb-5 text-center signature-name">{form.getValues("specialOrderNo")}</span>
                ) : (
                  <input className="w-full text-center signature-name" type="text" {...register("specialOrderNo")} />
                )}
              </div>
              <p className="date-line">Date: </p>
              <div className="w-[10px] pt-2 pb-2 mb-0 underline-field">
                {showStaticView ? (
                  <span className="w-full pb-5 text-center signature-name">{form.getValues("date")}</span>
                ) : (
                  <input className="w-full text-center signature-name" type="text" {...register("date")} />
                )}
              </div>
            </div>

            <div className="ml-20 order-content">
              <p className="ml-10 order-text">
                The application for leave of absence with/without pay for the period
                {showStaticView ? (
                  <span className="w-[150px] text-center border-b border-black mx-1 pb-5">
                    {form.getValues("period")}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="w-[150px] text-center border-b border-black mx-1"
                    {...register("period")}
                  />
                )}{" "}
                of
                {showStaticView ? (
                  <span className="w-[150px] text-center border-b border-black mx-1 pb-5">
                    {form.getValues("period")}
                  </span>
                ) : (
                  <input
                    type="text"
                    className="w-[150px] text-center border-b border-black mx-1"
                    {...register("period")}
                  />
                )}{" "}
                of Calbayog City
              </p>

              <div className="applicant-details">
                <div className="name-line">
                  <span>Mr./Mrs./Ms.</span>
                  <div className="pb-2 underline-field">
                    {showStaticView ? (
                      <span className="w-full pb-5 text-center">{form.getValues("approverName")}</span>
                    ) : (
                      <input type="text" className="w-full" {...register("approverName")} />
                    )}
                  </div>
                  <div className="pb-2 underline-field">
                    {showStaticView ? (
                      <span className="w-full pb-5 text-center">{form.getValues("approverDesignation")}</span>
                    ) : (
                      <input type="text" className="w-full" {...register("approverDesignation")} />
                    )}
                  </div>
                </div>
                <div className="flex text-center justify-evenly">
                  <span className="float-right name-label">Name</span>
                  <span className="designation-label">Designation</span>
                </div>
              </div>

              <p className="executive-order">
                Division is hereby approved/disapproved in accordance with Executive Order No. 264 dated January 19,
                1971. Same are being offset to his/her credits.
              </p>
            </div>
          </div>
          <p className="pr-2 authority-line">By Authority of the DepEd Regional Director:</p>

          <div className="p-2">
            <div className="float-right final-signature">
              <p className="superintendent-name">MARGARITO A. CADAYONA JR., PhD.,CESO VI</p>
              <p className="superintendent-title">OIC - Schools Division Superintendent</p>
            </div>

            <div className="copy-furnished">
              <p className="copy-label">Copy Furnished:</p>
              <p className="copy-item">Concerned</p>
              <p className="copy-item">Division Office File</p>
              <p className="copy-item">Office File</p>
            </div>
          </div>
        </div>
      </div>
    </div>
        </form>
      </div>
    </main>
  )
}

