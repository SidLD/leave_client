// import React, { useState, useMemo, useEffect } from 'react';
// import { Trash2, Search } from 'lucide-react';
// import { deleteUser, getUsers, updateUser } from '@/lib/api';
// import { Button } from '@/components/ui/button';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Toaster } from '@/components/ui/toaster'
// import { useToast } from '@/hooks/use-toast'
// import { IUser } from '@/types/userType';

// const UserManagementView: React.FC = () => {
//   const [users, setUsers] = useState<IUser[]>([]);
//   const [search, setSearch] = useState('');
//   const [roleFilter, setRoleFilter] = useState('All');
//   const [statusFilter, setStatusFilter] = useState('All');
//   const { toast } = useToast()

//   const filteredUsers = useMemo(() => {
//     return users.filter(user => 
//       (user.username.toLowerCase().includes(search.toLowerCase()) || 
//        user.email.toLowerCase().includes(search.toLowerCase())) &&
//       (roleFilter === 'All' || user.role === roleFilter) &&
//       (statusFilter === 'All' || user.status === statusFilter)
//     );
//   }, [users, search, roleFilter, statusFilter]);

//   const toggleStatus = async (_id: string, status: string) => {
//     try {
//       const {data} = await updateUser({_id, status}) as unknown as any
//       if(data.acknowledged){
//         toast({
//           title: "Success",
//           description: "Update Success",
//         })
//         await fetchUsers()
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         variant: "destructive",
//         description: "Something went wrong",
//       })
//     }
//   };

//   const toogleDelete = async (_id: string) => {
//     try {
//       const {data} = await deleteUser({_id}) as unknown as any
//       if(data.acknowledged){
//         toast({
//           title: "Success",
//           description: "Delete Success",
//         })
//         await fetchUsers()
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         variant: "destructive",
//         description: "Something went wrong",
//       })
//     }
//   };

//   const roles = ['All', ...Array.from(new Set(users.map(user => user.role)))];
//   const statuses = ['All', ...Array.from(new Set(users.map(user => user.status)))];

//   const fetchUsers = async () => {
//     try {
//       const {data} = await getUsers({}) as unknown as any 
//       setUsers(data.map(
//         (user: UserType, index: number )=> {
//         return {
//           key: index,
//           ...user
//         }
//       }))
//     } catch (error) {
      
//     }
//   }

//   useEffect(() => {
//     void fetchUsers()
//   }, [])

//   return (
//     <div className="container p-6 mx-auto">
//       <h1 className="mb-4 text-2xl font-bold">User Management</h1>
//       <div className="flex flex-col mb-4 md:flex-row md:items-center md:justify-between">
//         <div className="relative mb-2 md:mb-0">
//           <input
//             type="text"
//             placeholder="Search by username or email"
//             className="w-full py-2 pl-10 pr-4 border rounded-md md:w-64"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
//         </div>
//         <div className="flex space-x-2">
//           <select
//             className="px-2 py-1 border rounded-md"
//             value={roleFilter}
//             onChange={(e) => setRoleFilter(e.target.value)}
//           >
//             {roles.map(role => (
//               <option key={role} value={role}>{role}</option>
//             ))}
//           </select>
//           <select
//             className="px-2 py-1 border rounded-md"
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//           >
//             {statuses.map(status => (
//               <option key={status} value={status}>{status}</option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <div className="overflow-x-auto">
//         <Table className="min-w-full bg-white border border-gray-300">
//           <TableHeader>
//             <TableRow className="bg-gray-100">
//               <TableHead className="px-4 py-2 border-b">Username</TableHead>
//               <TableHead className="px-4 py-2 border-b">Email</TableHead>
//               <TableHead className="px-4 py-2 border-b">First Name</TableHead>
//               <TableHead className="px-4 py-2 border-b">Last Name</TableHead>
//               <TableHead className="px-4 py-2 border-b">Middle Name</TableHead>
//               <TableHead className="px-4 py-2 border-b">Role</TableHead>
//               <TableHead className="px-4 py-2 border-b">Status</TableHead>
//               <TableHead className="px-4 py-2 border-b">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredUsers.map((user) => {
//               if(user._id != undefined){
//                 return (
//                   <TableRow key={user._id} className="hover:bg-gray-50">
//                     <TableCell className="px-4 py-2 border-b">{user.username}</TableCell>
//                     <TableCell className="px-4 py-2 border-b">{user.email}</TableCell>
//                     <TableCell className="px-4 py-2 border-b">{user.firstName}</TableCell>
//                     <TableCell className="px-4 py-2 border-b">{user.lastName}</TableCell>
//                     <TableCell className="px-4 py-2 border-b">{user.middleName || '-'}</TableCell>
//                     <TableCell className="px-4 py-2 border-b">{user.role}</TableCell>
//                     <TableCell className="px-4 py-2 border-b">
//                       <span className={`px-2 py-1 rounded-full text-xs ${
//                         user.status === 'APPROVED' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
//                       }`}>
//                         {user.status}
//                       </span>
//                     </TableCell>
//                     <TableCell className="px-4 py-2 border-b">
//                       <div className="flex items-center space-x-2">
//                         {user.status != 'APPROVED' && <Button className="text-gray-600 hover:text-blue-600"
//                           onClick={async () => {
//                             if(user._id != undefined){
//                               await toggleStatus(user._id, 'APPROVED')
//                             }
//                           }}>
//                           APPROVE
//                         </Button>}
//                        {user.status != 'DECLINED' &&  <Button variant='destructive' className="text-gray-600 hover:text-red-600"
//                          onClick={async () => {
//                           if(user._id != undefined){
//                             await toggleStatus(user._id, 'DECLINED')
//                           }
//                           }}>
//                           DECLINE
//                         </Button>}
//                        {user.status == 'DECLINED' &&  <Button variant='destructive' className="text-gray-600 hover:text-red-600" 
//                          onClick={async () => {
//                           if(user._id != undefined){
//                             await toogleDelete(user._id)
//                           }
//                           }}>
//                           <Trash2 size={16} />
//                         </Button>}
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 )
//               }
//             })}
//           </TableBody>
//         </Table>
//       </div>
//       <Toaster  />
//     </div>
//   );
// };

// export default UserManagementView;