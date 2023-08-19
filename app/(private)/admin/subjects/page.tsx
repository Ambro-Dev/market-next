import { Metadata } from "next";

import { Search } from "@/components/dashboard/search";
import { MainNav } from "@/components/dashboard/main-nav";
import TeamSwitcher from "@/components/dashboard/team-switcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, School, Truck, Users } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

type Data = {
  transports: number;
  subjects: number;
  members: number;
};

const getData = async (): Promise<Data> => {
  try {
    const response = await axiosInstance.get(`/api/admin/all`);
    return response.data;
  } catch (error) {
    console.error(error);
    return {
      transports: 0,
      subjects: 0,
      members: 0,
    };
  }
};

export default async function SubjectManagement() {
  const data: Data = await getData();
  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher subjectId="" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 p-8 pt-6">
        <div className="grid">
          <ArrowUp size={24} className="ml-10" />
          <p className="text-sm">
            Wybierz lub wyszukaj istniejący podmiot z listy rozwijanej lub dodaj
            nowy.
          </p>
        </div>
        <Card className="grid">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Podmioty</CardTitle>
            <School size={24} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.subjects}</div>
          </CardContent>
        </Card>
        <Card className="grid">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wszystkie transporty
            </CardTitle>
            <Truck size={24} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.transports}</div>
          </CardContent>
        </Card>
        <Card className="grid">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Wszystkich członków
            </CardTitle>
            <Users size={24} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.members}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
