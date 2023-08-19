import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Truck, Users } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { RecentTransports } from "@/components/dashboard/recent-transports";
import { subject } from "@prisma/client";
import { MembersTable } from "../admin/subjects/[subjectId]/members/members-table";
import { columns } from "../admin/subjects/[subjectId]/members/columns";
import { AddMemberForm } from "../admin/subjects/[subjectId]/members/add-member-form";

type subjectWithTransports = {
  subject: {
    id: string;
    name: string;
    _count: {
      transports: number;
      members: number;
    };
    administrator: {
      id: string;
      username: string;
      email: string;
    };
    accessExpires: Date;
  };
  latestTransports: {
    id: string;
    description: string;
    createdAt: Date;
    vehicle: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
    };
    creator: {
      id: string;
      username: string;
    };
    type: {
      id: string;
      name: string;
    };
    _count: {
      objects: number;
    };
  }[];
};

const getSubject = async (
  subjectId: string
): Promise<subjectWithTransports> => {
  try {
    const res = await axiosInstance.get(
      `/api/subjects/manage?subjectId=${subjectId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return {} as subjectWithTransports;
  }
};

const getSubjectId = async (userId: string): Promise<subject> => {
  try {
    const res = await axiosInstance.get(
      `/api/subjects/manage/subject?userId=${userId}`
    );
    return res.data.subject;
  } catch (error) {
    console.error(error);
    return {} as subject;
  }
};

async function getMembers(subjectId: string) {
  try {
    const res = await axiosInstance.get(
      `/api/subjects/members?subjectId=${subjectId}`
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default async function subjectManagement() {
  const session = await getServerSession(authOptions);
  const subject = await getSubjectId(String(session?.user.id));
  const data = await getSubject(subject.id);
  const members = await getMembers(subject.id);

  const timeToExpire = GetExpireTimeLeft(data.subject.accessExpires);

  return (
    <Card>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-4">
            <div className="col-span-2">
              <div className="flex flex-col justify-center space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                  {data.subject.name}
                </h2>
                {!timeToExpire.isExpired ? (
                  <p className="text-sm">
                    Dostęp dla podmiotu wygaśnie za:{" "}
                    <span className="font-semibold">
                      {timeToExpire.daysLeft}
                    </span>
                    {timeToExpire.daysLeft === 1 ? " dzień" : " dni"}
                  </p>
                ) : (
                  <p className="text-sm text-red-500">
                    Dostęp dla podmiotu wygasł
                  </p>
                )}
              </div>

              <TabsList>
                <TabsTrigger value="overview">Ogólne</TabsTrigger>
                <TabsTrigger value="users">Użytkownicy</TabsTrigger>
                <TabsTrigger value="transports">Transporty</TabsTrigger>
              </TabsList>
            </div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Transporty
                </CardTitle>
                <Truck size={24} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.subject._count.transports}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Konta członków
                </CardTitle>
                <Users size={24} className="text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.subject._count.members}
                </div>
              </CardContent>
            </Card>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="col-span-2 p-2">
                <CardHeader>
                  <CardTitle>Ostatnie transporty</CardTitle>
                  <CardDescription>Transporty ostatnio dodane</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTransports transports={data.latestTransports} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="users">
            <MembersTable columns={columns} data={members} />
            <AddMemberForm subjectId={subject.id} />
          </TabsContent>
          <TabsContent value="transports">
            <div>Transporty</div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
