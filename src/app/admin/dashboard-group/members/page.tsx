import dbConnect from "@/lib/db";
import Registration from "@/models/ClubRegistration";
import type { IClubRegistration, IMember } from "@/models/ClubRegistration";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email";
import { emailTemplates } from "@/lib/emailTemplates";
import DeleteClubMemberButton from "@/components/admin/DeleteClubMemberButton";
import MemberExportButton from "@/components/admin/MemberExportButton";
import { verifyAdmin } from "@/lib/auth";
import { Metadata } from "next";
import MembershipActionButton from "@/components/admin/MembershipActionButton";
import type { Types } from "mongoose";
import { logger } from "@/lib/logger";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Club Members ",
  description: "Manage student and faculty memberships.",
};

const PAGE_SIZE = 25;

const getYearFromRoll = (rollNo: string) => {
  if (!rollNo || rollNo.length < 10) return "N/A";

  const joinYear = parseInt(rollNo.substring(0, 2));
  const typeCode = rollNo.substring(4, 6);
  const now = new Date();
  const currentMonth = now.getMonth();
  let currentAcadYear = parseInt(now.getFullYear().toString().slice(-2));

  if (currentMonth < 6) {
    currentAcadYear -= 1;
  }

  const yearDiff = currentAcadYear - joinYear;

  if (typeCode === "5A") {
    if (yearDiff === 0) return "2nd";
    if (yearDiff === 1) return "3rd";
    if (yearDiff === 2) return "4th";
    return "Alumni";
  }

  if (yearDiff === 0) return "1st";
  if (yearDiff === 1) return "2nd";
  if (yearDiff === 2) return "3rd";
  if (yearDiff === 3) return "4th";

  return "Alumni";
};

const parsePage = (value: string | undefined) => {
  const parsed = Number.parseInt(value || "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const createPagination = (currentPage: number, totalItems: number) => {
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const skip = (safePage - 1) * PAGE_SIZE;

  return { currentPage: safePage, totalPages, skip };
};

const getPageHref = (
  basePath: string,
  studentPage: number,
  facultyPage: number,
  pendingStudentPage: number,
  pendingFacultyPage: number,
  target: "students" | "faculty" | "pendingStudents" | "pendingFaculty",
  nextPage: number,
) => {
  const params = new URLSearchParams({
    studentPage: target === "students" ? String(nextPage) : String(studentPage),
    facultyPage: target === "faculty" ? String(nextPage) : String(facultyPage),
    pendingStudentPage:
      target === "pendingStudents" ? String(nextPage) : String(pendingStudentPage),
    pendingFacultyPage:
      target === "pendingFaculty" ? String(nextPage) : String(pendingFacultyPage),
  });

  return `${basePath}?${params.toString()}`;
};

function PaginationControls({
  currentPage,
  totalPages,
  target,
  studentPage,
  facultyPage,
  pendingStudentPage,
  pendingFacultyPage,
}: {
  currentPage: number;
  totalPages: number;
  target: "students" | "faculty" | "pendingStudents" | "pendingFaculty";
  studentPage: number;
  facultyPage: number;
  pendingStudentPage: number;
  pendingFacultyPage: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-sm text-gray-400">
      <p>
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link
          href={getPageHref(
            "/admin/dashboard-group/members",
            studentPage,
            facultyPage,
            pendingStudentPage,
            pendingFacultyPage,
            target,
            Math.max(1, currentPage - 1),
          )}
          className={`rounded-lg border px-3 py-1.5 transition-colors ${
            currentPage === 1
              ? "pointer-events-none border-white/5 text-gray-600"
              : "border-white/10 hover:border-[#00f0ff] hover:text-white"
          }`}
        >
          Previous
        </Link>
        <Link
          href={getPageHref(
            "/admin/dashboard-group/members",
            studentPage,
            facultyPage,
            pendingStudentPage,
            pendingFacultyPage,
            target,
            Math.min(totalPages, currentPage + 1),
          )}
          className={`rounded-lg border px-3 py-1.5 transition-colors ${
            currentPage === totalPages
              ? "pointer-events-none border-white/5 text-gray-600"
              : "border-white/10 hover:border-[#00f0ff] hover:text-white"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}

async function handleMembershipAction(formData: FormData) {
  "use server";
  await verifyAdmin();

  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await dbConnect();

  try {
    const registration = await Registration.findByIdAndUpdate(id, { status }, { new: true });

    if (!registration) return;

    const member = registration.member || registration.members?.[0];

    if (member && member.email) {
      if (status === "approved") {
        const { subject, html } = emailTemplates.membershipApproved(member.fullName);
        await sendEmail(member.email, subject, html);
      } else if (status === "rejected") {
        const { subject, html } = emailTemplates.membershipRejected(member.fullName);
        await sendEmail(member.email, subject, html);
      }
    }
  } catch (error: unknown) {
    logger.error("Error updating membership status", error, { id, status });
  }

  revalidatePath("/admin/dashboard-group/members");
}

export default async function MembersPage({
  searchParams,
}: {
  searchParams?: Promise<{
    studentPage?: string;
    facultyPage?: string;
    pendingStudentPage?: string;
    pendingFacultyPage?: string;
  }>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const requestedStudentPage = parsePage(resolvedSearchParams.studentPage);
  const requestedFacultyPage = parsePage(resolvedSearchParams.facultyPage);
  const requestedPendingStudentPage = parsePage(resolvedSearchParams.pendingStudentPage);
  const requestedPendingFacultyPage = parsePage(resolvedSearchParams.pendingFacultyPage);

  await dbConnect();
  type LeanRegistration = IClubRegistration & { _id: Types.ObjectId };
  const getMember = (registration: LeanRegistration): IMember => registration.member;
  const membershipSelection = "type status member createdAt";

  const [
    studentApprovedCount,
    facultyApprovedCount,
    studentPendingCount,
    facultyPendingCount,
    studentExportDocs,
  ] = (await Promise.all([
    Registration.countDocuments({ type: "student", status: "approved" }),
    Registration.countDocuments({ type: "faculty", status: "approved" }),
    Registration.countDocuments({ type: "student", status: "pending" }),
    Registration.countDocuments({ type: "faculty", status: "pending" }),
    Registration.find({ type: "student", status: "approved" })
      .select("member")
      .lean(),
  ])) as [
    number,
    number,
    number,
    number,
    LeanRegistration[],
  ];

  const studentPagination = createPagination(requestedStudentPage, studentApprovedCount);
  const facultyPagination = createPagination(requestedFacultyPage, facultyApprovedCount);
  const pendingStudentPagination = createPagination(requestedPendingStudentPage, studentPendingCount);
  const pendingFacultyPagination = createPagination(requestedPendingFacultyPage, facultyPendingCount);

  const [pendingStudents, pendingFaculty, activeStudents, activeFaculty] = (await Promise.all([
    Registration.find({ type: "student", status: "pending" })
      .select(membershipSelection)
      .sort({ createdAt: -1 })
      .skip(pendingStudentPagination.skip)
      .limit(PAGE_SIZE)
      .lean(),
    Registration.find({ type: "faculty", status: "pending" })
      .select(membershipSelection)
      .sort({ createdAt: -1 })
      .skip(pendingFacultyPagination.skip)
      .limit(PAGE_SIZE)
      .lean(),
    Registration.find({ type: "student", status: "approved" })
      .select(membershipSelection)
      .sort({ createdAt: -1 })
      .skip(studentPagination.skip)
      .limit(PAGE_SIZE)
      .lean(),
    Registration.find({ type: "faculty", status: "approved" })
      .select(membershipSelection)
      .sort({ createdAt: -1 })
      .skip(facultyPagination.skip)
      .limit(PAGE_SIZE)
      .lean(),
  ])) as [LeanRegistration[], LeanRegistration[], LeanRegistration[], LeanRegistration[]];

  const studentExportData = studentExportDocs.map((registration) => {
    const mem = getMember(registration);
    return {
      name: mem.fullName || "Unknown",
      rollNumber: mem.rollNo || "N/A",
      email: mem.email || "N/A",
      phone: mem.phone || "N/A",
      branch: mem.branch || "N/A",
      year: getYearFromRoll(mem.rollNo || ""),
      section: mem.section || "N/A",
    };
  });

  const totalPending = studentPendingCount + facultyPendingCount;
  const totalApproved = studentApprovedCount + facultyApprovedCount;

  return (
    <div className="pb-20">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Club Membership Database</h1>
          <p className="mt-2 max-w-3xl text-sm text-gray-400">
            Pending requests stay fully actionable, while approved members are paginated so the page remains fast and the database query stays focused.
          </p>
        </div>
        <MemberExportButton
          members={studentExportData}
          title="MASTMO CLUB MEMBERSHIP LIST"
          fileName="Mastmo_Members_List"
        />
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-gray-400">Approved Members</p>
          <p className="mt-2 text-4xl font-bold text-white">{totalApproved}</p>
          <p className="mt-2 text-xs text-gray-500">
            {studentApprovedCount} students and {facultyApprovedCount} faculty
          </p>
        </div>
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
          <p className="text-sm text-yellow-300">Pending Reviews</p>
          <p className="mt-2 text-4xl font-bold text-white">{totalPending}</p>
          <p className="mt-2 text-xs text-yellow-100/70">
            {studentPendingCount} student requests and {facultyPendingCount} faculty requests
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
          <p className="text-sm text-cyan-300">Students Shown</p>
          <p className="mt-2 text-4xl font-bold text-white">{activeStudents.length}</p>
          <p className="mt-2 text-xs text-cyan-100/70">
            Page {studentPagination.currentPage} of {studentPagination.totalPages}
          </p>
        </div>
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
          <p className="text-sm text-purple-300">Faculty Shown</p>
          <p className="mt-2 text-4xl font-bold text-white">{activeFaculty.length}</p>
          <p className="mt-2 text-xs text-purple-100/70">
            Page {facultyPagination.currentPage} of {facultyPagination.totalPages}
          </p>
        </div>
      </div>

      <div className="mb-16 border-b border-white/10 pb-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-purple-400">Faculty Members</h2>
            <p className="mt-1 text-sm text-gray-500">Pending approvals first, approved faculty in paginated view.</p>
          </div>
          <p className="text-sm text-gray-400">{facultyApprovedCount} approved total</p>
        </div>

        {pendingFaculty.length > 0 && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-yellow-400">
                Pending Approvals ({facultyPendingCount})
              </h3>
              <span className="text-xs text-gray-500">
                Page {pendingFacultyPagination.currentPage} of {pendingFacultyPagination.totalPages}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingFaculty.map((req) => {
                const m = getMember(req);
                return (
                  <div
                    key={req._id.toString()}
                    className="flex items-center justify-between rounded-xl border border-purple-500/30 bg-white/5 p-4"
                  >
                    <div>
                      <h4 className="font-bold text-white">{m?.fullName}</h4>
                      <p className="text-xs text-gray-400">{m?.branch}</p>
                    </div>
                    <div className="flex gap-2">
                      <MembershipActionButton id={req._id.toString()} status="approved" action={handleMembershipAction} />
                      <MembershipActionButton id={req._id.toString()} status="rejected" action={handleMembershipAction} />
                    </div>
                  </div>
                );
              })}
            </div>
            <PaginationControls
              currentPage={pendingFacultyPagination.currentPage}
              totalPages={pendingFacultyPagination.totalPages}
              target="pendingFaculty"
              studentPage={studentPagination.currentPage}
              facultyPage={facultyPagination.currentPage}
              pendingStudentPage={pendingStudentPagination.currentPage}
              pendingFacultyPage={pendingFacultyPagination.currentPage}
            />
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-purple-900/20 text-purple-200">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Department</th>
                <th className="p-4">Contact</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {activeFaculty.map((doc) => {
                const mem = getMember(doc);
                return (
                  <tr key={doc._id.toString()}>
                    <td className="p-4 font-bold">{mem?.fullName}</td>
                    <td className="p-4">{mem?.branch}</td>
                    <td className="p-4 text-gray-400">
                      <div>{mem?.email}</div>
                      <div className="text-xs">{mem?.phone}</div>
                    </td>
                    <td className="p-4 text-center">
                      <DeleteClubMemberButton memberId={doc._id.toString()} />
                    </td>
                  </tr>
                );
              })}
              {activeFaculty.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No active faculty members.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationControls
            currentPage={facultyPagination.currentPage}
            totalPages={facultyPagination.totalPages}
            target="faculty"
            studentPage={studentPagination.currentPage}
            facultyPage={facultyPagination.currentPage}
            pendingStudentPage={pendingStudentPagination.currentPage}
            pendingFacultyPage={pendingFacultyPagination.currentPage}
          />
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#00f0ff]">Student Members</h2>
            <p className="mt-1 text-sm text-gray-500">Approved students are now fetched page by page instead of rendering the full database at once.</p>
          </div>
          <p className="text-sm text-gray-400">{studentApprovedCount} approved total</p>
        </div>

        {pendingStudents.length > 0 && (
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-yellow-400">
                Pending Requests ({studentPendingCount})
              </h3>
              <span className="text-xs text-gray-500">
                Page {pendingStudentPagination.currentPage} of {pendingStudentPagination.totalPages}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {pendingStudents.map((req) => {
                const m = getMember(req);
                return (
                  <div
                    key={req._id.toString()}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5"
                  >
                    <div>
                      <h3 className="font-bold text-white">{m?.fullName}</h3>
                      <p className="text-sm text-gray-400">
                        {m?.rollNo} • {m?.branch}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <MembershipActionButton id={req._id.toString()} status="approved" action={handleMembershipAction} />
                      <MembershipActionButton id={req._id.toString()} status="rejected" action={handleMembershipAction} />
                    </div>
                  </div>
                );
              })}
            </div>
            <PaginationControls
              currentPage={pendingStudentPagination.currentPage}
              totalPages={pendingStudentPagination.totalPages}
              target="pendingStudents"
              studentPage={studentPagination.currentPage}
              facultyPage={facultyPagination.currentPage}
              pendingStudentPage={pendingStudentPagination.currentPage}
              pendingFacultyPage={pendingFacultyPagination.currentPage}
            />
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-gray-400">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Year / Branch</th>
                <th className="p-4">Email</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {activeStudents.map((doc) => {
                const mem = getMember(doc);
                return (
                  <tr key={doc._id.toString()}>
                    <td className="p-4 font-bold text-white">{mem?.fullName}</td>
                    <td className="p-4 font-mono text-gray-300">{mem?.rollNo}</td>
                    <td className="p-4">
                      <span className="font-bold text-[#00f0ff]">{getYearFromRoll(mem?.rollNo || "")} Year</span>
                      <span className="text-gray-400">
                        {" - " + mem?.branch}
                        {mem?.section ? ` (${mem.section})` : ""}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{mem?.email}</td>
                    <td className="p-4 text-center">
                      <DeleteClubMemberButton memberId={doc._id.toString()} />
                    </td>
                  </tr>
                );
              })}
              {activeStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No active student members.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationControls
            currentPage={studentPagination.currentPage}
            totalPages={studentPagination.totalPages}
            target="students"
            studentPage={studentPagination.currentPage}
            facultyPage={facultyPagination.currentPage}
            pendingStudentPage={pendingStudentPagination.currentPage}
            pendingFacultyPage={pendingFacultyPagination.currentPage}
          />
        </div>
      </div>
    </div>
  );
}
