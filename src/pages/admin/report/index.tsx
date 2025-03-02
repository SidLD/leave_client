"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { usePDF } from "react-to-pdf"
import { getUserLeavesReport } from "@/lib/api"

export default function LeaveCard() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { toPDF, targetRef } = usePDF({
    filename: "leave-card.pdf",
    page: { orientation: "landscape" },
  })

  const {
    data: report,
    isLoading,
    error,
  } = useQuery<any>({
    queryKey: ["leave_report", userId],
    queryFn: () => getUserLeavesReport({ userId: userId as string }).then((data) => data.data),
    enabled: !!userId,
  })

  useEffect(() => {
    if (!userId) {
      navigate("/")
    }
  }, [userId, navigate])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>
  if (!report || report.length <= 0) return null

  const { user, leaves } = report[0]

  return (
    <div className="container p-4 mx-auto">
      <style>{`
        @media print {
          @page {
            size: landscape;
            margin: 1cm;
          }

          body * {
            visibility: hidden;
          }

          .print\:p-4,
          .print\:p-4 * {
            visibility: visible;
          }

          .print\:p-4 {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          button {
            display: none !important;
          }

          .table-header-cell,
          .table-cell {
            border: 2px solid #000 !important;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }
        }
      `}</style>
      <Card className="border-0 shadow-none">
        <CardContent>
          <div className="flex justify-end mb-4">
            <Button onClick={() => toPDF()}>Download PDF</Button>
          </div>
          <div ref={targetRef} className="print:p-4">
            <div className="p-4 mb-4 border-2 border-black rounded-md">
              <div className="mb-4 text-center">
                <h1 className="text-2xl font-bold">EMPLOYEE&apos;S LEAVE CARD</h1>
                <h2 className="text-xl">DIVISION OF CALBAYOG CITY</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="col-span-2">
                  <span className="font-semibold">Name: </span>
                  <span>
                    {user.firstName} {user.middleName} {user.lastName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">1st Day of Service: </span>
                  <span>{format(new Date(), "MMM. dd, yyyy")}</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto border-black rounded-md ">
              <Table className="[&_tr:hover]:bg-transparent [&_th]:border-2 [&_th]:border-black [&_td]:border-2 [&_td]:border-black [&_th]:p-2 [&_td]:p-2">
                {/* TableHeader and TableBody remain the same */}
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium text-center bg-muted/50" rowSpan={3}>
                      PERIOD
                    </TableHead>
                    <TableHead className="font-medium text-center bg-muted/50" rowSpan={3}>
                      PARTICULAR
                    </TableHead>
                    <TableHead className="font-medium text-center bg-muted/50" colSpan={2}>
                      LEAVE PREVIOUSLY ENJOYED
                    </TableHead>
                    <TableHead className="font-medium text-center bg-muted/50" colSpan={4}>
                      LEAVE CREDIT EARNED
                    </TableHead>
                    <TableHead className="font-medium text-center bg-muted/50" colSpan={3}>
                      VACATION
                    </TableHead>
                    <TableHead className="font-medium text-center bg-muted/50" colSpan={3}>
                      SICK
                    </TableHead>
                    <TableHead className="font-medium text-center bg-muted/50" rowSpan={3}>
                      DATE AND ACTION TAKEN ON APPLICATION FOR LEAVE
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium text-center bg-muted/50">VACATION</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">SICK</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50" colSpan={2}>
                      MONTHLY BASIS
                    </TableHead>
                    <TableHead className="font-medium text-center bg-muted/50" colSpan={2}>
                      PLUS 1st Day of Service up to...
                    </TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">ABS UND. W/ PAY</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">BALANCE</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">ABS UND. W/OUT PAY</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">ABS UND. W/ PAY</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">BALANCE</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">ABS UND. W/OUT PAY</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-medium text-center bg-muted/50"></TableHead>
                    <TableHead className="font-medium text-center bg-muted/50"></TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">VACATION</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">SICK</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">VACATION</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50">SICK</TableHead>
                    <TableHead className="font-medium text-center bg-muted/50"></TableHead>
                    <TableHead className="font-medium text-center bg-muted/50"></TableHead>
                    <TableHead className="font-medium text-center bg-muted/50"></TableHead>
                    <TableHead className="font-medium text-center bg-muted/50"></TableHead>
                    <TableHead className="font-medium text-center bg-muted/50"></TableHead>
                    <TableHead className="font-medium text-center bg-muted/50"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves[0] && leaves[0].leaveRecords.map((record: { _id: Key | null | undefined; dateStart: string | number | Date; leaveType: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; credit: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined; isProcess: any }) => (
                    <TableRow key={record._id}>
                      <TableCell className="text-sm text-center whitespace-nowrap">
                        {format(new Date(record.dateStart), "MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">{record.leaveType}</TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">{record.credit}</TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">{record.credit}</TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">
                        {leaves[0].leaveDetail.credit}
                      </TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">
                        {leaves[0].leaveDetail.credit}
                      </TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">
                        {leaves[0].leaveDetail.credit}
                      </TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">
                        {leaves[0].leaveDetail.credit}
                      </TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">{record.credit}</TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">{record.credit}</TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">
                        {leaves[0].leaveDetail.used}
                      </TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">
                        {leaves[0].leaveDetail.used}
                      </TableCell>
                      <TableCell className="text-sm text-center whitespace-nowrap">
                        {record.isProcess ? "SO# " + record._id : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

