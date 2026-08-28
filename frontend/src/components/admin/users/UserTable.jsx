import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Ban, Trash2, Shield, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

const roleConfig = {
  ROLE_JOB_SEEKER: { label: "Job Seeker", className: "bg-blue-50 text-blue-700 border-blue-200" },
  ROLE_EMPLOYER: { label: "Employer", className: "bg-purple-50 text-purple-700 border-purple-200" },
  ROLE_ADMIN: { label: "Admin", className: "bg-red-50 text-red-700 border-red-200" },
}

const statusConfig = {
  ACTIVE: { label: "Active", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  INACTIVE: { label: "Inactive", dot: "bg-slate-400", text: "text-slate-500", bg: "bg-slate-100" },
  SUSPENDED: { label: "Suspended", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
  DELETED: { label: "Deleted", dot: "bg-red-500", text: "text-red-700", bg: "bg-red-50" },
}

const avatarColors = [
  "from-blue-400 to-blue-600",
  "from-purple-400 to-purple-600",
  "from-emerald-400 to-emerald-600",
  "from-orange-400 to-orange-600",
  "from-pink-400 to-pink-600",
  "from-cyan-400 to-cyan-600",
]

function getInitials(fullName) {
  if (!fullName) return "U"
  const parts = fullName.trim().split(" ")
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U"
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

function SkeletonRow() {
  return (
    <TableRow className="border-slate-100">
      <TableCell className="pl-6"><Skeleton className="h-4 w-4" /></TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-14" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell />
    </TableRow>
  )
}

export default function UserTable({
  users,
  isLoading,
  isActionLoading,
  onSuspend,
  onActivate,
  onDelete,
  onChangeRole,
  onViewDetail,
}) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-10 pl-6">#</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Provider</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Joined</TableHead>
              <TableHead className="w-12 pr-4" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
        <p className="text-slate-400 text-sm">No users match your filters.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50 border-slate-200">
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider w-10 pl-6">#</TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">User</TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Role</TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Provider</TableHead>
            <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Joined</TableHead>
            <TableHead className="w-12 pr-4" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => {
            const role = roleConfig[user.role] || roleConfig.ROLE_JOB_SEEKER
            const status = statusConfig[user.status] || statusConfig.ACTIVE
            const initials = getInitials(user.fullName)
            const avatarColor = avatarColors[index % avatarColors.length]
            const joinedAt = user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"

            return (
              <TableRow key={user.id} className="group hover:bg-slate-50/50 border-slate-100">
                <TableCell className="text-sm text-slate-400 font-medium pl-6">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 shrink-0">
                      {user.profileImage && <AvatarImage src={user.profileImage} alt={user.fullName} />}
                      <AvatarFallback
                        className={`bg-gradient-to-br ${avatarColor} text-white text-xs font-bold`}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 leading-tight">
                        {user.fullName || "—"}
                      </p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs font-semibold px-2 py-0.5 border", role.className)}
                  >
                    {role.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      status.bg
                    )}
                  >
                    <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", status.dot)} />
                    <span className={status.text}>{status.label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500 font-medium capitalize">
                    {user.authProvider === "GOOGLE" ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="font-black text-[11px]">G</span> Google
                      </span>
                    ) : (
                      "Local"
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-400">{joinedAt}</span>
                </TableCell>
                <TableCell className="pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isActionLoading}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="text-xs text-slate-500 font-normal">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewDetail?.(user)}>
                        <Eye className="h-3.5 w-3.5 mr-2" /> View Profile
                      </DropdownMenuItem>

                      {/* Change Role sub-menu */}
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Shield className="h-3.5 w-3.5 mr-2" /> Change Role
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          {["ROLE_JOB_SEEKER", "ROLE_EMPLOYER", "ROLE_ADMIN"].map((r) => (
                            <DropdownMenuItem
                              key={r}
                              disabled={user.role === r}
                              onClick={() => onChangeRole?.(user.id, r)}
                            >
                              {user.role === r && <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500" />}
                              {roleConfig[r]?.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />

                      {user.status === "SUSPENDED" ? (
                        <DropdownMenuItem
                          className="text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50"
                          onClick={() => onActivate?.(user.id)}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Activate User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                          onClick={() => onSuspend?.(user.id)}
                          disabled={user.status === "DELETED"}
                        >
                          <Ban className="h-3.5 w-3.5 mr-2" /> Suspend User
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        onClick={() => onDelete?.(user)}
                        disabled={user.status === "DELETED"}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
