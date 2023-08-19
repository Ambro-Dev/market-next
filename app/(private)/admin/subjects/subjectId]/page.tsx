import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentTransports } from "@/components/dashboard/recent-transports";

import admin from "@/assets/icons/administrator.png";
import Image from "next/image";
import { Truck, Users } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { GetExpireTimeLeft } from "@/app/lib/getExpireTimeLeft";
import AddSubjectAdmin from "./add-subject-admin";

interface PageProps {
  params: {
    subjectId: string;
  };
}

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

export default async function subjectPage({ params }: PageProps) {
  const data = await getSubject(params.subjectId);

  const timeToExpire = GetExpireTimeLeft(data.subject.accessExpires);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex flex-col justify-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {data.subject.name}
        </h2>
        {!timeToExpire.isExpired ? (
          <p className="text-sm">
            Dostęp dla podmiotu wygaśnie za:{" "}
            <span className="font-semibold">{timeToExpire.daysLeft}</span>
            {timeToExpire.daysLeft === 1 ? " dzień" : " dni"}
          </p>
        ) : (
          <p className="text-sm text-red-500">Dostęp dla podmiotu wygasł</p>
        )}
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Ogólne</TabsTrigger>
          <TabsTrigger value="analytics" disabled>
            Analityka
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            Raporty
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="col-span-2 gap-4 flex flex-row">
              {data.subject.administrator ? (
                <>
                  <div className="w-3/4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Administrator podmiotu
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data.subject.administrator.username}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data.subject.administrator.email}
                      </p>
                    </CardContent>
                  </div>
                  <div className="flex items-center justify-center w-1/4">
                    <Image src={admin} alt="admin" width={48} height={48} />
                  </div>
                </>
              ) : (
                <div className="flex flex-row items-center justify-center w-full space-x-6 p-5">
                  <p className="text-sm text-center text-muted-foreground">
                    Jednostka nie posiada administratora, dodaj go.
                    Administrator będzie miał możliwość zarządzania jednostką.
                  </p>
                  <AddSubjectAdmin subjectId={params.subjectId} />
                </div>
              )}
            </Card>
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
      </Tabs>
    </div>
  );
}
