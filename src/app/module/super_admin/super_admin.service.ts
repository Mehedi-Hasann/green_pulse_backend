/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, Role, UserStatus, SubmissionStatus } from "../../../generated/prisma";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../interfaces/query.interface";
import status from "http-status";


const getAllAdmins = async (queryParams: IQueryParams) => {
  const adminQueryBuilder = new QueryBuilder(prisma.admin, queryParams, {
    searchableFields: ["name", "email", "phone"],
    filterableFields: ["gender"],
  });

  return await adminQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ user: true })
    .execute();
};

const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!admin) throw new AppError(status.NOT_FOUND, "Admin not found");
  return admin;
};

const updateAdmin = async (id: string, payload: Partial<Prisma.AdminUpdateInput>) => {

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new AppError(status.NOT_FOUND, "Admin not found");

  await prisma.user.update({
    where : {
      id : admin.userId
    },
    data : payload
  })

  return await prisma.admin.update({
    where: { id },
    data: payload,
  });
};

const deleteAdmin = async (id: string) => {
  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) throw new AppError(status.NOT_FOUND, "Admin not found");

  // Delete both Admin profile and User account
  return await prisma.$transaction(async (tx) => {
    await tx.admin.delete({ where: { id } });
    await tx.user.update({ where: { id: admin.userId }, data : {isDeleted : true,status:UserStatus.DELETED} });
  });
};

// --- Member Management ---

const getAllMembers = async (queryParams: IQueryParams) => {
  const memberQueryBuilder = new QueryBuilder(prisma.member, queryParams, {
    searchableFields: ["name", "contactNumber"],
    filterableFields: ["gender", "isDeleted"],
  });

  return await memberQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ user: true })
    .execute();
};

const getMemberById = async (id: string) => {
  const member = await prisma.member.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!member) throw new AppError(status.NOT_FOUND, "Member not found");
  return member;
};

const updateMember = async (id: string, payload: any) => {
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw new AppError(status.NOT_FOUND, "Member not found");

  const result = await prisma.member.update({
    where: { id },
    data: payload,
  });

  await prisma.user.update({
    where : {
      id : result.userId
    },
    data : payload
  })

  return result;
};

const deleteMember = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { member: true },
  });
  console.log(user)
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");
  if (!user.member) throw new AppError(status.NOT_FOUND, "Member profile not found");

  const memberId = user.member.id;

  return await prisma.$transaction(async (tx) => {
    await tx.member.delete({
      where: {
        id: memberId,
      },
    });

    return await tx.user.update({
      where: { id: userId },
      data: { status: UserStatus.DELETED, isDeleted: true },
    });
  });
};

// --- User Control ---

const updateUserStatus = async (userId: string, userStatus: UserStatus) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(status.NOT_FOUND, "User not found");

  const result =  await prisma.user.update({
    where: { id: userId },
    data: { status: userStatus },
  });
  if(!result){
    throw new AppError(status.NOT_FOUND, "User is not Exists")
  }

  if(result.role===Role.ADMIN && userStatus === UserStatus.DELETED){
    await prisma.admin.delete({
      where : {
        userId : result.id
      }
    })
  }
  else if(result.role===Role.MEMBER && userStatus === UserStatus.DELETED){
    await prisma.member.deleteMany({
      where : {
        userId : result.id
      }
    })
  }
  if(userStatus === UserStatus.DELETED){
    await prisma.user.update({
      where : {
        id : userId
      },
      data : {
        isDeleted : true
      }
    })
  }
  

  return result;
};

const updateUserRole = async (userId: string, newRole: Role) => {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: {
        admin: true,
        member: true,
        superAdmin: true,
      },
    });

    if (!user) {
      throw new AppError(status.NOT_FOUND, "User not found");
    }

    const oldRole = user.role;
    if (oldRole === newRole) {
      return user;
    }

    // Prepare data for the new profile
    const baseData = {
      userId: user.id,
      name: user.name,
      profilePhoto: user.image,
      gender: (user.admin?.gender || user.member?.gender || user.superAdmin?.gender) ?? null,
    };

    // Create new profile
    if (newRole === Role.ADMIN) {
      await tx.admin.create({
        data: {
          ...baseData,
          email: user.email,
          phone: user.member?.contactNumber || user.superAdmin?.phone || null,
        },
      });
    } else if (newRole === Role.MEMBER) {
      await tx.member.create({
        data: {
          ...baseData,
          contactNumber: user.admin?.phone || user.superAdmin?.phone || null,
        },
      });
    } else if (newRole === Role.SUPER_ADMIN) {
      await tx.superAdmin.create({
        data: {
          ...baseData,
          email: user.email,
          phone: user.admin?.phone || user.member?.contactNumber || null,
        },
      });
    }

    // Delete old profile
    if (oldRole === Role.ADMIN) {
      await tx.admin.delete({ where: { userId } });
    } else if (oldRole === Role.MEMBER) {
      await tx.member.delete({ where: { userId } });
    } else if (oldRole === Role.SUPER_ADMIN) {
      await tx.superAdmin.delete({ where: { userId } });
    }

    // Update user role
    return await tx.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  });
};


// --- Challenge Management ---

const getAllChallenges = async (queryParams: IQueryParams) => {
  const challengeQueryBuilder = new QueryBuilder(prisma.challenge, queryParams, {
    searchableFields: ["title", "description"],
    filterableFields: ["status", "isPaid", "categoryId"],
  });

  return await challengeQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ category: true })
    .execute();
};

const createChallengeIntoDB = async (payload: any) => {
  return await prisma.challenge.create({
    data: payload,
  });
};

const getChallengeById = async (id: string) => {
  const challenge = await prisma.challenge.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!challenge) throw new AppError(status.NOT_FOUND, "Challenge not found");

  const activeParticipantCount = await prisma.memberChallenge.count({
    where: { challengeId: id },
  });

  return {
    ...challenge,
    activeParticipantCount,
  };
};

const updateChallenge = async (id: string, payload: any) => {
  const challenge = await prisma.challenge.findUnique({ where: { id } });
  if (!challenge) throw new AppError(status.NOT_FOUND, "Challenge not found");

  return await prisma.challenge.update({
    where: { id },
    data: payload,
  });
};

const deleteChallenge = async (id: string) => {
  const challenge = await prisma.challenge.findUnique({ where: { id } });
  if (!challenge) throw new AppError(status.NOT_FOUND, "Challenge not found");

  return await prisma.challenge.delete({
    where: { id },
  });
};

// --- Category Management ---

const getAllCategories = async (queryParams: IQueryParams) => {
  const categoryQueryBuilder = new QueryBuilder(prisma.category, queryParams, {
    searchableFields: ["name", "description"],
    filterableFields: ["isActive"],
  });

  return await categoryQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .execute();
};

const createCategoryIntoDB = async (payload: any) => {
  return await prisma.category.create({
    data: payload,
  });
};

const updateCategory = async (id: string, payload: any) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError(status.NOT_FOUND, "Category not found");

  return await prisma.category.update({
    where: { id },
    data: payload,
  });
};

const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError(status.NOT_FOUND, "Category not found");

  return await prisma.category.delete({
    where: { id },
  });
};

// --- Payment Management ---

const getAllPayments = async (queryParams: IQueryParams) => {
  const paymentQueryBuilder = new QueryBuilder(prisma.payment, queryParams, {
    searchableFields: ["transactionId"],
    filterableFields: ["status"],
  });

  return await paymentQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ memberChallenge: { include: { member: true, challenge: true } } })
    .execute();
};

const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: { memberChallenge: { include: { member: true, challenge: true } } },
  });
  if (!payment) throw new AppError(status.NOT_FOUND, "Payment not found");
  return payment;
};

// --- Submission Management ---

const getAllSubmissions = async (queryParams: IQueryParams) => {
  const submissionQueryBuilder = new QueryBuilder(prisma.submission, queryParams, {
    searchableFields: ["feedBack"],
    filterableFields: ["status", "memberId", "challengeId"],
  });

  return await submissionQueryBuilder
    .search()
    .filter()
    .sort()
    .paginate()
    .include({ member: true, challenge: true, memberChallenge: true })
    .execute();
};

const getPendingSubmissions = async (queryParams: IQueryParams) => {
  const submissionQueryBuilder = new QueryBuilder(prisma.submission, queryParams, {
    searchableFields: ["feedBack"],
    filterableFields: ["memberId", "challengeId"],
  });

  return await submissionQueryBuilder
    .search()
    .filter()
    .where({ status: SubmissionStatus.PENDING })
    .sort()
    .paginate()
    .include({ member: true, challenge: true, memberChallenge: true })
    .execute();
};

const getSubmissionById = async (id: string) => {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { member: true, challenge: true, memberChallenge: true },
  });
  if (!submission) throw new AppError(status.NOT_FOUND, "Submission not found");
  return submission;
};

const updateSubmissionStatus = async (id: string, submissionStatus: SubmissionStatus) => {
  
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { member: true, challenge: true },
  });
  if (!submission) throw new AppError(status.NOT_FOUND, "Submission not found");
  

  const shouldAddPoints =
    submission.status !== SubmissionStatus.APPROVED &&
    submissionStatus === SubmissionStatus.APPROVED;

  const result = await prisma.$transaction(async (tx) => {
    
    const updatedSubmission = await tx.submission.update({
      where: { id },
      data: { status: submissionStatus },
    });

    if (shouldAddPoints) {
      
      const pointsToAdd = submission.challenge?.pointsPerDay ?? 0;
      if (submission.member) {
        
        await tx.member.update({
          where: { id: submission.member.id },
          data: {
            totalPoints: {
              increment: pointsToAdd,
            },
          },
        });
        
        await tx.memberChallenge.update({
          where: { id: submission.memberChallengeId },
          data: {
            pointsAchieved: {
              increment: pointsToAdd,
            },
          },
        });
        console.log("Hi")
      }
    }
console.log("Updated Submission => ", updatedSubmission)
    return updatedSubmission;
  });

  return result;
};

// --- Analytics & Leaderboard ---

const getAnalytics = async () => {
  // Get last 6 months of user growth
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const userGrowth = await prisma.user.groupBy({
    by: ["createdAt"],
    _count: true,
    orderBy: { createdAt: "asc" },
  });

  // Group users by month
  const monthlyUserCounts = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthKey = date.toLocaleString("default", { month: "short" });
    
    const count = userGrowth
      .filter(u => {
        const uDate = new Date(u.createdAt);
        return uDate.getMonth() === date.getMonth() && uDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, u) => sum + u._count, 0);

    return { month: monthKey, users: count };
  });

  // Cumulative user growth
  let cumulativeCount = 0;
  const cumulativeUserGrowth = monthlyUserCounts.map(item => ({
    month: item.month,
    count: (cumulativeCount += item.users),
  }));

  // Challenge completion status
  const submissionStats = await prisma.submission.groupBy({
    by: ["status"],
    _count: true,
  });

  const totalSubmissions = submissionStats.reduce((sum, s) => sum + s._count, 0);

  const challengeCompletionStatus = {
    completed: {
      count: submissionStats.find(s => s.status === SubmissionStatus.APPROVED)?._count || 0,
      percentage: totalSubmissions > 0 
        ? Math.round(((submissionStats.find(s => s.status === SubmissionStatus.APPROVED)?._count || 0) / totalSubmissions) * 100)
        : 0,
    },
    inProgress: {
      count: submissionStats.find(s => s.status === SubmissionStatus.PENDING)?._count || 0,
      percentage: totalSubmissions > 0
        ? Math.round(((submissionStats.find(s => s.status === SubmissionStatus.PENDING)?._count || 0) / totalSubmissions) * 100)
        : 0,
    },
    notStarted: {
      count: submissionStats.find(s => s.status === SubmissionStatus.REJECTED)?._count || 0,
      percentage: totalSubmissions > 0
        ? Math.round(((submissionStats.find(s => s.status === SubmissionStatus.REJECTED)?._count || 0) / totalSubmissions) * 100)
        : 0,
    },
  };

  // Monthly activity (submissions)
  const submissionsByMonth = await prisma.submission.groupBy({
    by: ["createdAt"],
    _count: true,
    orderBy: { createdAt: "asc" },
  });

  const monthlyActivity = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    const monthKey = date.toLocaleString("default", { month: "short" });
    
    const count = submissionsByMonth
      .filter(s => {
        const sDate = new Date(s.createdAt);
        return sDate.getMonth() === date.getMonth() && sDate.getFullYear() === date.getFullYear();
      })
      .reduce((sum, s) => sum + s._count, 0);

    return { month: monthKey, submissions: count };
  });

  // Summary stats
  const [totalUsers, totalEarnings, totalChallenges] = await Promise.all([
    prisma.user.count(),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    }),
    prisma.challenge.count(),
  ]);

  return {
    userGrowth: cumulativeUserGrowth,
    challengeCompletionStatus,
    monthlyActivity,
    summary: {
      totalUsers,
      totalEarnings: totalEarnings._sum.amount || 0,
      totalChallenges,
      totalSubmissions,
    },
  };
};

const getLeaderboard = async () => {
  return await prisma.member.findMany({
    orderBy: { totalPoints: "desc" },
    take: 10,
    include: { user: { select: { email: true, name: true, image: true } } },
  });
};

// --- Dashboard ---

const getDashboardSummary = async () => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  const startOfSixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalMembers,
    membersThisWeek,
    activeChallenges,
    pendingSubmissions,
    totalUsers,
    currentMonthRevenue,
    previousMonthRevenue,
    totalChallenges,
    totalPaidPayments,
    submissionsLastWeek,
    usersLastSixMonths,
  ] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { createdAt: { gte: oneWeekAgo } } }),
    prisma.challenge.count({ where: { status: "ACTIVE" } }),
    prisma.submission.count({ where: { status: SubmissionStatus.PENDING } }),
    prisma.user.count(),
    prisma.payment.aggregate({
      where: { status: "PAID", createdAt: { gte: currentMonthStart } },
      _sum: { amount: true },
    }),
    prisma.payment.aggregate({
      where: {
        status: "PAID",
        createdAt: { gte: previousMonthStart, lte: previousMonthEnd },
      },
      _sum: { amount: true },
    }),
    prisma.challenge.count(),
    prisma.payment.count({ where: { status: "PAID" } }),
    prisma.submission.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: startOfSixMonthsAgo } },
      select: { createdAt: true },
    }),
  ]);

  const currentRevenue = currentMonthRevenue._sum.amount || 0;
  const previousRevenue = previousMonthRevenue._sum.amount || 0;
  const revenueGrowth = previousRevenue > 0 ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100) : 0;

  const dailyActivity = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayKey = date.toLocaleString("default", { weekday: "short" });

    const submissionsForDay = submissionsLastWeek.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return (
        itemDate.getDate() === date.getDate() &&
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    }).length;

    return { day: dayKey, submissions: submissionsForDay };
  });

  const monthlyUserGrowth = Array.from({ length: 6 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const monthLabel = monthDate.toLocaleString("default", { month: "short" });
    const count = usersLastSixMonths.filter((item) => {
      const itemDate = new Date(item.createdAt);
      return itemDate.getMonth() === monthDate.getMonth() && itemDate.getFullYear() === monthDate.getFullYear();
    }).length;

    return { month: monthLabel, count };
  });

  const cumulativeUserGrowth = monthlyUserGrowth.reduce<{ month: string; count: number }[]>((acc, item) => {
    const previousItem = acc[acc.length - 1];
    const previousCount = previousItem ? previousItem.count : 0;
    acc.push({ month: item.month, count: previousCount + item.count });
    return acc;
  }, []);

  const userDirectoryLabel = totalUsers >= 1000 ? `${(totalUsers / 1000).toFixed(1)}K TOTAL` : `${totalUsers} TOTAL`;

  return {
    topMetrics: {
      totalMembers: {
        value: totalMembers,
        change: membersThisWeek,
        changeLabel: `+${membersThisWeek} this week`,
      },
      activeChallenges: {
        value: activeChallenges,
        label: "Live on platform",
      },
      pendingProofs: {
        value: pendingSubmissions,
        label: "Require review",
      },
      monthlyRevenue: {
        value: currentRevenue,
        growth: revenueGrowth,
        growthLabel: `${revenueGrowth >= 0 ? "+" : ""}${revenueGrowth}% growth`,
      },
    },
    submissionActivity: dailyActivity,
    quickActions: {
      reviewSubmissions: {
        label: "Review Submissions",
        count: pendingSubmissions,
        countLabel: `${pendingSubmissions} PENDING`,
      },
      manageChallenges: {
        label: "Manage Challenges",
        count: activeChallenges,
        countLabel: `${activeChallenges} ACTIVE`,
      },
      userDirectory: {
        label: "User Directory",
        count: totalUsers,
        countLabel: userDirectoryLabel,
      },
      detailedAnalytics: {
        label: "Detailed Analytics",
        countLabel: "VIEW REPORTS",
      },
    },
    summary: {
      totalMembers,
      totalUsers,
      totalChallenges,
      activeChallenges,
      pendingSubmissions,
      totalPaidPayments,
      monthlyRevenue: currentRevenue,
      previousMonthRevenue: previousRevenue,
      revenueGrowth,
      membersThisWeek,
      userGrowth: cumulativeUserGrowth,
    },
  };
};

const UpdateSuperAdminBySuperAdmin = async (id: string, payload: any) => {
  const superAdminUser = await prisma.user.findUnique({
    where: { id },
    include: { superAdmin: true },
  });

  if (!superAdminUser || !superAdminUser.superAdmin) {
    throw new AppError(status.NOT_FOUND, "Super Admin not found");
  }

  const superAdminProfile = superAdminUser.superAdmin;

  return await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id },
      data: {
        email: payload.email,
        role: payload.role,
        name: payload.name,
        image: payload.profileImage,
        phoneNumber: payload.phoneNumber,
        gender: payload.gender,
      },
    });

    return await tx.superAdmin.update({
      where: { id: superAdminProfile.id },
      data: {
        name: payload.name ?? superAdminProfile.name,
        profilePhoto: payload.profileImage ?? superAdminProfile.profilePhoto,
        gender: payload.gender ?? superAdminProfile.gender,
      },
    });
  });
};

export const SuperAdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  updateUserStatus,
  updateUserRole,
  getAllChallenges,
  createChallengeIntoDB,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  getAllCategories,
  createCategoryIntoDB,
  updateCategory,
  deleteCategory,
  getAllPayments,
  getPaymentById,
  getAllSubmissions,
  getPendingSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  getAnalytics,
  getLeaderboard,
  getDashboardSummary,
  UpdateSuperAdminBySuperAdmin
};
